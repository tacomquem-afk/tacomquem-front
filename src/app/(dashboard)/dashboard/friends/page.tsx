"use client";

import { Search, Users } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { FriendCard } from "@/components/dashboard/friend-card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardSearch } from "@/hooks/use-dashboard-search";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useFriends } from "@/hooks/use-friends";

export default function FriendsPage() {
  const searchParams = useSearchParams();
  const { data: friends, isLoading } = useFriends();
  const [search, setSearch] = useState(searchParams.get("q") ?? "");
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

  const filtered = useMemo(() => {
    if (!isSearching) return friends ?? [];
    return searchData?.friends ?? [];
  }, [friends, isSearching, searchData]);

  const showLoading = isLoading || (isSearching && isSearchLoading);

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end gap-4 justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold mb-2">Amigos</h1>
          <p className="text-muted-foreground">
            Pessoas com quem você já compartilhou itens.
          </p>
        </div>

        {!showLoading && friends && friends.length > 0 && (
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Buscar por nome ou e-mail..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        )}
      </div>

      {/* Friends Grid */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Users className="size-5 text-primary" />
          <h2 className="text-lg font-bold">Todos os Amigos</h2>
          {friends && (
            <span className="text-sm text-muted-foreground">
              ({filtered.length}
              {search && friends.length !== filtered.length
                ? ` de ${friends.length}`
                : ""}
              )
            </span>
          )}
        </div>

        {showLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-44 w-full" />
            ))}
          </div>
        ) : isSearchError ? (
          <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-border-700 rounded-2xl">
            <Search className="size-12 text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg mb-2">
              Erro ao buscar amigos
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Não foi possível carregar a busca agora. Tente novamente.
            </p>
          </div>
        ) : !friends || friends.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-border-700 rounded-2xl">
            <Users className="size-12 text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg mb-2">Nenhum amigo ainda</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Quando um empréstimo for confirmado, a pessoa aparecerá aqui
              automaticamente.
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-border-700 rounded-2xl">
            <Search className="size-12 text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg mb-2">
              Nenhum resultado para &quot;{normalizedSearch}&quot;
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Tente buscar por outro nome ou e-mail.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((friend) => (
              <FriendCard key={friend.id} friend={friend} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
