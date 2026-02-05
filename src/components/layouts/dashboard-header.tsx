"use client"

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
