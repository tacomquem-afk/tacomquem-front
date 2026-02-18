# Plan: Implementar Beta Program no Frontend

## TL;DR
Adaptar o frontend para o modo beta: usuarios beta logam normalmente, registro é bloqueado, login de não-beta mostra painel amigável (ao invés de erro genérico), e a landing page comunica exclusividade sem perder interesse dos visitantes. Usa nova env var `NEXT_PUBLIC_BETA_MODE` separada do `NEXT_PUBLIC_AUTH_ENABLED` existente.

## Insights da Discovery
- **API já implementada:** Backend usa `access_tier` (PUBLIC/BETA/ARCHIVED) e retorna **403** no login quando `BETA_MODE_ENABLED=true` e user não é BETA
- **Feature flag existente:** `config.authEnabled` em `src/lib/config.ts` controla se auth UI existe (conceito "em breve")
- **Error handling:** `ApiError` tem `{ error: string, status: number }` — 403 é detectável no catch do login form
- **Pattern de disabled:** Login e Register pages já tem pattern de "auth desabilitada" com early return — reutilizável
- **Landing page:** Server Component com condicionais `config.authEnabled` no hero CTA, navbar e footer
- **Auth Provider:** `login()` faz throw do erro da API sem tratamento — bubbles up para o form

## Opções Avaliadas
1. ❌ **Reusar `NEXT_PUBLIC_AUTH_ENABLED`** — Confunde "auth não existe ainda" com "auth existe mas é restrita". Lógica booleana impossível de representar 3 estados.
2. ⚠️ **Middleware.ts para bloquear rotas** — Overkill para MVP. Server components já fazem guard no dashboard layout.
3. ✅ **Nova env var `NEXT_PUBLIC_BETA_MODE` + tratamento inline do 403** — Separação clara de conceitos, detecção do 403 no form, reuso de patterns existentes.

## Steps

### Fase 1: Config & Environment
1. Adicionar `betaModeEnabled` ao `config` em `src/lib/config.ts`:
   - `betaModeEnabled: process.env.NEXT_PUBLIC_BETA_MODE === "true"`
   - Default `false` (opt-in, seguro)
2. Adicionar `NEXT_PUBLIC_BETA_MODE=true` ao `.env.local`
3. Adicionar `NEXT_PUBLIC_BETA_MODE=false` ao `.env.example`

### Fase 2: Componente de Rejeição Beta
4. Criar `src/components/auth/beta-rejection-panel.tsx`:
   - Ícone de cadeado com badge azul
   - Título: "Acesso Beta Privado"
   - Mensagem amigável: "O TáComQuem está em acesso antecipado por convite. Em breve abriremos para todos!"
   - Estilo consistente: bordas `[#2b8cee]/30`, bg `[#2b8cee]/5`
   - Animação: `animate-in slide-in-from-bottom-4`

### Fase 3: Login — Tratamento do 403
5. Modificar `src/app/(auth)/login/login-form.tsx`:
   - Adicionar state `isBetaRejected` (boolean)
   - No `onSubmit` catch: se `apiError.status === 403`, setar `isBetaRejected = true`
   - Resetar `isBetaRejected` no início do submit (permite tentar outra conta)
   - No JSX: renderizar `BetaRejectionPanel` quando `isBetaRejected`, substituindo `FormError`
   - Form continua visível abaixo (usuário pode tentar outra conta)

### Fase 4: Registro — Bloqueio Durante Beta
6. Modificar `src/app/(auth)/register/page.tsx`:
   - Adicionar check `config.betaModeEnabled` antes do check `!config.authEnabled`
   - Mostrar página informativa com:
     - Título: "Acesso Beta Privado"
     - Mensagem: "O cadastro está disponível apenas por convite durante o beta."
     - Link para `/login` ("Já tenho um convite")
   - Reutilizar pattern visual existente da página de auth desabilitada

### Fase 5: Landing Page — Modo Beta
7. Modificar navbar em `src/app/page.tsx` (linhas ~70-91):
   - Botão CTA: "Começar Grátis" → "Acessar Beta" (link para `/login` ao invés de `/register`)
   - Adicionar badge "Beta Privado" (pill amber com ícone Sparkles)
8. Modificar hero badge (linhas ~101-107):
   - Texto: "Novo Jeito de Emprestar" → "Acesso Antecipado"
9. Modificar hero CTA (linhas ~116-138):
   - Substituir botão "Começar agora" por:
     - Bloco informativo "Em acesso por convite — Em breve para todos"
     - Link "Já tenho um convite — Entrar" → `/login`
   - Manter botão "Ver como funciona"
10. Modificar CTA final (linhas ~515-537):
    - Substituir botão "Começar Agora Gratuitamente" por:
      - Mensagem: "O TáComQuem está crescendo devagar e com qualidade."
      - Link "Tenho um convite — Acessar" → `/login`

### Fase 6: Verificação
11. Testar com `NEXT_PUBLIC_BETA_MODE=false` — tudo funciona como antes
12. Testar com `NEXT_PUBLIC_BETA_MODE=true` — landing page mostra linguagem beta
13. Testar `/register` com beta mode — mostra página de beta privado
14. Testar login com usuário beta — funciona normalmente
15. Testar login com usuário não-beta — mostra BetaRejectionPanel (403)
16. Rodar `bun run check` — sem erros TypeScript nem lint

## Relevant Files
- `src/lib/config.ts` — Adicionar `betaModeEnabled` ao config existente
- `src/components/auth/beta-rejection-panel.tsx` — Novo componente de rejeição beta
- `src/app/(auth)/login/login-form.tsx` — Tratar 403, mostrar BetaRejectionPanel
- `src/app/(auth)/register/page.tsx` — Bloquear registro durante beta
- `src/app/page.tsx` — Adaptar navbar, hero, CTA para linguagem beta
- `.env.local` — Adicionar `NEXT_PUBLIC_BETA_MODE=true`
- `.env.example` — Adicionar `NEXT_PUBLIC_BETA_MODE=false`

## Verification
1. `NEXT_PUBLIC_BETA_MODE=false` → tudo funciona como antes (regressão)
2. `NEXT_PUBLIC_BETA_MODE=true` → landing page mostra badges e CTAs de beta
3. `NEXT_PUBLIC_BETA_MODE=true` → `/register` mostra página informativa de beta privado
4. `NEXT_PUBLIC_BETA_MODE=true` → login com usuário `access_tier=BETA` → acesso normal ✅
5. `NEXT_PUBLIC_BETA_MODE=true` → login com usuário `access_tier=PUBLIC` → BetaRejectionPanel com 403 ❌
6. Rodar `bun run check` → sem erros TypeScript nem lint

## Decisions
- **Separado do authEnabled:** `betaModeEnabled` é conceito diferente — auth existe mas é restrita vs auth não existe ainda
- **Registro fechado:** Sem criar contas durante beta; somente quem já foi adicionado pelo admin pode logar
- **Sem waitlist:** MVP simples, apenas mensagem informativa — waitlist pode ser adicionada depois
- **403 inline:** Não redireciona para outra página; painel amigável aparece no próprio form de login
- **Feature toggle:** `NEXT_PUBLIC_BETA_MODE` permite ligar/desligar sem deploy
- **Sem tocar dashboard:** Usuários beta têm experiência completamente normal após login

## Further Considerations
1. **Waitlist futura:** Quando quiser capturar emails, adicionar `WaitlistForm` no hero CTA e no `BetaRejectionPanel`
2. **Registro aberto futuro:** Se decidir abrir registro durante beta, basta remover o early return em `register/page.tsx` e ajustar redirect pós-registro
3. **Social login:** Google OAuth também passará pelo 403 do backend — o redirect de volta precisará tratar o erro (considerar para próxima iteração)
4. **Rollback:** Desativar `NEXT_PUBLIC_BETA_MODE=false` → volta ao comportamento normal imediatamente
