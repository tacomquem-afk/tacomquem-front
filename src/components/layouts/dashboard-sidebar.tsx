"use client";

import {
  History,
  LayoutDashboard,
  Package,
  Settings,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/shared/logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useDashboard } from "@/hooks/use-dashboard";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";

const navigation = [
  { name: "Visão Geral", href: "/dashboard", icon: LayoutDashboard },
  { name: "Meus Itens", href: "/dashboard/items", icon: Package },
  { name: "Histórico", href: "/dashboard/history", icon: History },
  { name: "Amigos", href: "/dashboard/friends", icon: Users },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { data: dashboard } = useDashboard();

  return (
    <aside className="w-64 bg-surface-900 border-r border-border-700 flex flex-col fixed h-full z-20 hidden lg:flex">
      {/* Logo */}
      <div className="p-6">
        <div className="mb-10">
          <Logo size="md" />
        </div>

        {/* User Card */}
        <div className="flex gap-3 items-center p-3 rounded-xl bg-surface-800">
          <Avatar className="size-12">
            <AvatarImage src={user?.avatarUrl ?? undefined} />
            <AvatarFallback>
              {user?.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <h3 className="text-sm font-semibold">
              Olá, {user?.name.split(" ")[0]}
            </h3>
            <p className="text-xs text-muted-foreground">
              O que está com quem?
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-6 flex flex-col gap-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
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
            );
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

        <Button variant="ghost" className="w-full justify-start mt-2" asChild>
          <Link href="/dashboard/settings">
            <Settings className="size-4 mr-2" />
            Configurações
          </Link>
        </Button>
      </div>
    </aside>
  );
}
