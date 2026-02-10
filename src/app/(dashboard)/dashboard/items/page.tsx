"use client";

import { ItemCardGrid } from "@/components/dashboard/item-card-grid";
import { Button } from "@/components/ui/button";
import { Package, Plus } from "lucide-react";

export default function ItemsPage() {
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
        <Button className="gap-2">
          <Plus className="size-4" />
          Novo Item
        </Button>
      </div>

      {/* Items Grid */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Package className="size-5 text-primary" />
          <h2 className="text-lg font-bold">Todos os Itens</h2>
        </div>

        <ItemCardGrid />
      </div>
    </div>
  );
}
