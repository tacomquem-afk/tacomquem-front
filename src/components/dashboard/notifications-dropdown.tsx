"use client";

import { useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Bell, CheckCircle, CircleCheckBig, Handshake } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDashboard } from "@/hooks/use-dashboard";
import { cn } from "@/lib/utils";
import type { DashboardRecentActivity } from "@/types";

const iconMap = {
  loan_created: Handshake,
  loan_confirmed: CircleCheckBig,
  loan_returned: CheckCircle,
  loan_reminder: Bell,
};

const colorMap = {
  loan_created: "text-blue-400 bg-blue-900/20",
  loan_confirmed: "text-cyan-400 bg-cyan-900/20",
  loan_returned: "text-green-400 bg-green-900/20",
  loan_reminder: "text-amber-400 bg-amber-900/20",
};

export function NotificationsDropdown() {
  const { data } = useDashboard();
  const queryClient = useQueryClient();
  const activities = data?.recentActivity ?? [];

  const unreadCount = activities.filter((a) => !a.read).length;

  const markAsRead = (activityId: string) => {
    queryClient.setQueryData(["dashboard"], (old: unknown) => {
      if (!old || typeof old !== "object") return old;
      const data = old as { recentActivity: DashboardRecentActivity[] };
      return {
        ...data,
        recentActivity: data.recentActivity.map((a) =>
          a.id === activityId ? { ...a, read: true } : a
        ),
      };
    });
  };

  const markAllAsRead = () => {
    queryClient.setQueryData(["dashboard"], (old: unknown) => {
      if (!old || typeof old !== "object") return old;
      const data = old as { recentActivity: DashboardRecentActivity[] };
      return {
        ...data,
        recentActivity: data.recentActivity.map((a) => ({ ...a, read: true })),
      };
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="relative p-2 rounded-md hover:bg-surface-800 transition-colors"
        >
          <Bell className="size-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 size-2 bg-red-500 rounded-full" />
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notificações</span>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllAsRead}
              className="text-xs text-accent hover:underline"
            >
              Marcar todas como lidas
            </button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {activities.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            Nenhuma notificação
          </div>
        ) : (
          <DropdownMenuGroup>
            {activities.slice(0, 10).map((activity) => {
              const Icon = iconMap[activity.type];
              const colorClass = colorMap[activity.type];

              return (
                <DropdownMenuItem
                  key={activity.id}
                  className={cn(
                    "flex gap-3 p-3 cursor-pointer",
                    !activity.read && "bg-surface-800/50"
                  )}
                  onClick={() => markAsRead(activity.id)}
                >
                  <div
                    className={cn(
                      "size-8 rounded-full flex items-center justify-center shrink-0",
                      colorClass
                    )}
                  >
                    <Icon className="size-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground truncate">
                      {activity.message}
                    </p>
                    <span className="text-[10px] text-muted-foreground">
                      {formatDistanceToNow(new Date(activity.createdAt), {
                        locale: ptBR,
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  {!activity.read && (
                    <span className="size-2 rounded-full bg-accent shrink-0 mt-1" />
                  )}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuGroup>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
