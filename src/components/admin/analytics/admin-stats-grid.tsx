"use client";

import {
  AlertCircle,
  Archive,
  Package,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";
import { StatCard, StatCardSkeleton } from "@/components/dashboard/stat-card";
import { useAdminDashboard } from "@/hooks/use-admin-analytics";

export function AdminStatsGrid() {
  const { data: stats, isLoading } = useAdminDashboard();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <StatCard
        icon={Users}
        label="Total de Usuários"
        value={stats?.totalUsers ?? 0}
      />
      <StatCard
        icon={UserCheck}
        label="Usuários Ativos"
        value={stats?.activeUsers ?? 0}
        variant="success"
      />
      <StatCard
        icon={Package}
        label="Total de Itens"
        value={stats?.totalItems ?? 0}
      />
      <StatCard
        icon={Archive}
        label="Total de Empréstimos"
        value={stats?.totalLoans ?? 0}
      />
      <StatCard
        icon={TrendingUp}
        label="Empréstimos Ativos"
        value={stats?.activeLoans ?? 0}
        variant="success"
      />
      <StatCard
        icon={AlertCircle}
        label="Empréstimos Pendentes"
        value={stats?.pendingLoans ?? 0}
        variant="warning"
      />
    </div>
  );
}
