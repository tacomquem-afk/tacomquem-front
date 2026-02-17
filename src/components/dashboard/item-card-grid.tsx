import { Package } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useItems } from "@/hooks/use-items";
import type { Item } from "@/types";
import { ItemCard } from "./item-card";

type ItemCardGridProps = {
  items?: Item[];
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
};

export function ItemCardGrid({
  items: providedItems,
  isLoading: providedLoading,
  emptyTitle,
  emptyDescription,
}: ItemCardGridProps) {
  const { data: fetchedItems, isLoading: fetchedLoading } = useItems();

  const items = providedItems ?? fetchedItems;
  const isLoading = providedLoading ?? fetchedLoading;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-80 w-full" />
        ))}
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-border-700 rounded-2xl">
        <Package className="size-12 text-muted-foreground mb-4" />
        <h3 className="font-semibold text-lg mb-2">Nenhum item cadastrado</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Cadastre seus itens para começar a emprestar e acompanhar tudo por
          aqui.
        </p>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-border-700 rounded-2xl">
        <Package className="size-12 text-muted-foreground mb-4" />
        <h3 className="font-semibold text-lg mb-2">
          {emptyTitle ?? "Nenhum item cadastrado"}
        </h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          {emptyDescription ??
            "Cadastre seus itens para começar a emprestar e acompanhar tudo por aqui."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}
