"use client";

import { Calendar, CalendarClock, UserPlus, Users } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminUserStats } from "@/hooks/use-admin-analytics";

export function UsersStatsCard() {
  const { data: stats, isLoading } = useAdminUserStats();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const growthRateFormatted = stats?.growthRate
    ? `${stats.growthRate > 0 ? "+" : ""}${stats.growthRate}%`
    : "0%";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Estatísticas de Usuários</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <StatCard
            icon={UserPlus}
            label="Novos Hoje"
            value={stats?.newUsersToday ?? 0}
          />
          <StatCard
            icon={Calendar}
            label="Nova Semana"
            value={stats?.newUsersThisWeek ?? 0}
          />
          <StatCard
            icon={CalendarClock}
            label="Novos no Mês"
            value={stats?.newUsersThisMonth ?? 0}
          />
          <StatCard
            icon={Users}
            label="Taxa de Crescimento"
            value={parseFloat(growthRateFormatted)}
            trend={growthRateFormatted}
            variant={
              stats?.growthRate && stats.growthRate > 0 ? "success" : "default"
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}
