"use client";

import { Bell, Menu, Plus, Search } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

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
        <Logo size="sm" linkToHome={false} />
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
  );
}
