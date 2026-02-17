"use client";

import { LogOut, Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  SheetClose,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useDashboard } from "@/hooks/use-dashboard";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";
import {
  dashboardNavigation,
  dashboardSettingsItem,
} from "./dashboard-navigation";

type DashboardMobileMenuProps = {
  onRegisterLoan: () => void;
};

export function DashboardMobileMenu({
  onRegisterLoan,
}: DashboardMobileMenuProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { data: dashboard } = useDashboard();

  const userName = user?.name ?? "Usuário";
  const userInitials =
    userName
      .split(" ")
      .map((part) => part[0] ?? "")
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  return (
    <div className="flex h-full flex-col bg-surface-900">
      <SheetHeader className="p-4 pr-12 border-b border-border-700">
        <SheetTitle className="font-display text-left">Menu</SheetTitle>
        <SheetDescription className="text-left">
          Navegação e ações rápidas do painel.
        </SheetDescription>
      </SheetHeader>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div className="flex gap-3 items-center p-3 rounded-xl bg-surface-800">
          <Avatar className="size-12">
            <AvatarImage src={user?.avatarUrl ?? undefined} />
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <h3 className="text-sm font-semibold">
              Olá, {userName.split(" ")[0]}
            </h3>
            <p className="text-xs text-muted-foreground">
              O que está com quem?
            </p>
          </div>
        </div>

        <nav className="flex flex-col gap-1">
          {dashboardNavigation.map((item) => {
            const isActive = pathname === item.href;

            return (
              <SheetClose key={item.href} asChild>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-surface-800 hover:text-foreground"
                  )}
                >
                  <item.icon className="size-5" />
                  {item.name}
                </Link>
              </SheetClose>
            );
          })}
        </nav>

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
      </div>

      <div className="p-4 pt-2 border-t border-border-700 space-y-2">
        <SheetClose asChild>
          <Button
            className="w-full justify-start gap-2"
            onClick={onRegisterLoan}
          >
            <Plus className="size-4" />
            Registrar Empréstimo
          </Button>
        </SheetClose>

        <div className="grid grid-cols-2 gap-2">
          <SheetClose asChild>
            <Link
              href={dashboardSettingsItem.href}
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "justify-start"
              )}
            >
              <dashboardSettingsItem.icon className="size-4 mr-2" />
              {dashboardSettingsItem.name}
            </Link>
          </SheetClose>

          <SheetClose asChild>
            <Button
              variant="ghost"
              className="justify-start text-destructive hover:text-destructive"
              onClick={logout}
            >
              <LogOut className="size-4 mr-2" />
              Sair
            </Button>
          </SheetClose>
        </div>
      </div>
    </div>
  );
}
