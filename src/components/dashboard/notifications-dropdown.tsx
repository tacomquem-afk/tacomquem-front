"use client";

import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Bell,
  CheckCircle,
  CircleCheckBig,
  Handshake,
  History,
} from "lucide-react";
import Link from "next/link";
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
import {
  useMarkAllNotificationsAsRead,
  useMarkNotificationAsRead,
} from "@/hooks/use-notifications";
import { cn } from "@/lib/utils";

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
  const { mutate: markAsRead } = useMarkNotificationAsRead();
  const { mutate: markAllAsRead, isPending: isMarkingAll } =
    useMarkAllNotificationsAsRead();

  const activities = data?.recentActivity ?? [];
  const unreadCount = activities.filter((a) => !a.read).length;

  const handleMarkAsRead = (activityId: string) => {
    markAsRead(activityId);
  };

  const handleMarkAllAsRead = () => {
    if (unreadCount > 0 && !isMarkingAll) {
      markAllAsRead();
    }
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
              onClick={handleMarkAllAsRead}
              disabled={isMarkingAll}
              className="text-xs text-accent hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isMarkingAll ? "Marcando..." : "Marcar todas como lidas"}
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
                  onClick={() => handleMarkAsRead(activity.id)}
                  disabled={activity.read}
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
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link
            href="/dashboard/notifications"
            className="justify-center gap-2"
          >
            <History className="size-4" />
            Ver histórico completo
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
