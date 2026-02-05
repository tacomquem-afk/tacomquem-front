# TáComQuem Frontend — Design do Setup

**Data:** 2026-02-04
**Status:** Validado
**Baseado em:** Mockups de UI e documentação da API

---

## 1. Visão Geral

Frontend web para o TáComQuem - plataforma de gestão de empréstimos de itens pessoais entre amigos. Interface moderna, dark mode, responsiva.

**Funcionalidades principais:**
- Dashboard com visão geral dos empréstimos
- Registro rápido de empréstimos ("Registro Relâmpago")
- Gestão de itens pessoais
- Confirmação de empréstimos via link público
- Autenticação (Email/Senha + Google OAuth)

---

## 2. Stack Técnica

| Tecnologia | Uso |
|------------|-----|
| **Bun** | Runtime e package manager |
| **Next.js 15** | Framework React (App Router) |
| **TypeScript** | Linguagem (strict mode) |
| **Tailwind CSS** | Estilização utility-first |
| **shadcn/ui** | Componentes base |
| **Zod** | Validação de schemas |

---

## 3. Design System

### 3.1 Cores

| Nome | Valor | Uso |
|------|-------|-----|
| primary | `#2b8cee` | Botões, links, elementos de destaque |
| background | `#101922` | Fundo principal (dark mode) |
| surface | `#1a2633` | Cards, modais |
| surface-light | `#243040` | Hover states |
| border | `#2d3a4d` | Bordas |
| success | `#22c55e` | Status positivo |
| warning | `#f59e0b` | Alertas |
| error | `#ef4444` | Erros |

### 3.2 Tipografia

| Elemento | Fonte | Peso |
|----------|-------|------|
| Headings | Inter | 600-700 |
| Body | Noto Sans | 400-500 |

### 3.3 Espaçamento

Seguir escala do Tailwind: `4, 8, 12, 16, 24, 32, 48, 64`

### 3.4 Bordas

- Raio padrão: `0.5rem` (8px)
- Raio grande: `0.75rem` (12px)

---

## 4. Estrutura de Pastas

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Grupo de rotas de auth
│   │   ├── login/
│   │   ├── register/
│   │   └── forgot-password/
│   ├── (dashboard)/        # Grupo de rotas protegidas
│   │   ├── dashboard/
│   │   ├── items/
│   │   └── loans/
│   ├── (public)/           # Rotas públicas
│   │   └── link/[token]/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/                 # shadcn/ui (auto-gerado)
│   ├── forms/              # Componentes de formulário
│   ├── layouts/            # Header, Sidebar, Footer
│   └── shared/             # Componentes compartilhados
├── lib/
│   ├── api/                # Cliente API
│   ├── auth/               # Gerenciamento de tokens
│   └── utils/              # Utilitários
├── hooks/                  # Custom hooks
├── providers/              # Context providers
├── actions/                # Server Actions
├── types/                  # TypeScript types
└── styles/                 # CSS global
```

---

## 5. Autenticação

### 5.1 Estratégia

- JWT stateless (access + refresh tokens)
- Access token: 7 dias
- Refresh token: 30 dias
- Armazenamento: localStorage (client-side)

### 5.2 Fluxo

```
Login → API retorna tokens → Salva em localStorage
                                    ↓
                          Requisições com Authorization: Bearer <token>
                                    ↓
                          401 Unauthorized → Refresh automático
                                    ↓
                          Refresh falha → Logout
```

---

## 6. Comunicação com API

### 6.1 Base URL

```
Development: http://localhost:5173
Production: https://api.tacomquem.com
```

### 6.2 Endpoints Principais

| Grupo | Endpoints |
|-------|-----------|
| Auth | `/api/auth/login`, `/api/auth/register`, `/api/auth/me` |
| Items | `/api/items` (CRUD) |
| Loans | `/api/loans` (CRUD + confirm/return) |
| Links | `/api/links/:token` (público) |
| Dashboard | `/api/dashboard` |

### 6.3 Tipos de Resposta

```typescript
// Sucesso
{ user: User }
{ items: Item[] }
{ loan: Loan, confirmUrl: string }

// Erro
{ error: string }
```

---

## 7. Performance (Vercel Best Practices)

### 7.1 Regras Aplicadas

| Regra | Aplicação |
|-------|-----------|
| `async-suspense-boundaries` | Suspense em páginas com data fetching |
| `bundle-barrel-imports` | Import direto, sem index.ts barrels |
| `bundle-dynamic-imports` | next/dynamic para componentes pesados |
| `server-cache-react` | React.cache() para deduplicação |
| `server-auth-actions` | Autenticação em todas server actions |

### 7.2 Otimizações

- Server Components por padrão
- Client Components apenas quando necessário
- Streaming com Suspense
- Image optimization (AVIF/WebP)
- Font optimization (next/font)

---

## 8. Páginas

### 8.1 Landing Page (`/`)

- Hero com CTA
- Explicação do produto
- Link para login/registro

### 8.2 Auth Pages (`/login`, `/register`, `/forgot-password`)

- Formulários centralizados
- Links entre páginas
- Opção Google OAuth

### 8.3 Dashboard (`/dashboard`)

- Cards de estatísticas (Meus Itens, Emprestados, Peguei Emprestado)
- Lista de empréstimos recentes
- Botão "Registrar Empréstimo"
- Sidebar com navegação

### 8.4 Items (`/items`)

- Grid de cards de itens
- Filtros e busca
- Modal de criação/edição

### 8.5 Loans (`/loans`)

- Lista de empréstimos
- Filtros por status
- Ações (devolver, cancelar, lembrar)

### 8.6 Link Público (`/link/[token]`)

- Detalhes do empréstimo (público)
- Botão "Confirmar" (requer login)

---

## 9. Referências

- **API Spec:** [docs/api/ta-com-quem-docs-api.json](../../api/ta-com-quem-docs-api.json)
- **Mockup Dashboard:** [docs/samples/tácomquem_central_dashboard/](../../samples/tácomquem_central_dashboard/)
- **Mockup Registro:** [docs/samples/lightning_loan_registration/](../../samples/lightning_loan_registration/)
- **Best Practices:** [.claude/skills/vercel-react-best-practices/](../../../.claude/skills/vercel-react-best-practices/)
