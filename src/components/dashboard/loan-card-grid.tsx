import { LoanCard } from "./loan-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useLoans } from "@/hooks/use-loans";
import { Package } from "lucide-react";
export function LoanCardGrid() {
  const { data: loans, isLoading } = useLoans("lent");

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-80 w-full" />
        ))}
      </div>
    );
  }

  if (!loans || loans.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-border-700 rounded-2xl">
        <Package className="size-12 text-muted-foreground mb-4" />
        <h3 className="font-semibold text-lg mb-2">Nenhum item emprestado</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Comece registrando seu primeiro empréstimo para acompanhar seus itens.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {loans.map((loan) => (
        <LoanCard key={loan.id} loan={loan} />
      ))}
    </div>
  );
}
