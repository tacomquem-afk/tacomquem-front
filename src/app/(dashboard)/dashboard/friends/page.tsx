"use client";

import { Search, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { FriendCard } from "@/components/dashboard/friend-card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useFriends } from "@/hooks/use-friends";

export default function FriendsPage() {
  const { data: friends, isLoading } = useFriends();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!friends) return [];
    const q = search.trim().toLowerCase();
    if (!q) return friends;
    return friends.filter(
      (f) =>
        f.name.toLowerCase().includes(q) || f.email.toLowerCase().includes(q)
    );
  }, [friends, search]);

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end gap-4 justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold mb-2">Amigos</h1>
          <p className="text-muted-foreground">
            Pessoas com quem você já compartilhou itens.
          </p>
        </div>

        {!isLoading && friends && friends.length > 0 && (
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

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-44 w-full" />
            ))}
          </div>
        ) : !friends || friends.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-border-700 rounded-2xl">
            <Users className="size-12 text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg mb-2">Nenhum amigo ainda</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Quando você emprestar ou pegar itens emprestados, as pessoas
              aparecerão aqui automaticamente.
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-border-700 rounded-2xl">
            <Search className="size-12 text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg mb-2">
              Nenhum resultado para &quot;{search}&quot;
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
