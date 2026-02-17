import { ArrowDownLeft, ArrowUpRight, Package } from "lucide-react";
import { useDashboard } from "@/hooks/use-dashboard";
import { StatCard, StatCardSkeleton } from "./stat-card";

export function StatsGrid() {
  const { data, isLoading } = useDashboard();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard
        icon={Package}
        label="Meus Itens"
        value={data?.stats.totalItems ?? 0}
        trend="+2 este mês"
      />
      <StatCard
        icon={ArrowUpRight}
        label="Emprestados"
        value={data?.stats.activeLoans ?? 0}
        variant="warning"
      />
      <StatCard
        icon={ArrowDownLeft}
        label="Peguei Emprestado"
        value={data?.stats.borrowedItems ?? 0}
        variant="success"
      />
    </div>
  );
}
