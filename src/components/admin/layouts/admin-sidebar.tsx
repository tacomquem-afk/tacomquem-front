"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/shared/logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";
import { adminNavigation } from "./admin-navigation";

const roleLabels: Record<string, string> = {
  SUPER_ADMIN: "Super Admin",
  MODERATOR: "Moderador",
  ANALYST: "Analista",
  SUPPORT: "Suporte",
};

export function AdminSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <aside className="w-64 bg-surface-900 border-r border-border-700 flex flex-col fixed h-full z-20 hidden lg:flex">
      {/* Logo */}
      <div className="p-6">
        <div className="mb-10">
          <Logo size="md" />
        </div>

        {/* Admin User Card */}
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
          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-semibold">
              {user?.name.split(" ")[0]}
            </h3>
            <Badge variant="outline" className="text-[10px] py-0 h-4 w-fit">
              {roleLabels[user?.role ?? ""] ?? user?.role}
            </Badge>
          </div>
        </div>

        {/* Admin Navigation */}
        <nav className="mt-6 flex flex-col gap-1">
          {adminNavigation.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
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

      {/* Back to Dashboard */}
      <div className="mt-auto p-6 border-t border-border-700">
        <Button variant="ghost" className="w-full justify-start gap-2" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="size-4" />
            Voltar ao Dashboard
          </Link>
        </Button>
      </div>
    </aside>
  );
}
