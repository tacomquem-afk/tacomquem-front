"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ActivityTimeline } from "@/components/dashboard/activity-timeline";
import { LoanCardGrid } from "@/components/dashboard/loan-card-grid";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold mb-2">
          Central de Empréstimos
        </h1>
        <p className="text-muted-foreground">
          Gerencie seus itens compartilhados com tranquilidade.
        </p>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Main area - Loans */}
        <div className="md:col-span-8 lg:col-span-9 flex flex-col gap-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <ArrowRight className="size-5 text-primary" />
              Itens Emprestados
            </h2>
            <Button variant="link" size="sm" className="shrink-0 px-0" asChild>
              <Link href="/dashboard/loans?view=lent">Ver todos</Link>
            </Button>
          </div>

          <LoanCardGrid />

          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold flex items-center gap-2 max-w-[70%] sm:max-w-none">
              <ArrowRight className="size-5 text-primary" />
              Itens que Peguei Emprestado
            </h2>
            <Button variant="link" size="sm" className="shrink-0 px-0" asChild>
              <Link href="/dashboard/loans?view=borrowed">Ver todos</Link>
            </Button>
          </div>

          <LoanCardGrid
            filter="borrowed"
            emptyTitle="Nenhum item pego emprestado"
            emptyDescription="Quando você confirmar um empréstimo recebido, ele aparecerá aqui."
          />
        </div>

        {/* Sidebar widgets */}
        <div className="md:col-span-4 lg:col-span-3 flex flex-col gap-6">
          <ActivityTimeline />
        </div>
      </div>
    </div>
  );
}
