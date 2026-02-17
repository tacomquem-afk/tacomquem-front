"use client";

import { Package, Plus, Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { CreateItemDialog } from "@/components/dashboard/create-item-dialog";
import { ItemCardGrid } from "@/components/dashboard/item-card-grid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDashboardSearch } from "@/hooks/use-dashboard-search";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useItems } from "@/hooks/use-items";

export default function ItemsPage() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const { data: items, isLoading } = useItems();
  const debouncedSearch = useDebouncedValue(search, 300);
  const normalizedSearch = debouncedSearch.trim();
  const isSearching = normalizedSearch.length > 0;
  const {
    data: searchData,
    isFetching: isSearchLoading,
    isError: isSearchError,
  } = useDashboardSearch(normalizedSearch, 20);

  useEffect(() => {
    setSearch(searchParams.get("q") ?? "");
  }, [searchParams]);

  const displayedItems = useMemo(() => {
    if (!items) return [];
    if (!isSearching) return items;

    const searchIds = new Set((searchData?.items ?? []).map((item) => item.id));
    return items.filter((item) => searchIds.has(item.id));
  }, [items, isSearching, searchData]);

  const filteredCount = useMemo(() => {
    return displayedItems.length;
  }, [displayedItems]);

  const showLoading = isLoading || (isSearching && isSearchLoading);

  const emptyTitle = isSearchError
    ? "Erro ao buscar itens"
    : isSearching
      ? `Nenhum resultado para "${normalizedSearch}"`
      : "Nenhum item cadastrado";

  const emptyDescription = isSearchError
    ? "Não foi possível carregar a busca agora. Tente novamente."
    : isSearching
      ? "Tente buscar com outro termo."
      : "Cadastre seus itens para começar a emprestar e acompanhar tudo por aqui.";

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold mb-2">Meus Itens</h1>
          <p className="text-muted-foreground">
            Gerencie os itens que você cadastrou para empréstimo.
          </p>
        </div>
        <Button className="gap-2" onClick={() => setCreateDialogOpen(true)}>
          <Plus className="size-4" />
          Novo Item
        </Button>
      </div>

      {/* Items Grid */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <Package className="size-5 text-primary" />
            <h2 className="text-lg font-bold">Todos os Itens</h2>
            {!showLoading && items && (
              <span className="text-sm text-muted-foreground">
                ({filteredCount}
                {search && filteredCount !== items.length
                  ? ` de ${items.length}`
                  : ""}
                )
              </span>
            )}
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Buscar por nome ou descrição..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <ItemCardGrid
          items={displayedItems}
          isLoading={showLoading}
          emptyTitle={emptyTitle}
          emptyDescription={emptyDescription}
        />
      </div>

      <CreateItemDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </div>
  );
}
