"use client";

import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Bell,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  CircleCheckBig,
  Handshake,
  Inbox,
} from "lucide-react";
import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNotifications } from "@/hooks/use-notifications";
import { cn } from "@/lib/utils";
import type { Notification, NotificationsReadFilter } from "@/types";

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

function parseReadFilter(raw: string | null): NotificationsReadFilter {
  if (raw === "read" || raw === "unread") return raw;
  return "all";
}

function parsePage(raw: string | null): number {
  const parsed = Number.parseInt(raw ?? "1", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

function parseLimit(raw: string | null): number {
  const parsed = Number.parseInt(raw ?? "20", 10);
  if (!Number.isFinite(parsed) || parsed < 1) return 20;
  return Math.min(parsed, 50);
}

function NotificationCard({ notification }: { notification: Notification }) {
  const Icon = iconMap[notification.type];
  const colorClass = colorMap[notification.type];

  return (
    <Card
      className={cn(
        "border-border-700 bg-surface-900/70",
        !notification.read && "ring-1 ring-primary/40"
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "mt-1 size-10 rounded-full flex items-center justify-center shrink-0",
              colorClass
            )}
          >
            <Icon className="size-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-sm sm:text-base font-semibold leading-tight">
                {notification.title}
              </h2>
              <Badge variant={notification.read ? "secondary" : "default"}>
                {notification.read ? "Lida" : "Não lida"}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {notification.message}
            </p>
            <p className="text-xs text-muted-foreground mt-3">
              {formatDistanceToNow(new Date(notification.createdAt), {
                locale: ptBR,
                addSuffix: true,
              })}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function NotificationsSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4].map((id) => (
        <Skeleton key={id} className="h-28 w-full rounded-xl" />
      ))}
    </div>
  );
}

export default function NotificationsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const readFilter = parseReadFilter(searchParams.get("filter"));
  const page = parsePage(searchParams.get("page"));
  const limit = parseLimit(searchParams.get("limit"));

  const { data, isLoading, isFetching, isError, refetch } = useNotifications({
    readFilter,
    page,
    limit,
  });

  const notifications = data?.notifications ?? [];
  const unreadCount = data?.unreadCount ?? 0;
  const pagination = data?.pagination;
  const currentPage = pagination?.page ?? page;
  const totalPages = pagination?.totalPages ?? 1;

  const updateSearch = useCallback(
    (next: Partial<{ filter: NotificationsReadFilter; page: number }>) => {
      const params = new URLSearchParams(searchParams.toString());

      if (next.filter) {
        if (next.filter === "all") {
          params.delete("filter");
        } else {
          params.set("filter", next.filter);
        }
        params.set("page", "1");
      }

      if (typeof next.page === "number") {
        params.set("page", String(next.page));
      }

      params.set("limit", String(limit));
      router.push(`${pathname}?${params.toString()}`);
    },
    [limit, pathname, router, searchParams]
  );

  const subtitle = useMemo(() => {
    if (!pagination) return "Visualize todas as notificações da sua conta.";
    return `${pagination.total} notificações no total`;
  }, [pagination]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">Notificações</h1>
          <p className="text-muted-foreground">{subtitle}</p>
        </div>
        <div className="flex items-center gap-2 p-3 rounded-xl bg-surface-800 border border-border-700 text-sm">
          <Bell className="size-4 text-primary" />
          <span className="font-medium">{unreadCount}</span>
          <span className="text-muted-foreground">não lidas</span>
        </div>
      </div>

      <Tabs
        value={readFilter}
        onValueChange={(value) =>
          updateSearch({ filter: value as NotificationsReadFilter })
        }
      >
        <TabsList className="mb-6">
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="unread">Não lidas</TabsTrigger>
          <TabsTrigger value="read">Lidas</TabsTrigger>
        </TabsList>
      </Tabs>

      {isLoading ? (
        <NotificationsSkeleton />
      ) : isError ? (
        <Card className="border-destructive/40">
          <CardHeader>
            <CardTitle>Não foi possível carregar notificações</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground mb-4">
              Tente novamente em alguns instantes.
            </p>
            <Button onClick={() => refetch()}>Tentar novamente</Button>
          </CardContent>
        </Card>
      ) : notifications.length === 0 ? (
        <Card className="border-border-700">
          <CardContent className="p-10 text-center">
            <Inbox className="size-10 text-muted-foreground mx-auto mb-3" />
            <h2 className="text-lg font-semibold">Nenhuma notificação aqui</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Quando houver novidades, elas aparecerão nesta lista.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <NotificationCard key={notification.id} notification={notification} />
          ))}
        </div>
      )}

      {!isLoading && !isError && totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-border-700 pt-5">
          <p className="text-sm text-muted-foreground">
            Página {currentPage} de {totalPages}
            {isFetching && " • Atualizando..."}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateSearch({ page: currentPage - 1 })}
              disabled={currentPage <= 1 || isFetching}
            >
              <ChevronLeft className="size-4 mr-1" />
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateSearch({ page: currentPage + 1 })}
              disabled={currentPage >= totalPages || isFetching}
            >
              Próxima
              <ChevronRight className="size-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
