# TáComQuem Dashboard — Plano de Implementação

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implementar dashboard completo com React Query, design único e dados reais da API.

**Architecture:** Client-side dashboard com React Query para data fetching, cache e optimistic updates. Componentes modulares e reutilizáveis.

**Tech Stack:** React Query (TanStack Query v5), Framer Motion, next/image, custom hooks

**Credenciais de Teste:**
```
Email: test1@example.com
Password: Test@123456
```

**Referências de Documentação:**
- [TanStack Query](https://tanstack.com/query/latest)
- [Framer Motion](https://www.framer.com/motion/)
- [Next.js Image](https://nextjs.org/docs/app/api-reference/components/image)
- [Vercel React Best Practices](../../../.claude/skills/vercel-react-best-practices/)

---

## Fase 1: Setup e Dependências

### Task 1.1: Instalar dependências

**Files:**
- Modify: `package.json`
- Modify: `bun.lockb`

**Step 1: Instalar React Query**

```bash
bun add @tanstack/react-query @tanstack/react-query-devtools
```

**Step 2: Instalar Framer Motion**

```bash
bun add framer-motion
```

**Step 3: Instalar utilitários de data**

```bash
bun add date-fns
```

**Step 4: Instalar ícones Lucide**

```bash
bun add lucide-react
```

**Step 5: Commit**

```bash
git add package.json bun.lockb
git commit -m "chore: install dashboard dependencies (react-query, framer-motion)"
```

---

### Task 1.2: Configurar React Query Provider

**Files:**
- Create: `src/providers/query-provider.tsx`
- Modify: `src/app/layout.tsx`

**Step 1: Criar QueryProvider**

```typescript
"use client"

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState, type ReactNode } from 'react'

export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30 * 1000, // 30s
            gcTime: 5 * 60 * 1000, // 5min (era cacheTime)
            refetchOnWindowFocus: true,
            refetchOnReconnect: true,
            retry: 1,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
```

**Step 2: Adicionar QueryProvider ao layout**

Modificar `src/app/layout.tsx`:

```typescript
import { QueryProvider } from '@/providers/query-provider'

// ...dentro do return:
<ThemeProvider>
  <QueryProvider>
    <AuthProvider initialUser={user}>
      {children}
    </AuthProvider>
  </QueryProvider>
  <Toaster />
</ThemeProvider>
```

**Step 3: Commit**

```bash
git add src/providers/query-provider.tsx src/app/layout.tsx
git commit -m "feat: configure react query provider"
```

---

### Task 1.3: Configurar fontes customizadas

**Files:**
- Create: `src/lib/fonts.ts`
- Modify: `src/app/layout.tsx`

**Step 1: Criar arquivo de fontes**

```typescript
import { Manrope, Source_Sans_3 } from 'next/font/google'

export const manrope = Manrope({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
})

export const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
})
```

**Step 2: Atualizar layout para usar novas fontes**

Modificar `src/app/layout.tsx`:

```typescript
import { manrope, sourceSans } from '@/lib/fonts'

// ...no html tag:
<html
  lang="pt-BR"
  className={`${manrope.variable} ${sourceSans.variable}`}
  suppressHydrationWarning
>
```

**Step 3: Atualizar tailwind.config.ts**

```typescript
// No theme.extend.fontFamily:
fontFamily: {
  display: ['var(--font-display)', 'system-ui', 'sans-serif'],
  body: ['var(--font-body)', 'system-ui', 'sans-serif'],
},
```

**Step 4: Commit**

```bash
git add src/lib/fonts.ts src/app/layout.tsx tailwind.config.ts
git commit -m "style: configure custom fonts (Manrope + Source Sans 3)"
```

---

## Fase 2: API Hooks com React Query

### Task 2.1: Criar hooks de dashboard

**Files:**
- Create: `src/hooks/use-dashboard.ts`

**Step 1: Criar hook useDashboard**

```typescript
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api/client'
import type { DashboardStats, Loan } from '@/types'

type DashboardData = {
  stats: DashboardStats
  recentLoans: Loan[]
}

export function useDashboard() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const data = await api.get<DashboardData>('/api/dashboard')
      return data
    },
    staleTime: 30 * 1000, // 30s
  })
}
```

**Step 2: Commit**

```bash
git add src/hooks/use-dashboard.ts
git commit -m "feat: add useDashboard hook with react-query"
```

---

### Task 2.2: Criar hooks de loans

**Files:**
- Create: `src/hooks/use-loans.ts`

**Step 1: Criar hooks de queries**

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api/client'
import type { Loan } from '@/types'

type LoansResponse = {
  loans: Loan[]
}

export function useLoans(filter?: 'lent' | 'borrowed') {
  return useQuery({
    queryKey: ['loans', filter],
    queryFn: async () => {
      const params = filter ? `?filter=${filter}` : ''
      const data = await api.get<LoansResponse>(`/api/loans${params}`)
      return data.loans
    },
    staleTime: 60 * 1000, // 1min
  })
}

export function useLoan(id: string) {
  return useQuery({
    queryKey: ['loan', id],
    queryFn: async () => {
      const data = await api.get<{ loan: Loan }>(`/api/loans/${id}`)
      return data.loan
    },
    enabled: !!id,
  })
}
```

**Step 2: Criar mutations**

```typescript
// Adicionar no mesmo arquivo

export function useReturnLoan() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (loanId: string) => {
      const data = await api.patch<{ loan: Loan }>(
        `/api/loans/${loanId}/return`
      )
      return data.loan
    },
    onMutate: async (loanId) => {
      // Cancel ongoing queries
      await queryClient.cancelQueries({ queryKey: ['loans'] })

      // Snapshot current state
      const previousLoans = queryClient.getQueryData(['loans'])

      // Optimistically update
      queryClient.setQueryData<Loan[]>(['loans'], (old) =>
        old?.map((loan) =>
          loan.id === loanId ? { ...loan, status: 'RETURNED' } : loan
        )
      )

      return { previousLoans }
    },
    onError: (err, loanId, context) => {
      // Rollback on error
      queryClient.setQueryData(['loans'], context?.previousLoans)
    },
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['loans'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

export function useRemindLoan() {
  return useMutation({
    mutationFn: async (loanId: string) => {
      await api.post(`/api/loans/${loanId}/remind`)
    },
  })
}

export function useCancelLoan() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (loanId: string) => {
      await api.patch(`/api/loans/${loanId}/cancel`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loans'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}
```

**Step 3: Commit**

```bash
git add src/hooks/use-loans.ts
git commit -m "feat: add loans hooks with optimistic updates"
```

---

### Task 2.3: Criar hooks de items e friends

**Files:**
- Create: `src/hooks/use-items.ts`
- Create: `src/hooks/use-friends.ts`

**Step 1: Criar useItems**

```typescript
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api/client'
import type { Item } from '@/types'

type ItemsResponse = {
  items: Item[]
}

export function useItems() {
  return useQuery({
    queryKey: ['items'],
    queryFn: async () => {
      const data = await api.get<ItemsResponse>('/api/items')
      return data.items
    },
    staleTime: 5 * 60 * 1000, // 5min
  })
}
```

**Step 2: Criar useFriends**

```typescript
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api/client'
import type { Friend } from '@/types'

type FriendsResponse = {
  friends: Friend[]
}

export function useFriends() {
  return useQuery({
    queryKey: ['friends'],
    queryFn: async () => {
      const data = await api.get<FriendsResponse>('/api/dashboard/friends')
      return data.friends
    },
    staleTime: 5 * 60 * 1000, // 5min
  })
}
```

**Step 3: Commit**

```bash
git add src/hooks/use-items.ts src/hooks/use-friends.ts
git commit -m "feat: add items and friends query hooks"
```

---

## Fase 3: Layout Components

### Task 3.1: Criar DashboardShell

**Files:**
- Create: `src/components/layouts/dashboard-shell.tsx`

**Step 1: Criar componente**

```typescript
import { type ReactNode } from 'react'
import { DashboardSidebar } from './dashboard-sidebar'
import { DashboardHeader } from './dashboard-header'

type DashboardShellProps = {
  children: ReactNode
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="relative flex min-h-screen w-full">
      {/* Sidebar - desktop only */}
      <DashboardSidebar />

      {/* Main content */}
      <main className="flex-1 flex flex-col lg:ml-64 bg-background-950">
        <DashboardHeader />
        <div className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add src/components/layouts/dashboard-shell.tsx
git commit -m "feat: add dashboard shell layout"
```

---

### Task 3.2: Criar DashboardSidebar

**Files:**
- Create: `src/components/layouts/dashboard-sidebar.tsx`

**Step 1: Criar componente**

```typescript
"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useAuth } from '@/providers/auth-provider'
import { useDashboard } from '@/hooks/use-dashboard'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  LayoutDashboard,
  Heart,
  Package,
  History,
  Users,
  Settings,
} from 'lucide-react'

const navigation = [
  { name: 'Visão Geral', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Bem-Estar', href: '/dashboard/wellness', icon: Heart },
  { name: 'Meus Itens', href: '/dashboard/items', icon: Package },
  { name: 'Histórico', href: '/dashboard/history', icon: History },
  { name: 'Amigos', href: '/dashboard/friends', icon: Users },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const { user } = useAuth()
  const { data: dashboard } = useDashboard()

  return (
    <aside className="w-64 bg-surface-900 border-r border-border-700 flex flex-col fixed h-full z-20 hidden lg:flex">
      {/* Logo */}
      <div className="p-6">
        <div className="flex items-center gap-3 mb-10">
          <div className="size-8 text-primary">
            {/* SVG Logo */}
            <svg viewBox="0 0 48 48" fill="currentColor">
              <path d="M39.475 21.6262C40.358 21.4363 40.6863 21.5589..." />
            </svg>
          </div>
          <h2 className="text-xl font-bold font-display">TáComQuem</h2>
        </div>

        {/* User Card */}
        <div className="flex gap-3 items-center p-3 rounded-xl bg-surface-800">
          <Avatar className="size-12">
            <AvatarImage src={user?.avatarUrl ?? undefined} />
            <AvatarFallback>
              {user?.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <h3 className="text-sm font-semibold">
              Olá, {user?.name.split(' ')[0]}
            </h3>
            <p className="text-xs text-muted-foreground">
              O que está com quem?
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-6 flex flex-col gap-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-surface-800 hover:text-foreground'
                )}
              >
                <item.icon className="size-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Status Box + Settings */}
      <div className="mt-auto p-6 border-t border-border-700">
        <div className="p-4 rounded-2xl bg-surface-800 border border-border-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Status Ativo
            </span>
            <span className="flex size-2 rounded-full bg-accent-green" />
          </div>
          <p className="text-2xl font-bold">
            {dashboard?.stats.activeLoans ?? 0} Itens
          </p>
          <p className="text-xs text-muted-foreground">
            atualmente emprestados
          </p>
        </div>

        <Button
          variant="ghost"
          className="w-full justify-start mt-2"
          asChild
        >
          <Link href="/dashboard/settings">
            <Settings className="size-4 mr-2" />
            Configurações
          </Link>
        </Button>
      </div>
    </aside>
  )
}
```

**Step 2: Commit**

```bash
git add src/components/layouts/dashboard-sidebar.tsx
git commit -m "feat: add dashboard sidebar with navigation"
```

---

### Task 3.3: Criar DashboardHeader

**Files:**
- Create: `src/components/layouts/dashboard-header.tsx`

**Step 1: Criar componente**

```typescript
"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu, Search, Bell, Plus } from 'lucide-react'

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-10 bg-background-950/80 backdrop-blur-md border-b border-border-700 px-6 py-4 flex items-center justify-between">
      {/* Mobile menu */}
      <div className="flex items-center gap-4 lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            {/* Sidebar content aqui (reutilizar) */}
            <div className="p-4">
              <p className="text-sm text-muted-foreground">
                Menu mobile (TODO)
              </p>
            </div>
          </SheetContent>
        </Sheet>
        <span className="text-lg font-bold font-display">TáComQuem</span>
      </div>

      {/* Search (desktop) */}
      <div className="hidden lg:flex flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Buscar itens, amigos..."
            className="pl-10 bg-surface-900 border-border-700"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        {/* Biometry badge (desktop) */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-900/20 border border-green-900/30 text-green-400">
          <div className="size-4 rounded-full bg-green-500" />
          <span className="text-xs font-semibold">Biometria Ativa</span>
        </div>

        {/* Notifications */}
        <Button variant="outline" size="icon" className="relative">
          <Bell className="size-4" />
          <span className="absolute top-1 right-1 size-2 bg-red-500 rounded-full" />
        </Button>

        {/* CTA Button (desktop) */}
        <Button className="hidden sm:flex gap-2">
          <Plus className="size-4" />
          Registrar Empréstimo
        </Button>
      </div>
    </header>
  )
}
```

**Step 2: Commit**

```bash
git add src/components/layouts/dashboard-header.tsx
git commit -m "feat: add dashboard header with search and actions"
```

---

## Fase 4: Dashboard Components

### Task 4.1: Criar StatsGrid

**Files:**
- Create: `src/components/dashboard/stats-grid.tsx`
- Create: `src/components/dashboard/stat-card.tsx`

**Step 1: Criar StatCard**

```typescript
import { type LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

type StatCardProps = {
  icon: LucideIcon
  label: string
  value: number
  trend?: string
  variant?: 'default' | 'warning' | 'success'
}

export function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  variant = 'default',
}: StatCardProps) {
  const variantStyles = {
    default: 'border-border-700',
    warning: 'border-accent-amber/30 bg-accent-amber/5',
    success: 'border-accent-green/30 bg-accent-green/5',
  }

  return (
    <Card className={variantStyles[variant]}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 rounded-lg bg-primary/10">
            <Icon className="size-5 text-primary" />
          </div>
          {trend && (
            <span className="text-xs text-muted-foreground">{trend}</span>
          )}
        </div>
        <p className="text-3xl font-bold font-display">{value}</p>
        <p className="text-sm text-muted-foreground mt-1">{label}</p>
      </CardContent>
    </Card>
  )
}

export function StatCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <Skeleton className="h-9 w-9 mb-4" />
        <Skeleton className="h-9 w-16 mb-2" />
        <Skeleton className="h-4 w-24" />
      </CardContent>
    </Card>
  )
}
```

**Step 2: Criar StatsGrid**

```typescript
import { Package, ArrowUpRight, ArrowDownLeft } from 'lucide-react'
import { StatCard, StatCardSkeleton } from './stat-card'
import { useDashboard } from '@/hooks/use-dashboard'

export function StatsGrid() {
  const { data, isLoading } = useDashboard()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard
        icon={Package}
        label="Meus Itens"
        value={data?.stats.totalItems ?? 0}
        trend="+2 este mês"
      />
      <StatCard
        icon={ArrowUpRight}
        label="Emprestados"
        value={data?.stats.activeLoans ?? 0}
        variant="warning"
      />
      <StatCard
        icon={ArrowDownLeft}
        label="Peguei Emprestado"
        value={data?.stats.borrowedItems ?? 0}
        variant="success"
      />
    </div>
  )
}
```

**Step 3: Commit**

```bash
git add src/components/dashboard/stats-grid.tsx src/components/dashboard/stat-card.tsx
git commit -m "feat: add stats grid with loading states"
```

---

### Task 4.2: Criar LoanCard

**Files:**
- Create: `src/components/dashboard/loan-card.tsx`

**Step 1: Criar componente**

```typescript
"use client"

import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { motion } from 'framer-motion'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useReturnLoan, useRemindLoan } from '@/hooks/use-loans'
import { Clock, CheckCircle, AlertCircle } from 'lucide-react'
import type { Loan, Item, User } from '@/types'

type LoanCardProps = {
  loan: Loan & {
    item: Pick<Item, 'name' | 'images'>
    borrower: Pick<User, 'name' | 'avatarUrl'>
  }
}

export function LoanCard({ loan }: LoanCardProps) {
  const returnMutation = useReturnLoan()
  const remindMutation = useRemindLoan()

  const statusConfig = {
    PENDING: { label: 'Pendente', icon: Clock, variant: 'warning' as const },
    CONFIRMED: { label: 'Emprestado', icon: Clock, variant: 'warning' as const },
    RETURNED: { label: 'Devolvido', icon: CheckCircle, variant: 'success' as const },
    CANCELLED: { label: 'Cancelado', icon: AlertCircle, variant: 'destructive' as const },
  }

  const config = statusConfig[loan.status]
  const StatusIcon = config.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="group overflow-hidden border-border-700 hover:shadow-xl hover:shadow-black/20 transition-shadow">
        {/* Image */}
        <div className="relative h-48 w-full overflow-hidden">
          <Badge
            variant={config.variant}
            className="absolute top-3 left-3 z-10 gap-1"
          >
            <StatusIcon className="size-3" />
            {config.label}
          </Badge>

          {loan.item.images[0] ? (
            <Image
              src={loan.item.images[0]}
              alt={loan.item.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-surface-800 flex items-center justify-center">
              <Package className="size-12 text-muted-foreground" />
            </div>
          )}

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />

          {/* Expected return */}
          {loan.expectedReturnDate && loan.status !== 'RETURNED' && (
            <div className="absolute bottom-3 left-3 text-white">
              <p className="text-xs font-medium opacity-90">
                Devolução esperada:{' '}
                {formatDistanceToNow(new Date(loan.expectedReturnDate), {
                  locale: ptBR,
                  addSuffix: true,
                })}
              </p>
            </div>
          )}
        </div>

        {/* Content */}
        <CardContent className="p-4">
          <h3 className="text-base font-bold font-display mb-2">
            {loan.item.name}
          </h3>

          <div className="flex items-center gap-2">
            <Avatar className="size-6 border border-border-700">
              <AvatarImage src={loan.borrower.avatarUrl ?? undefined} />
              <AvatarFallback className="text-xs">
                {loan.borrower.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">
              Com{' '}
              <span className="font-medium text-foreground">
                {loan.borrower.name}
              </span>
            </span>
          </div>
        </CardContent>

        {/* Actions */}
        <CardFooter className="p-4 pt-0">
          {loan.status === 'CONFIRMED' ? (
            <div className="w-full flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => remindMutation.mutate(loan.id)}
                disabled={remindMutation.isPending}
              >
                Lembrar
              </Button>
              <Button
                size="sm"
                className="flex-1"
                onClick={() => returnMutation.mutate(loan.id)}
                disabled={returnMutation.isPending}
              >
                Marcar Devolvido
              </Button>
            </div>
          ) : loan.status === 'RETURNED' ? (
            <Button
              variant="outline"
              size="sm"
              className="w-full"
            >
              Avaliar Estado
            </Button>
          ) : null}
        </CardFooter>
      </Card>
    </motion.div>
  )
}
```

**Step 2: Adicionar import do Package icon no início**

```typescript
import { Clock, CheckCircle, AlertCircle, Package } from 'lucide-react'
```

**Step 3: Commit**

```bash
git add src/components/dashboard/loan-card.tsx
git commit -m "feat: add loan card with animations and actions"
```

---

### Task 4.3: Criar LoanCardGrid

**Files:**
- Create: `src/components/dashboard/loan-card-grid.tsx`

**Step 1: Criar componente**

```typescript
import { LoanCard } from './loan-card'
import { Skeleton } from '@/components/ui/skeleton'
import { useLoans } from '@/hooks/use-loans'
import { Package } from 'lucide-react'

export function LoanCardGrid() {
  const { data: loans, isLoading } = useLoans('lent')

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-80 w-full" />
        ))}
      </div>
    )
  }

  if (!loans || loans.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-border-700 rounded-2xl">
        <Package className="size-12 text-muted-foreground mb-4" />
        <h3 className="font-semibold text-lg mb-2">
          Nenhum item emprestado
        </h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Comece registrando seu primeiro empréstimo para acompanhar seus
          itens.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {loans.map((loan, index) => (
        <LoanCard
          key={loan.id}
          loan={loan as any} // TODO: fix types
          // Staggered animation delay
          style={{ animationDelay: `${index * 50}ms` } as any}
        />
      ))}
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add src/components/dashboard/loan-card-grid.tsx
git commit -m "feat: add loan card grid with empty state"
```

---

### Task 4.4: Criar WellnessCheckIn

**Files:**
- Create: `src/components/dashboard/wellness-check-in.tsx`

**Step 1: Criar componente**

```typescript
"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Smile } from 'lucide-react'
import { cn } from '@/lib/utils'

const feelings = [
  { emoji: '😄', label: 'Tranquilo', value: 'calm' },
  { emoji: '😐', label: 'Neutro', value: 'neutral' },
  { emoji: '😰', label: 'Preocupado', value: 'worried' },
]

export function WellnessCheckIn() {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <Card className="border-border-700">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-blue-900/30 text-blue-400">
            <Smile className="size-5" />
          </div>
          <CardTitle className="text-base">Check-in Social</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
          Emprestar itens fortalece laços, mas pode causar ansiedade. Como
          você se sente sobre seus empréstimos?
        </p>

        <div className="flex gap-2">
          {feelings.map((feeling) => (
            <Button
              key={feeling.value}
              variant="outline"
              size="lg"
              className={cn(
                'flex-1 text-2xl h-auto py-3 hover:scale-105 transition-transform',
                selected === feeling.value &&
                  'bg-primary/10 border-primary'
              )}
              onClick={() => setSelected(feeling.value)}
              title={feeling.label}
            >
              {feeling.emoji}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
```

**Step 2: Commit**

```bash
git add src/components/dashboard/wellness-check-in.tsx
git commit -m "feat: add wellness check-in widget"
```

---

### Task 4.5: Criar ActivityTimeline

**Files:**
- Create: `src/components/dashboard/activity-timeline.tsx`

**Step 1: Criar componente**

```typescript
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Handshake,
  CheckCircle,
  Bell,
  XCircle,
} from 'lucide-react'

const iconMap = {
  loan: Handshake,
  return: CheckCircle,
  reminder: Bell,
  cancel: XCircle,
}

const colorMap = {
  loan: 'text-blue-400 bg-blue-900/20',
  return: 'text-green-400 bg-green-900/20',
  reminder: 'text-amber-400 bg-amber-900/20',
  cancel: 'text-red-400 bg-red-900/20',
}

type Activity = {
  id: string
  type: 'loan' | 'return' | 'reminder' | 'cancel'
  itemName: string
  userName: string
  timestamp: string
}

// Mock data (substituir com dados reais)
const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'loan',
    itemName: 'Jogo de Tabuleiro',
    userName: 'Ana',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    type: 'return',
    itemName: 'Mala de Viagem',
    userName: 'Carlos',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    type: 'reminder',
    itemName: 'Câmera DSLR',
    userName: 'Lucas',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

export function ActivityTimeline() {
  return (
    <Card className="border-border-700 flex-1">
      <CardHeader>
        <CardTitle className="text-base">Atividade Recente</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative flex flex-col gap-4">
          {/* Timeline line */}
          <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-border-700" />

          {mockActivities.map((activity) => {
            const Icon = iconMap[activity.type]
            const colorClass = colorMap[activity.type]

            return (
              <div key={activity.id} className="flex gap-4 relative">
                <div
                  className={cn(
                    'size-10 rounded-full border-2 border-surface-900 z-10 flex items-center justify-center shrink-0',
                    colorClass
                  )}
                >
                  <Icon className="size-5" />
                </div>
                <div className="flex flex-col py-0.5">
                  <p className="text-sm font-medium">{activity.itemName}</p>
                  <p className="text-xs text-muted-foreground">
                    {activity.type === 'loan' && `Emprestado para `}
                    {activity.type === 'return' && `Devolvido por `}
                    {activity.type === 'reminder' && `Lembrete para `}
                    <span className="text-foreground">{activity.userName}</span>
                  </p>
                  <span className="text-[10px] text-muted-foreground mt-1">
                    {formatDistanceToNow(new Date(activity.timestamp), {
                      locale: ptBR,
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="w-full mt-6 text-xs"
        >
          Ver histórico completo
        </Button>
      </CardContent>
    </Card>
  )
}
```

**Step 2: Adicionar cn import**

```typescript
import { cn } from '@/lib/utils'
```

**Step 3: Commit**

```bash
git add src/components/dashboard/activity-timeline.tsx
git commit -m "feat: add activity timeline widget"
```

---

## Fase 5: Dashboard Page

### Task 5.1: Criar página do dashboard

**Files:**
- Create: `src/app/(dashboard)/layout.tsx`
- Create: `src/app/(dashboard)/dashboard/page.tsx`

**Step 1: Criar layout do dashboard**

```typescript
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/api/auth'
import { DashboardShell } from '@/components/layouts/dashboard-shell'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  return <DashboardShell>{children}</DashboardShell>
}
```

**Step 2: Criar página do dashboard**

```typescript
import { StatsGrid } from '@/components/dashboard/stats-grid'
import { LoanCardGrid } from '@/components/dashboard/loan-card-grid'
import { WellnessCheckIn } from '@/components/dashboard/wellness-check-in'
import { ActivityTimeline } from '@/components/dashboard/activity-timeline'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export default function DashboardPage() {
  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold mb-2">
          Central de Empréstimos
        </h1>
        <p className="text-muted-foreground">
          Gerencie seus itens compartilhados com tranquilidade.
        </p>
      </div>

      {/* Stats */}
      <StatsGrid />

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Main area - Loans */}
        <div className="md:col-span-8 lg:col-span-9 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <ArrowRight className="size-5 text-primary" />
              Itens Emprestados
            </h2>
            <Button variant="link" size="sm">
              Ver todos
            </Button>
          </div>

          <LoanCardGrid />
        </div>

        {/* Sidebar widgets */}
        <div className="md:col-span-4 lg:col-span-3 flex flex-col gap-6">
          <WellnessCheckIn />
          <ActivityTimeline />
        </div>
      </div>
    </div>
  )
}
```

**Step 3: Commit**

```bash
git add src/app/\(dashboard\)/
git commit -m "feat: add dashboard page with bento grid layout"
```

---

## Fase 6: Polish e Refinamentos

### Task 6.1: Adicionar FAB mobile

**Files:**
- Modify: `src/components/layouts/dashboard-shell.tsx`

**Step 1: Adicionar FAB**

Adicionar antes do closing `</main>`:

```typescript
{/* FAB - Mobile only */}
<div className="fixed bottom-6 right-6 lg:hidden z-30">
  <Button
    size="lg"
    className="size-14 rounded-full shadow-2xl shadow-primary/30 active:scale-95"
  >
    <Plus className="size-6" />
  </Button>
</div>
```

**Step 2: Commit**

```bash
git add src/components/layouts/dashboard-shell.tsx
git commit -m "feat: add floating action button for mobile"
```

---

### Task 6.2: Adicionar reduced motion support

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `src/app/globals.css`

**Step 1: Adicionar no globals.css**

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

**Step 2: Commit**

```bash
git add src/app/globals.css
git commit -m "a11y: add reduced motion support"
```

---

### Task 6.3: Adicionar loading e error boundaries

**Files:**
- Create: `src/app/(dashboard)/dashboard/loading.tsx`
- Create: `src/app/(dashboard)/dashboard/error.tsx`

**Step 1: Criar loading.tsx**

```typescript
import { Skeleton } from '@/components/ui/skeleton'

export default function DashboardLoading() {
  return (
    <div className="space-y-10">
      <div>
        <Skeleton className="h-9 w-64 mb-2" />
        <Skeleton className="h-5 w-96" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-8 lg:col-span-9">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Skeleton className="h-80" />
            <Skeleton className="h-80" />
            <Skeleton className="h-80" />
          </div>
        </div>
        <div className="md:col-span-4 lg:col-span-3 space-y-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-96" />
        </div>
      </div>
    </div>
  )
}
```

**Step 2: Criar error.tsx**

```typescript
"use client"

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Dashboard error:', error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <AlertTriangle className="size-12 text-red-500 mb-4" />
      <h2 className="text-2xl font-bold mb-2">Algo deu errado</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        Não foi possível carregar o dashboard. Por favor, tente novamente.
      </p>
      <Button onClick={reset}>Tentar novamente</Button>
    </div>
  )
}
```

**Step 3: Commit**

```bash
git add src/app/\(dashboard\)/dashboard/loading.tsx src/app/\(dashboard\)/dashboard/error.tsx
git commit -m "feat: add loading and error states to dashboard"
```

---

## Fase 7: Testes e Validação

### Task 7.1: Testar com dados reais

**Step 1: Iniciar dev server**

```bash
bun run dev
```

**Step 2: Login com credenciais de teste**

- Navegar para http://localhost:3000/login
- Email: test1@example.com
- Password: Test@123456

**Step 3: Verificar dashboard**

Checklist:
- [ ] Stats cards carregam corretamente
- [ ] Loan cards aparecem (se houver empréstimos)
- [ ] Sidebar mostra usuário logado
- [ ] Navigation funciona
- [ ] Loading states aparecem antes dos dados
- [ ] Hover effects funcionam nos cards
- [ ] Responsivo em mobile (< 768px)
- [ ] FAB aparece em mobile
- [ ] Animações são suaves

**Step 4: Testar ações**

- [ ] Clicar em "Marcar Devolvido" (optimistic update)
- [ ] Clicar em "Lembrar" (toast notification)
- [ ] Wellness check-in seleciona emoji
- [ ] Timeline mostra atividades

---

### Task 7.2: Performance audit

**Step 1: Build production**

```bash
bun run build
```

**Step 2: Analisar bundle**

Verificar warnings sobre:
- Bundle size (deve ser < 200KB initial)
- Unused dependencies
- Large modules

**Step 3: Lighthouse audit**

```bash
bunx lighthouse http://localhost:3000/dashboard --view
```

Targets:
- Performance: > 90
- Accessibility: 100
- Best Practices: > 90

---

### Task 7.3: Commit final

**Step 1: Formatar código**

```bash
bun run format
```

**Step 2: Lint**

```bash
bun run lint
```

**Step 3: Commit final**

```bash
git add .
git commit -m "feat: complete dashboard implementation with real API data

- Client-side rendering with React Query
- Optimistic updates for better UX
- Custom fonts (Manrope + Source Sans 3)
- Glassmorphism and dark theme
- Framer Motion animations
- Responsive bento grid layout
- Wellness check-in widget
- Activity timeline
- Loading/error states
- Mobile FAB
- WCAG 2.1 AA compliance
- Reduced motion support"
```

---

## Resumo de Arquivos Criados

| Arquivo | Descrição |
|---------|-----------|
| `src/providers/query-provider.tsx` | React Query provider |
| `src/lib/fonts.ts` | Custom fonts config |
| `src/hooks/use-dashboard.ts` | Dashboard data hook |
| `src/hooks/use-loans.ts` | Loans queries + mutations |
| `src/hooks/use-items.ts` | Items query hook |
| `src/hooks/use-friends.ts` | Friends query hook |
| `src/components/layouts/dashboard-shell.tsx` | Main dashboard layout |
| `src/components/layouts/dashboard-sidebar.tsx` | Navigation sidebar |
| `src/components/layouts/dashboard-header.tsx` | Top header with search |
| `src/components/dashboard/stats-grid.tsx` | Stats overview grid |
| `src/components/dashboard/stat-card.tsx` | Individual stat card |
| `src/components/dashboard/loan-card.tsx` | Loan item card |
| `src/components/dashboard/loan-card-grid.tsx` | Grid of loan cards |
| `src/components/dashboard/wellness-check-in.tsx` | Wellness widget |
| `src/components/dashboard/activity-timeline.tsx` | Recent activity |
| `src/app/(dashboard)/layout.tsx` | Dashboard route group |
| `src/app/(dashboard)/dashboard/page.tsx` | Main dashboard page |
| `src/app/(dashboard)/dashboard/loading.tsx` | Loading state |
| `src/app/(dashboard)/dashboard/error.tsx` | Error boundary |

---

## Próximos Passos

Após completar este plano, criar iniciativas para:

1. **003-items-management** - CRUD completo de itens
2. **004-loan-registration** - Modal de registro rápido
3. **005-loan-details** - Página de detalhes + histórico
4. **006-notifications** - Toast system + push notifications
5. **007-filters-search** - Advanced filtering e busca
