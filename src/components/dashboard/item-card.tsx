"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { motion } from "framer-motion";
import { Loader2, MoreVertical, Package, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

import { CreateLoanDialog } from "@/components/dashboard/create-loan-dialog";
import { EditItemDialog } from "@/components/dashboard/edit-item-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteItem } from "@/hooks/use-items";
import type { Item } from "@/types";

type ItemCardProps = {
  item: Item;
};

export function ItemCard({ item }: ItemCardProps) {
  const itemImage = item.images[0];
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [loanOpen, setLoanOpen] = useState(false);

  const deleteItem = useDeleteItem();

  const handleDelete = async () => {
    try {
      await deleteItem.mutateAsync(item.id);
      toast.success("Item excluído com sucesso!");
      setDeleteOpen(false);
    } catch {
      toast.error("Erro ao excluir item. Tente novamente.");
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
      >
        <Card className="group overflow-hidden border-border-700 hover:shadow-xl hover:shadow-black/20 transition-shadow">
          {/* Image */}
          <div className="relative h-48 w-full overflow-hidden">
            <Badge
              variant={item.isActive ? "success" : "destructive"}
              className="absolute top-3 left-3 z-10 gap-1"
            >
              {item.isActive ? "Disponível" : "Inativo"}
            </Badge>

            {/* Actions dropdown */}
            <div className="absolute top-3 right-3 z-10">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-7 w-7 bg-black/50 hover:bg-black/70 border-0 text-white"
                    aria-label="Ações do item"
                  >
                    <MoreVertical className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setEditOpen(true)}>
                    <Pencil className="mr-2 size-4" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setDeleteOpen(true)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 size-4" />
                    Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {itemImage ? (
              <Image
                src={itemImage}
                alt={item.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full bg-surface-800 flex items-center justify-center">
                <Package className="size-12 text-muted-foreground" />
              </div>
            )}

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-60" />

            {/* Created date */}
            <div className="absolute bottom-3 left-3 text-white">
              <p className="text-xs font-medium opacity-90">
                Cadastrado em{" "}
                {format(new Date(item.createdAt), "d 'de' MMM, yyyy", {
                  locale: ptBR,
                })}
              </p>
            </div>
          </div>

          {/* Content */}
          <CardContent className="p-4">
            <h3 className="text-base font-bold font-display mb-1">
              {item.name}
            </h3>
            {item.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {item.description}
              </p>
            )}
          </CardContent>

          {/* Actions */}
          <CardFooter className="p-4 pt-0">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => setLoanOpen(true)}
              disabled={!item.isActive}
            >
              {item.isActive ? "Emprestar" : "Item inativo"}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>

      <EditItemDialog item={item} open={editOpen} onOpenChange={setEditOpen} />
      <CreateLoanDialog item={item} open={loanOpen} onOpenChange={setLoanOpen} />

      {/* Delete confirmation dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display">Excluir item</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir{" "}
              <span className="font-medium text-foreground">{item.name}</span>?
              Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteOpen(false)}
              disabled={deleteItem.isPending}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteItem.isPending}
            >
              {deleteItem.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
