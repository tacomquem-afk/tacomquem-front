"use client";

import { ArrowLeft, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  SheetClose,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";
import { adminNavigation } from "./admin-navigation";

const roleLabels: Record<string, string> = {
  SUPER_ADMIN: "Super Admin",
  MODERATOR: "Moderador",
  ANALYST: "Analista",
  SUPPORT: "Suporte",
};

export function AdminMobileMenu() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

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
        <SheetTitle className="font-display text-left">Menu Admin</SheetTitle>
        <SheetDescription className="text-left">
          Navegação do painel administrativo.
        </SheetDescription>
      </SheetHeader>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* User Card */}
        <div className="flex gap-3 items-center p-3 rounded-xl bg-surface-800">
          <Avatar className="size-12">
            <AvatarImage src={user?.avatarUrl ?? undefined} />
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-semibold">{userName.split(" ")[0]}</h3>
            <Badge variant="outline" className="text-[10px] py-0 h-4 w-fit">
              {roleLabels[user?.role ?? ""] ?? user?.role}
            </Badge>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1">
          {adminNavigation.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

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
      </div>

      {/* Footer Actions */}
      <div className="p-4 pt-2 border-t border-border-700 space-y-2">
        <SheetClose asChild>
          <Link
            href="/dashboard"
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "w-full justify-start gap-2"
            )}
          >
            <ArrowLeft className="size-4" />
            Voltar ao Dashboard
          </Link>
        </SheetClose>

        <SheetClose asChild>
          <Button
            variant="ghost"
            className="w-full justify-start text-destructive hover:text-destructive"
            onClick={logout}
          >
            <LogOut className="size-4 mr-2" />
            Sair
          </Button>
        </SheetClose>
      </div>
    </div>
  );
}
