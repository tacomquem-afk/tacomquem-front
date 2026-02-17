"use client";

import { ArrowDownLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { LoanCardGrid } from "@/components/dashboard/loan-card-grid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function getInitialView(view: string | null): "lent" | "borrowed" | "all" {
  if (view === "lent" || view === "borrowed" || view === "all") {
    return view;
  }

  return "all";
}

export default function LoansPage() {
  const searchParams = useSearchParams();
  const initialView = useMemo(
    () => getInitialView(searchParams.get("view")),
    [searchParams]
  );

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-display font-bold mb-2">
          Todos os Empréstimos Ativos
        </h1>
        <p className="text-muted-foreground">
          Veja tudo que está emprestado no momento, em uma única tela.
        </p>
      </div>

      <Tabs defaultValue={initialView}>
        <TabsList className="mb-6">
          <TabsTrigger value="all" className="gap-2">
            <ArrowRight className="size-4" />
            Todos
          </TabsTrigger>
          <TabsTrigger value="lent" className="gap-2">
            <ArrowUpRight className="size-4" />
            Itens Emprestados
          </TabsTrigger>
          <TabsTrigger value="borrowed" className="gap-2">
            <ArrowDownLeft className="size-4" />
            Itens que Peguei
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <ArrowUpRight className="size-5 text-primary" />
              Itens Emprestados
            </h2>
            <LoanCardGrid />
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <ArrowDownLeft className="size-5 text-primary" />
              Itens que Peguei Emprestado
            </h2>
            <LoanCardGrid
              filter="borrowed"
              emptyTitle="Nenhum item pego emprestado"
              emptyDescription="Quando você confirmar um empréstimo recebido, ele aparecerá aqui."
            />
          </div>
        </TabsContent>

        <TabsContent value="lent">
          <LoanCardGrid />
        </TabsContent>

        <TabsContent value="borrowed">
          <LoanCardGrid
            filter="borrowed"
            emptyTitle="Nenhum item pego emprestado"
            emptyDescription="Quando você confirmar um empréstimo recebido, ele aparecerá aqui."
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
