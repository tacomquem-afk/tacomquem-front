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
            <svg viewBox="0 0 48 48" fill="currentColor" aria-label="TáComQuem logo">
              <title>TáComQuem logo</title>
              <path d="M39.475 21.6262C40.358 21.4363 40.6863 21.5589 40.5673 21.5377C40.4483 21.5166 40.2793 21.5589 40.2793 21.9686C40.2793 22.3784 40.4046 23.0562 41.6517 23.0562C42.8987 23.0562 43.6833 22.3784 43.6833 21.2649C43.6833 20.1515 42.6647 19.6301 42.6647 19.6301C42.6647 19.6301 43.0826 19.2842 43.0826 18.5133C43.0826 17.7424 42.3666 17.0396 41.2773 17.0396C40.1879 17.0396 39.8399 17.8987 39.8399 17.8987L40.9276 18.3558C40.9276 18.3558 41.0466 17.9975 41.4646 17.9975C41.8826 17.9975 42.1187 18.2706 42.1187 18.6581C42.1187 19.0456 41.8499 19.3789 41.0793 19.3789H40.8186V20.3133H41.0793C42.0186 20.3133 42.2546 20.7704 42.2546 21.1579C42.2546 21.5454 41.9859 21.8363 41.6167 21.8363C41.2476 21.8363 40.9786 21.4793 40.9786 21.4793L39.475 21.6262Z" />
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
