# TáComQuem Frontend — Design da Landing Page e Login

**Data:** 2026-02-04
**Status:** Em revisão
**Baseado em:** Mockups de UI, Web Interface Guidelines, samples existentes

---

## 1. Visão Geral

Redesign das páginas públicas do TáComQuem seguindo as diretrizes do Web Interface Guidelines e mantendo consistência visual com os mockups de referência (Lightning Loan Registration e Dashboard Central).

**Páginas incluídas:**
- Landing Page (`/`)
- Login (`/login`)
- Registro (`/register`)

---

## 2. Referências de Design

### 2.1 Mockups Base

| Referência | Caminho | Elementos Relevantes |
|------------|---------|---------------------|
| Lightning Loan | `docs/samples/lightning_loan_registration/screen.png` | Inputs com ícones, botão CTA azul, fundo escuro |
| Dashboard Central | `docs/samples/tácomquem_central_dashboard/screen.png` | Cards, badges de status, layout sidebar |

### 2.2 Elementos Visuais Identificados

**Cores:**
- Background principal: `#0D1117` (dark navy)
- Surface/Cards: `#161B22`
- Inputs: `#1C2128` com borda sutil
- Primary CTA: `#3B82F6` (blue-500)
- Primary Hover: `#2563EB` (blue-600)
- Success: `#22C55E` (green-500)
- Text primary: `#F0F6FC`
- Text secondary: `#8B949E`

**Tipografia:**
- Headings: Inter, weight 600-700
- Body: Noto Sans, weight 400-500
- Tamanhos: seguir escala Tailwind (text-sm, text-base, text-lg, text-xl, text-2xl, text-4xl)

**Bordas:**
- Radius padrão: `0.75rem` (12px)
- Radius inputs: `0.5rem` (8px)
- Border color: `rgba(255,255,255,0.1)`

---

## 3. Landing Page

### 3.1 Estrutura

```
┌─────────────────────────────────────────────────────────────────────┐
│  HEADER                                                             │
│  [Logo TáComQuem]                                    [Entrar]       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  HERO SECTION                                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                                                             │   │
│  │         Nunca mais esqueça                                  │   │
│  │         quem está com suas coisas                           │   │
│  │                                                             │   │
│  │    Gerencie empréstimos entre amigos de forma               │   │
│  │    simples e organizada.                                    │   │
│  │                                                             │   │
│  │    [  Começar Grátis  ]    [ Saiba mais ]                   │   │
│  │                                                             │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  HOW IT WORKS                                                       │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐           │
│  │      📷       │  │      🔗       │  │      ✅       │           │
│  │   Registre    │  │   Compartilhe │  │   Confirme    │           │
│  │   o item      │  │   o link      │  │   a devolução │           │
│  │               │  │               │  │               │           │
│  │ Cadastre seus │  │ Envie o link  │  │ Acompanhe o   │           │
│  │ itens com     │  │ para quem     │  │ status e      │           │
│  │ foto e nome   │  │ pegou         │  │ histórico     │           │
│  └───────────────┘  └───────────────┘  └───────────────┘           │
│                                                                     │
│  SOCIAL PROOF / FEATURES                                            │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  [Mock visual do dashboard com cards de itens]              │   │
│  │                                                             │   │
│  │  - Veja quem está com o quê                                 │   │
│  │  - Histórico completo de empréstimos                        │   │
│  │  - Lembretes automáticos                                    │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  CTA FINAL                                                          │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │       Pronto para organizar seus empréstimos?               │   │
│  │                                                             │   │
│  │              [  Criar conta grátis  ]                       │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  FOOTER                                                             │
│  © 2026 TáComQuem                                                   │
└─────────────────────────────────────────────────────────────────────┘
```

### 3.2 Componentes

| Componente | Descrição |
|------------|-----------|
| `Header` | Logo + botão "Entrar" (variant outline) |
| `HeroSection` | Headline, subtítulo, CTAs |
| `HowItWorks` | 3 cards com ícones e descrições |
| `Features` | Mock visual + lista de benefícios |
| `CTASection` | Call-to-action final |
| `Footer` | Copyright simples |

### 3.3 Interações

- **Scroll suave** para seções (se houver navegação interna)
- **Hover states** em todos os botões e links
- **Animação de entrada** sutil nos cards (fade-in + slide-up)
- **Respeitar `prefers-reduced-motion`**

---

## 4. Página de Login

### 4.1 Estrutura

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│                         [Logo TáComQuem]                            │
│                                                                     │
│                    ┌─────────────────────────┐                      │
│                    │                         │                      │
│                    │     Bem-vindo de volta  │                      │
│                    │                         │                      │
│                    │  ┌───────────────────┐  │                      │
│                    │  │ 📧 seu@email.com  │  │                      │
│                    │  └───────────────────┘  │                      │
│                    │                         │                      │
│                    │  ┌───────────────────┐  │                      │
│                    │  │ 🔒 ••••••••       │  │                      │
│                    │  └───────────────────┘  │                      │
│                    │                         │                      │
│                    │  [ ] Lembrar de mim     │                      │
│                    │                         │                      │
│                    │  [      Entrar      ]   │                      │
│                    │                         │                      │
│                    │  ─────── ou ────────    │                      │
│                    │                         │                      │
│                    │  [ G Continuar com      │                      │
│                    │      Google ]           │                      │
│                    │                         │                      │
│                    │  Esqueceu a senha?      │                      │
│                    │                         │                      │
│                    │  ───────────────────    │                      │
│                    │                         │                      │
│                    │  Não tem conta?         │                      │
│                    │  Cadastre-se            │                      │
│                    │                         │                      │
│                    └─────────────────────────┘                      │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 4.2 Campos do Formulário

| Campo | Tipo | Atributos | Validação |
|-------|------|-----------|-----------|
| Email | `email` | `autocomplete="email"`, `spellCheck={false}` | Email válido, obrigatório |
| Senha | `password` | `autocomplete="current-password"` | Mínimo 8 caracteres |
| Lembrar | `checkbox` | - | Opcional |

### 4.3 Estados

| Estado | Comportamento |
|--------|---------------|
| Default | Formulário vazio, botão habilitado |
| Loading | Spinner no botão, inputs desabilitados |
| Error | Mensagem inline, borda vermelha no campo |
| Success | Redirect para `/dashboard` |

### 4.4 Mensagens

| Cenário | Mensagem |
|---------|----------|
| Credenciais inválidas | "Email ou senha incorretos" |
| Email não verificado | "Verifique seu email antes de entrar" |
| Conta não encontrada | "Não encontramos uma conta com este email" |
| Sucesso no registro | Banner "Conta criada! Faça login para continuar" |

---

## 5. Página de Registro

### 5.1 Estrutura

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│                         [Logo TáComQuem]                            │
│                                                                     │
│                    ┌─────────────────────────┐                      │
│                    │                         │                      │
│                    │     Criar sua conta     │                      │
│                    │                         │                      │
│                    │  ┌───────────────────┐  │                      │
│                    │  │ 👤 Seu nome       │  │                      │
│                    │  └───────────────────┘  │                      │
│                    │                         │                      │
│                    │  ┌───────────────────┐  │                      │
│                    │  │ 📧 seu@email.com  │  │                      │
│                    │  └───────────────────┘  │                      │
│                    │                         │                      │
│                    │  ┌───────────────────┐  │                      │
│                    │  │ 🔒 ••••••••       │  │                      │
│                    │  └───────────────────┘  │                      │
│                    │  Mínimo 8 caracteres    │                      │
│                    │                         │                      │
│                    │  [    Criar conta   ]   │                      │
│                    │                         │                      │
│                    │  ─────── ou ────────    │                      │
│                    │                         │                      │
│                    │  [ G Continuar com      │                      │
│                    │      Google ]           │                      │
│                    │                         │                      │
│                    │  ───────────────────    │                      │
│                    │                         │                      │
│                    │  Já tem conta?          │                      │
│                    │  Entrar                 │                      │
│                    │                         │                      │
│                    └─────────────────────────┘                      │
│                                                                     │
│                    Ao criar conta, você concorda                    │
│                    com os Termos de Uso                             │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 5.2 Campos do Formulário

| Campo | Tipo | Atributos | Validação |
|-------|------|-----------|-----------|
| Nome | `text` | `autocomplete="name"` | Obrigatório, mínimo 2 caracteres |
| Email | `email` | `autocomplete="email"`, `spellCheck={false}` | Email válido, obrigatório |
| Senha | `password` | `autocomplete="new-password"` | Mínimo 8 caracteres |

### 5.3 Indicador de Força de Senha

```
Fraca     [████░░░░░░░░░░░░]  Vermelho
Média     [████████░░░░░░░░]  Amarelo
Forte     [████████████░░░░]  Verde
Excelente [████████████████]  Verde escuro
```

---

## 6. Conformidade Web Interface Guidelines

### 6.1 Acessibilidade

| Regra | Implementação |
|-------|---------------|
| Labels em inputs | `<label htmlFor>` ou wrapper label |
| `aria-label` em botões de ícone | Botão Google, toggle senha |
| Skip link | Link "Pular para conteúdo" no header |
| Focus visible | `focus-visible:ring-2 focus-visible:ring-primary` |
| Hierarquia de headings | h1 > h2 > h3 sequencial |

### 6.2 Formulários

| Regra | Implementação |
|-------|---------------|
| `autocomplete` | email, password, name |
| `inputmode` | `email` para campo de email |
| Não bloquear paste | Permitir colar em todos os campos |
| Erros inline | Mensagem abaixo do campo com erro |
| Focus no primeiro erro | `firstErrorField.focus()` no submit |

### 6.3 Performance

| Regra | Implementação |
|-------|---------------|
| Imagens com dimensões | `width` e `height` explícitos |
| Lazy loading | `loading="lazy"` para imagens below-fold |
| `prefers-reduced-motion` | Desabilitar animações se preferido |

### 6.4 Dark Mode

| Regra | Implementação |
|-------|---------------|
| `color-scheme: dark` | No `<html>` |
| `theme-color` meta | `#0D1117` |

---

## 7. Componentes Reutilizáveis

### 7.1 Novos Componentes

| Componente | Caminho | Descrição |
|------------|---------|-----------|
| `Logo` | `src/components/shared/logo.tsx` | Logo com link para home |
| `AuthCard` | `src/components/auth/auth-card.tsx` | Card wrapper para forms de auth |
| `SocialLoginButton` | `src/components/auth/social-login-button.tsx` | Botão OAuth |
| `PasswordInput` | `src/components/forms/password-input.tsx` | Input com toggle visibilidade |
| `FormError` | `src/components/forms/form-error.tsx` | Mensagem de erro inline |
| `Divider` | `src/components/ui/divider.tsx` | Linha com texto "ou" |
| `FeatureCard` | `src/components/landing/feature-card.tsx` | Card de feature |
| `HeroSection` | `src/components/landing/hero-section.tsx` | Seção hero |

### 7.2 Composição de Páginas

```
Landing Page
├── Header
│   ├── Logo
│   └── Button (Entrar)
├── HeroSection
│   ├── Heading
│   ├── Text
│   └── Buttons (CTA)
├── HowItWorks
│   └── FeatureCard (x3)
├── FeaturesSection
│   └── Image + List
├── CTASection
│   └── Button
└── Footer

Login Page
├── Logo
└── AuthCard
    ├── Heading
    ├── Form
    │   ├── Input (email)
    │   ├── PasswordInput
    │   ├── Checkbox (lembrar)
    │   ├── Button (submit)
    │   ├── Divider
    │   └── SocialLoginButton
    └── Links
        ├── Forgot password
        └── Register

Register Page
├── Logo
└── AuthCard
    ├── Heading
    ├── Form
    │   ├── Input (nome)
    │   ├── Input (email)
    │   ├── PasswordInput
    │   ├── PasswordStrength
    │   ├── Button (submit)
    │   ├── Divider
    │   └── SocialLoginButton
    ├── Links (Login)
    └── Terms notice
```

---

## 8. Assets Necessários

| Asset | Formato | Uso |
|-------|---------|-----|
| Logo TáComQuem | SVG | Header, páginas de auth |
| Ícone Google | SVG | Botão OAuth |
| Ícones de features | Lucide React | Cards de features |
| Mock do dashboard | PNG/WebP | Seção de features |

---

## 9. Responsividade

### 9.1 Breakpoints

| Breakpoint | Largura | Comportamento |
|------------|---------|---------------|
| Mobile | < 640px | Stack vertical, padding reduzido |
| Tablet | 640-1024px | 2 colunas em features |
| Desktop | > 1024px | Layout completo |

### 9.2 Adaptações Mobile

- Header: Logo centralizado, botão como ícone
- Hero: Texto menor, botões empilhados
- Features: Cards em coluna única
- Auth: Card ocupa largura total com margem

---

## 10. Referências

- **Web Interface Guidelines:** Vercel
- **Mockup Registration:** [docs/samples/lightning_loan_registration/](../../samples/lightning_loan_registration/)
- **Mockup Dashboard:** [docs/samples/tácomquem_central_dashboard/](../../samples/tácomquem_central_dashboard/)
- **shadcn/ui:** https://ui.shadcn.com
- **Lucide Icons:** https://lucide.dev
