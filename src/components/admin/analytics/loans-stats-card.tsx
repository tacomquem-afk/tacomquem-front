"use client";

import {
  RotateCcw,
  Calendar,
  CalendarClock,
  Timer,
  TrendingUp,
} from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminLoanStats } from "@/hooks/use-admin-analytics";

export function LoansStatsCard() {
  const { data: stats, isLoading } = useAdminLoanStats();

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

  const returnRateFormatted = stats?.returnRate ? `${stats.returnRate}%` : "0%";

  const avgDurationFormatted = stats?.averageLoanDuration
    ? `${stats.averageLoanDuration}d`
    : "0d";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Estatísticas de Empréstimos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <StatCard
            icon={TrendingUp}
            label="Empréstimos Hoje"
            value={stats?.loansToday ?? 0}
          />
          <StatCard
            icon={Calendar}
            label="Esta Semana"
            value={stats?.loansThisWeek ?? 0}
          />
          <StatCard
            icon={CalendarClock}
            label="Este Mês"
            value={stats?.loansThisMonth ?? 0}
          />
          <StatCard
            icon={Timer}
            label="Duração Média"
            value={stats?.averageLoanDuration ?? 0}
            trend={avgDurationFormatted}
          />
        </div>
        <div className="mt-4 pt-4 border-t border-border-700">
          <StatCard
            icon={RotateCcw}
            label="Taxa de Devolução"
            value={parseFloat(returnRateFormatted)}
            trend={returnRateFormatted}
            variant={
              stats?.returnRate && stats.returnRate > 80 ? "success" : "default"
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}
