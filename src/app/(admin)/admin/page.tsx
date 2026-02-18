import type { Metadata } from "next";
import { AdminStatsGrid } from "@/components/admin/analytics/admin-stats-grid";
import { LoansStatsCard } from "@/components/admin/analytics/loans-stats-card";
import { UsersStatsCard } from "@/components/admin/analytics/users-stats-card";

export const metadata: Metadata = { title: "Admin – Visão Geral" };

export default function AdminDashboardPage() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-display font-bold mb-2">Visão Geral</h1>
        <p className="text-muted-foreground">
          Métricas e indicadores da plataforma.
        </p>
      </div>
      <AdminStatsGrid />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UsersStatsCard />
        <LoansStatsCard />
      </div>
    </div>
  );
}
