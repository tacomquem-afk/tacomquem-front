import {
  BellRing,
  Handshake,
  History,
  LayoutDashboard,
  Package,
  Settings,
  Users,
} from "lucide-react";

export const dashboardNavigation = [
  { name: "Visão Geral", href: "/dashboard", icon: LayoutDashboard },
  { name: "Empréstimos", href: "/dashboard/loans", icon: Handshake },
  { name: "Meus Itens", href: "/dashboard/items", icon: Package },
  { name: "Histórico", href: "/dashboard/history", icon: History },
  { name: "Notificações", href: "/dashboard/notifications", icon: BellRing },
  { name: "Amigos", href: "/dashboard/friends", icon: Users },
] as const;

export const dashboardSettingsItem = {
  name: "Configurações",
  href: "/dashboard/settings",
  icon: Settings,
} as const;
