import { Package } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useLoans } from "@/hooks/use-loans";
import type { LoanListFilter } from "@/types";
import { LoanCard } from "./loan-card";

type LoanCardGridProps = {
  filter?: Extract<LoanListFilter, "lent" | "borrowed">;
  emptyTitle?: string;
  emptyDescription?: string;
};

export function LoanCardGrid({
  filter = "lent",
  emptyTitle,
  emptyDescription,
}: LoanCardGridProps) {
  const { data: loans, isLoading } = useLoans(filter);
  const isBorrowed = filter === "borrowed";

  // Filter out returned loans from both views
  const filteredLoans = loans?.filter((loan) => loan.status !== "returned");

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-80 w-full" />
        ))}
      </div>
    );
  }

  if (!filteredLoans || filteredLoans.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-border-700 rounded-2xl">
        <Package className="size-12 text-muted-foreground mb-4" />
        <h3 className="font-semibold text-lg mb-2">
          {emptyTitle ??
            (isBorrowed
              ? "Nenhum item pego emprestado"
              : "Nenhum item emprestado")}
        </h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          {emptyDescription ??
            (isBorrowed
              ? "Quando você confirmar um empréstimo, ele aparecerá aqui."
              : "Comece registrando seu primeiro empréstimo para acompanhar seus itens.")}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredLoans.map((loan) => (
        <LoanCard
          key={loan.id}
          loan={loan}
          role={isBorrowed ? "borrower" : "lender"}
        />
      ))}
    </div>
  );
}
