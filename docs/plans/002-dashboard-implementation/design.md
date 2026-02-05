# TáComQuem Dashboard — Design Specification

**Data:** 2026-02-05
**Status:** Pronto para implementação
**Baseado em:** [Mockup Dashboard](../../samples/tácomquem_central_dashboard/), API docs

---

## 1. Visão Geral

Dashboard principal do TáComQuem onde usuários visualizam seus empréstimos ativos, estatísticas e atividades recentes. Interface client-side com React Query para data fetching, atualizações em tempo real e cache inteligente.

**Objetivos:**
- Visão rápida de itens emprestados e pegos emprestado
- Cards visuais com fotos e status dos itens
- Timeline de atividades recentes
- Check-in de bem-estar social (feature única)
- Responsivo e acessível (WCAG 2.1 AA)

---

## 2. Abordagem Técnica

### 2.1 Estratégia: Client-Side com React Query

**Por quê Client-Side?**
- Dashboard precisa de atualizações frequentes (empréstimos mudam de status)
- Interações ricas (drag-and-drop futuro, filtros dinâmicos)
- Cache automático melhora UX (dados offline, refetch inteligente)
- Melhor para features em tempo real futuras (WebSocket)

**React Query Benefits:**
```typescript
✓ Cache automático com invalidação inteligente
✓ Refetch strategies (window focus, network reconnect)
✓ Loading/error states built-in
✓ Optimistic updates para UX fluida
✓ Parallel queries e dependent queries
✓ Prefetching para navegação instantânea
```

### 2.2 Data Fetching Pattern

```typescript
// Custom hooks com React Query
useItems()       → GET /api/items
useLoans()       → GET /api/loans?filter=lent
useDashboard()   → GET /api/dashboard
useFriends()     → GET /api/dashboard/friends

// Mutations
useCreateLoan()  → POST /api/loans
useReturnLoan()  → PATCH /api/loans/{id}/return
useRemindLoan()  → POST /api/loans/{id}/remind
```

### 2.3 Cache Strategy

| Query | Stale Time | Cache Time | Refetch on Focus |
|-------|------------|------------|------------------|
| Dashboard stats | 30s | 5min | Sim |
| Active loans | 1min | 10min | Sim |
| Items list | 5min | 15min | Não |
| Recent activity | 30s | 5min | Sim |

---

## 3. Design Visual

### 3.1 Conceito: "Dark Material Ambient"

**Estética escolhida:**
- **Dark mode** com profundidade via sombras e elevações
- **Glassmorphism sutil** (backdrop-blur em cards flutuantes)
- **Cores vibrantes** para status (amber/green/red)
- **Tipografia contrastante:** Manrope (display) + Source Sans 3 (body)
- **Animações sutis:** fade-in, slide-up, skeleton loaders

**EVITAR:**
- ❌ Gradientes purple genéricos
- ❌ Inter/Roboto (overused)
- ❌ Flat cards sem profundidade
- ❌ Animações exageradas

### 3.2 Cores

```css
/* Brand Colors */
--primary: 207 84% 55%        /* #2b8cee - Electric Blue */
--accent-amber: 38 92% 50%    /* #f59e0b - Active Loan */
--accent-green: 142 71% 45%   /* #10b981 - Returned */
--accent-red: 0 72% 51%       /* #dc2626 - Overdue */

/* Dark Surfaces */
--bg-950: 210 31% 10%         /* #101922 - Background */
--surface-900: 210 28% 15%    /* #1a2633 - Cards */
--surface-800: 210 25% 20%    /* #243040 - Hover */

/* Borders & Dividers */
--border-700: 210 25% 25%     /* #2d3a4d - Subtle */
```

### 3.3 Tipografia

```typescript
// Fontes escolhidas (distintas, não genéricas)
import { Manrope, Source_Sans_3 } from 'next/font/google'

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-display'
})

const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body'
})

// Escala tipográfica
h1: 2.25rem/700 (36px - Page title)
h2: 1.5rem/600  (24px - Section title)
h3: 1.125rem/600 (18px - Card title)
body-lg: 1rem/500 (16px - Card content)
body: 0.875rem/400 (14px - Metadata)
caption: 0.75rem/400 (12px - Labels)
```

### 3.4 Layout Structure

```
┌─────────────────────────────────────────────────┐
│  Sidebar (256px)     │  Main Content (flex-1)   │
│                      │                           │
│  [Logo]              │  ┌─ Header ─────────────┐│
│  [User Card]         │  │ Title    [+ Loan]    ││
│                      │  └──────────────────────┘│
│  Navigation:         │                           │
│  • Visão Geral ✓    │  ┌─ Stats Grid ─────────┐│
│  • Bem-Estar        │  │ [4 Itens] [2 Emp]    ││
│  • Meus Itens       │  └──────────────────────┘│
│  • Histórico        │                           │
│  • Amigos           │  ┌─ Bento Grid ─────────┐│
│                      │  │                       ││
│  [Status Box]        │  │  Loans (8/12 cols)   ││
│  "4 Itens Ativos"   │  │  [Card] [Card] [...]││
│                      │  │                       ││
│  [Settings]          │  │  Widgets (4/12 cols) ││
│                      │  │  - Check-in Social   ││
│                      │  │  - Timeline          ││
│                      │  └──────────────────────┘│
└─────────────────────────────────────────────────┘
```

---

## 4. Componentes

### 4.1 Layout Components

#### DashboardShell
```typescript
<DashboardShell>
  <DashboardSidebar />
  <DashboardContent>
    {children}
  </DashboardContent>
</DashboardShell>
```

#### DashboardSidebar
- Logo + App name
- User card (avatar, name, greeting)
- Navigation menu
- Active loans counter
- Settings link

**Responsivo:**
- Desktop: Fixed sidebar (256px)
- Tablet/Mobile: Drawer menu (Sheet component)

### 4.2 Dashboard Sections

#### StatsGrid
```typescript
<StatsGrid>
  <StatCard
    icon={<Package />}
    label="Meus Itens"
    value={stats.totalItems}
    trend="+2 este mês"
  />
  <StatCard
    icon={<ArrowUpRight />}
    label="Emprestados"
    value={stats.activeLoans}
    status="warning"
  />
  <StatCard
    icon={<ArrowDownLeft />}
    label="Peguei Emprestado"
    value={stats.borrowedItems}
  />
</StatsGrid>
```

#### LoanCardGrid
```typescript
<LoanCardGrid>
  <LoanCard
    item={{ name, images, id }}
    borrower={{ name, avatarUrl }}
    status="CONFIRMED"
    expectedReturn={date}
    onReturn={() => {}}
    onRemind={() => {}}
  />
</LoanCardGrid>
```

**Design do LoanCard:**
- Image cover (192px height)
- Status badge (top-left)
- Expected return date (overlay bottom)
- Borrower avatar + name
- Action button (footer)
- Hover: lift effect (transform: translateY(-4px))

#### WellnessCheckIn
```typescript
<WellnessCheckIn
  itemName="Câmera DSLR"
  onFeelingSelect={(feeling) => {}}
/>
```

**Feature única:** Emoji selector para sentimento sobre empréstimo
- 😄 Tranquilo
- 😐 Neutro
- 😰 Preocupado

Salva no analytics (futuro)

#### ActivityTimeline
```typescript
<ActivityTimeline>
  <ActivityItem
    icon={<Handshake />}
    title="Jogo de Tabuleiro"
    description="Emprestado para Ana"
    time="Há 2 horas"
    type="loan"
  />
  <ActivityItem
    icon={<Check />}
    title="Mala de Viagem"
    description="Devolvida por Carlos"
    time="Ontem"
    type="return"
  />
</ActivityTimeline>
```

**Visual:**
- Vertical timeline com linha conectora
- Ícones coloridos por tipo
- Timestamps relativos

---

## 5. Interações e Animações

### 5.1 Micro-interactions

```css
/* Card hover */
.loan-card {
  transition: transform 200ms cubic-bezier(0.4, 0, 0.2, 1);
}
.loan-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
}

/* Button press */
.button:active {
  transform: scale(0.96);
}

/* Skeleton loading */
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
```

### 5.2 Page Transitions

```typescript
// Staggered card entrance
{loans.map((loan, i) => (
  <motion.div
    key={loan.id}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: i * 0.05 }}
  >
    <LoanCard {...loan} />
  </motion.div>
))}
```

### 5.3 Optimistic Updates

```typescript
// Immediate UI update, rollback on error
const returnMutation = useMutation({
  mutationFn: returnLoan,
  onMutate: async (loanId) => {
    await queryClient.cancelQueries(['loans'])
    const prev = queryClient.getQueryData(['loans'])

    queryClient.setQueryData(['loans'], (old) =>
      old.map(l => l.id === loanId
        ? { ...l, status: 'RETURNED' }
        : l
      )
    )

    return { prev }
  },
  onError: (err, vars, context) => {
    queryClient.setQueryData(['loans'], context.prev)
  },
  onSettled: () => {
    queryClient.invalidateQueries(['loans'])
  }
})
```

---

## 6. Responsividade

### 6.1 Breakpoints

```typescript
const breakpoints = {
  sm: '640px',   // Mobile landscape
  md: '768px',   // Tablet portrait
  lg: '1024px',  // Desktop
  xl: '1280px',  // Large desktop
}
```

### 6.2 Layout Adaptativo

| Screen | Sidebar | Grid Columns | Cards per Row |
|--------|---------|--------------|---------------|
| < 768px | Hidden (drawer) | 1 | 1 |
| 768-1024px | Hidden (drawer) | 6+6 | 2 |
| > 1024px | Visible (fixed) | 8+4 | 3 |

### 6.3 Mobile Optimizations

- FAB (Floating Action Button) para "Registrar Empréstimo"
- Swipe gestures em loan cards (futuro)
- Bottom sheet para ações rápidas
- Pull-to-refresh

---

## 7. Acessibilidade

### 7.1 WCAG 2.1 AA Compliance

✓ **Contraste:** Todos os textos têm ratio ≥ 4.5:1
✓ **Keyboard navigation:** Tab order lógico, focus visible
✓ **Screen readers:** ARIA labels, semantic HTML
✓ **Motion:** Respeita `prefers-reduced-motion`

### 7.2 Landmarks & Roles

```jsx
<nav aria-label="Main navigation">
  <ul role="list">
    <li>
      <Link href="/dashboard" aria-current="page">
        Visão Geral
      </Link>
    </li>
  </ul>
</nav>

<main aria-label="Dashboard">
  <section aria-labelledby="stats-heading">
    <h2 id="stats-heading" className="sr-only">
      Estatísticas
    </h2>
    ...
  </section>
</main>
```

### 7.3 Focus Management

```typescript
// Skip to main content
<a href="#main" className="skip-link">
  Pular para conteúdo
</a>

// Modal focus trap (using Dialog component)
<Dialog>
  <DialogContent>
    <DialogTitle>Devolver item</DialogTitle>
    <DialogClose /> {/* Auto-focused on open */}
  </DialogContent>
</Dialog>
```

---

## 8. Performance Targets

### 8.1 Core Web Vitals

| Metric | Target | Estratégia |
|--------|--------|------------|
| **LCP** | < 2.5s | Image optimization (next/image), skeleton loaders |
| **FID** | < 100ms | Code splitting, defer non-critical JS |
| **CLS** | < 0.1 | Fixed dimensions, font-display: swap |

### 8.2 Bundle Size

```
Target: < 200KB initial JS (gzipped)

Strategies:
- Dynamic imports para modais/dialogs
- Tree-shaking (barrel imports evitados)
- React Query: 13KB (necessário)
- Framer Motion: ~60KB (importar apenas necessário)
```

### 8.3 Data Loading

```typescript
// Prefetch on hover
<Link
  href="/items"
  onMouseEnter={() => queryClient.prefetchQuery(['items'])}
>
  Meus Itens
</Link>

// Parallel queries (não waterfall!)
const { data: dashboard } = useDashboard()
const { data: loans } = useLoans()      // Executa em paralelo ✓
const { data: items } = useItems()      // Não espera dashboard ✓
```

---

## 9. Estados de UI

### 9.1 Loading States

```typescript
// Skeleton loaders (evitar spinners genéricos)
{isLoading ? (
  <div className="grid grid-cols-3 gap-6">
    {[1,2,3].map(i => (
      <Skeleton key={i} className="h-80 w-full" />
    ))}
  </div>
) : (
  <LoanCardGrid loans={data.loans} />
)}
```

### 9.2 Empty States

```typescript
// Sem empréstimos ativos
<EmptyState
  icon={<Package />}
  title="Nenhum item emprestado"
  description="Comece registrando seu primeiro empréstimo"
  action={
    <Button onClick={openLoanDialog}>
      Registrar Empréstimo
    </Button>
  }
/>
```

### 9.3 Error States

```typescript
// Erro ao carregar dados
{isError ? (
  <ErrorState
    title="Não foi possível carregar seus empréstimos"
    description={error.message}
    retry={() => refetch()}
  />
) : ...}
```

---

## 10. Dados da API

### 10.1 Endpoints Utilizados

```typescript
// Dashboard stats
GET /api/dashboard
Response: {
  stats: { totalItems, activeLoans, borrowedItems },
  recentLoans: Loan[]
}

// Active loans (lent)
GET /api/loans?filter=lent
Response: { loans: Loan[] }

// Borrowed items
GET /api/loans?filter=borrowed
Response: { loans: Loan[] }

// Friends list (for quick loan)
GET /api/dashboard/friends
Response: { friends: Friend[] }
```

### 10.2 Tipos TypeScript (estendidos)

```typescript
// Estende tipos existentes em src/types/api.ts

type DashboardData = {
  stats: DashboardStats
  recentLoans: LoanWithDetails[]
}

type LoanWithDetails = Loan & {
  item: Pick<Item, 'name' | 'images'>
  borrower: Pick<User, 'name' | 'avatarUrl'>
  lender: Pick<User, 'name' | 'avatarUrl'>
}

type ActivityItem = {
  id: string
  type: 'loan' | 'return' | 'reminder' | 'cancel'
  itemName: string
  userName: string
  timestamp: string
}
```

---

## 11. Próximos Passos (Pós-Dashboard)

1. **Página de Itens** (CRUD completo)
2. **Registro Relâmpago** (Quick loan modal)
3. **Detalhes do Empréstimo** (Modal com histórico)
4. **Filtros e Busca** (Advanced filtering)
5. **Notificações** (Toast + push notifications)

---

## 12. Referências

- **API Spec:** [ta-com-quem-docs-api.json](../../api/ta-com-quem-docs-api.json)
- **Mockup:** [Dashboard Sample](../../samples/tácomquem_central_dashboard/)
- **Vercel Best Practices:** [React Best Practices Skill](../../../.claude/skills/vercel-react-best-practices/)
- **Design Skill:** [Frontend Design Skill](../../../.claude/skills/frontend-design/)
- **React Query Docs:** https://tanstack.com/query/latest
- **Framer Motion Docs:** https://www.framer.com/motion/
