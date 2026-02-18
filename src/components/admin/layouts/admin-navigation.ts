import {
  BarChart3,
  FlaskConical,
  type LucideIcon,
  Scale,
  Settings,
  Shield,
  Users,
} from "lucide-react";

export interface AdminNavigationItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

export const adminNavigation: AdminNavigationItem[] = [
  { name: "Visão Geral", href: "/admin", icon: BarChart3 },
  { name: "Usuários", href: "/admin/users", icon: Users },
  { name: "Moderação", href: "/admin/moderation", icon: Scale },
  { name: "Administradores", href: "/admin/admins", icon: Shield },
  { name: "Programa Beta", href: "/admin/beta", icon: FlaskConical },
] as const;

export const adminSettingsItem: AdminNavigationItem = {
  name: "Configurações",
  href: "/dashboard/settings",
  icon: Settings,
} as const;
