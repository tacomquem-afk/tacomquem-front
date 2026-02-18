# Plan: Implementar Beta Program com Controle de Usuários

## TL;DR
Sistema de beta testing persistente que controla acesso à aplicação por lista de usuários específicos. Usa "Access Tier" (novo conceito separado do RBAC admin) para marcar quem está em beta e impede login de quem não tiver permissão. Mantém auditoria completa de quem foi adicionado/removido.

## Insights da Discovery
- **RBAC existente:** 5 roles admin (USER, ANALYST, SUPPORT, MODERATOR, SUPER_ADMIN)
- **Banco de dados:** PostgreSQL com Drizzle ORM
- **Encrypted data:** Emails/nomes são criptografados; usar decriptação conforme necessário
- **Focus:** Beta testing é separado de admin roles — não misturar com RBAC admin

## Opções Avaliadas
1. ❌ **Usa role SUPER_ADMIN para beta** — Confunde propósitos (admin vs usuário)
2. ⚠️ **Usa campo booleano `is_beta_tester`** — Simples, mas sem auditoria e sem planos para versões futuras do beta
3. ✅ **Usa enum `access_tier` (PUBLIC, BETA, ARCHIVED)** — Escalável, auditável, permite crescimento para "tiered access programs"

## Steps

### Fase 1: Schema & Data (Configuração Inicial)
1. Adicionar coluna `access_tier` (enum: PUBLIC, BETA, ARCHIVED) a `users`
   - Padrão: PUBLIC (usuários normais)
   - BETA: Beta testers
   - ARCHIVED: Usuários inativos/bloqueados
2. Adicionar coluna `beta_added_at` (timestamp) — quando entrou no programa
3. Criar tabela `beta_program_audit` para auditoria:
   - `id`, `admin_id`, `user_id`, `action` (added/removed), `reason`, `ip_address`, `created_at`
   - Rastreia quem adicionou/removeu e quando
4. Executar `bun run db:generate` + `bun run db:migrate`

### Fase 2: Controle de Acesso (Aplicação)
5. Modificar rota de **login** para rejeitar não-beta:
   - Se `access_tier` ≠ BETA e Env está em BETA_MODE_ENABLED, retornar erro 403
   - Error message: "Beta access not available"
6. Criar **rota admin** `POST /api/admin/beta-program/add-user` (SUPER_ADMIN only):
   - Params: `email`, `reason` (opcional)
   - Busca usuário por email
   - Muda `access_tier` para BETA
   - Log na `beta_program_audit`
7. Criar **rota admin** `POST /api/admin/beta-program/remove-user`:
   - Params: `userId`, `reason`
   - Muda `access_tier` de volta para PUBLIC
   - Log na `beta_program_audit`
8. Criar **rota admin** `GET /api/admin/beta-program/list`:
   - Lista todos com tier BETA
   - Paginado, com filtro por status
9. Criar **serviço** `src/services/admin/beta-program.ts`:
   - Funções: `addBetaUser()`, `removeBetaUser()`, `listBetaUsers()`, `isBetaUserAllowed()`
   - Validações: email exists, user não bloqueado, etc.

### Fase 3: Ambiente & Controle (Feature Toggle)
10. Adicionar `.env` variable:
    - `BETA_MODE_ENABLED=false` (default) — desativa rejeição no login
    - Permite ligar/desligar beta sem redeployar
11. Criar helper na rota de auth:
    - Checagem: `if (env.BETA_MODE_ENABLED && user.access_tier !== 'BETA') throw Forbidden(...)`

### Fase 4: Ferramentas de Gerenciamento
12. Criar script `src/scripts/bulk-add-beta-users.ts`:
    - Lê arquivo CSV com emails
    - Adiciona em batch à tabela de beta
    - Reporta sucessos/falhas
    - Exemplo: `bun run beta:add-batch < users.csv`
13. Criar script `src/scripts/export-beta-stats.ts`:
    - Exporta lista de beta testers + quando foram adicionados
    - Usa para relatórios de cobertura

### Fase 5: Testes & Validação
14. Escrever testes:
    - `src/services/admin/__tests__/beta-program.test.ts`
    - Casos: adicionar, remover, validação de estado, duplicação
    - Mock da DB com Drizzle
15. Rodar `bun run qa` + `bun test`

### Fase 6: Deploy & Comunicação
16. Deploy com `BETA_MODE_ENABLED=false` (acesso aberto inicialmente)
17. Quando pronto, enviar lista de beta testers para script de bulk-add
18. Testar com um usuário beta vs um não-beta
19. Ativar `BETA_MODE_ENABLED=true` em produção

## Relevant Files
- `src/db/schema.ts` — Adicionar `access_tier` enum e colunas em `users` + nova tabela `beta_program_audit`
- `src/routes/auth/index.ts` — Adicionar check de `access_tier` na rota POST `/login`
- `src/routes/admin/` — Criar novo arquivo `src/routes/admin/beta-program.ts` com 3 rotas (add, remove, list)
- `src/services/admin/beta-program.ts` — Lógica de negócio para beta program (novo arquivo)
- `src/services/admin/__tests__/beta-program.test.ts` — Testes unitários
- `.env.example` — Adicionar `BETA_MODE_ENABLED=false`
- `drizzle/migrations/` — Será gerada automaticamente pelo Drizzle após schema.ts

## Verification
1. Executar migrations: `bun run db:migrate`
2. Testar login de usuário NÃO-beta (deve passar com BETA_MODE_ENABLED=false)
3. Testar rota admin POST `/api/admin/beta-program/add-user` com email válido
4. Ativar `BETA_MODE_ENABLED=true` no `.env`
5. Testar login de:
   - Usuário com `access_tier=BETA` → deve aceitar ✅
   - Usuário com `access_tier=PUBLIC` → deve rejeitar com 403 ❌
6. Rodar `bun test src/services/admin/__tests__/beta-program.test.ts` — todos passam
7. Rodar `bun run qa` — sem erros TypeScript nem lint

## Decisions
- **Separado do RBAC admin:** Beta program é para usuários normais, roles admin são separadas
- **Access tiers (enum):** Mais escalável que booleano; suporta ARCHIVED ou outros states no futuro
- **Auditoria obrigatória:** Rastreia quem adicionou/removeu beta testers e quando
- **Feature toggle:** `BETA_MODE_ENABLED` permite ligar/desligar sem deploy
- **Batch tooling:** Scripts para gerenciar listas de usuários em volume

## Further Considerations
1. **Escalabilidade:** Se crescer para 100k+ beta users, considerar índices em `access_tier` e `beta_added_at`
2. **Comunicação:** Quando remover usuário do beta, não enviar email automaticamente — deixar para admin decidir
3. **Rollback:** Se beta der ruim, desativar `BETA_MODE_ENABLED=true` → volta pra `false` imediatamente (feature toggle)
