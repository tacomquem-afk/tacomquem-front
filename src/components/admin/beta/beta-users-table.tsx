"use client";

import {
  ArrowUpDown,
  CheckCircle2,
  Mail,
  MoreHorizontal,
  UserMinus,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useAdminBetaProgram, useRemoveBetaUser } from "@/hooks/use-admin-beta";
import type { BetaAccessTier } from "@/types";
import { AddBetaUserDialog } from "./add-beta-user-dialog";

type SortBy = "betaAddedAt" | "createdAt";
type SortOrder = "asc" | "desc";

const tierLabels: Record<BetaAccessTier, string> = {
  BETA: "Beta",
  PUBLIC: "Público",
  ARCHIVED: "Arquivado",
};

const tierVariants: Record<
  BetaAccessTier,
  "default" | "outline" | "success" | "warning"
> = {
  BETA: "success",
  PUBLIC: "outline",
  ARCHIVED: "warning",
};

export function BetaUsersTable() {
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<SortBy>("betaAddedAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [userToRemove, setUserToRemove] = useState<string | null>(null);
  const [removeReason, setRemoveReason] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const { data, isLoading } = useAdminBetaProgram({
    page,
    sortBy,
    sortOrder,
  });
  const removeUser = useRemoveBetaUser();

  const users = data?.users ?? [];
  const pagination = data?.pagination;

  const toggleSort = (column: SortBy) => {
    if (sortBy === column) {
      setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
    setPage(1);
  };

  const handleRemove = async () => {
    if (!userToRemove) return;

    try {
      await removeUser.mutateAsync({
        id: userToRemove,
        ...(removeReason.trim() ? { reason: removeReason.trim() } : {}),
      });
      toast.success("Usuário removido do programa beta");
    } catch {
      toast.error("Erro ao remover usuário do programa beta");
    } finally {
      setUserToRemove(null);
      setRemoveReason("");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {["s1", "s2", "s3", "s4", "s5"].map((k) => (
          <div key={k} className="h-16 bg-surface-800 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold">Usuários Beta</h2>
          <p className="text-sm text-muted-foreground">
            {pagination?.total ?? 0} usuário
            {(pagination?.total ?? 0) !== 1 ? "s" : ""} no programa
          </p>
        </div>
        <Button size="sm" onClick={() => setIsAddDialogOpen(true)}>
          <Mail className="size-4 mr-2" />
          Adicionar ao Beta
        </Button>
      </div>

      <div className="rounded-lg border border-border-700 bg-surface-900">
        <Table>
          <TableHeader>
            <TableRow className="border-border-700 hover:bg-surface-800">
              <TableHead className="w-55">Usuário</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Tier</TableHead>
              <TableHead>E-mail verificado</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="-ml-3 h-8 gap-1 font-medium"
                  onClick={() => toggleSort("betaAddedAt")}
                >
                  Adicionado em
                  <ArrowUpDown className="size-3.5" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="-ml-3 h-8 gap-1 font-medium"
                  onClick={() => toggleSort("createdAt")}
                >
                  Cadastrado em
                  <ArrowUpDown className="size-3.5" />
                </Button>
              </TableHead>
              <TableHead className="w-17.5" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center text-muted-foreground py-8"
                >
                  Nenhum usuário no programa beta
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow
                  key={user.id}
                  className="border-border-700 hover:bg-surface-800"
                >
                  <TableCell>
                    <span className="font-medium">{user.name}</span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {user.email}
                  </TableCell>
                  <TableCell>
                    <Badge variant={tierVariants[user.accessTier]}>
                      {tierLabels[user.accessTier]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.emailVerified ? (
                      <CheckCircle2 className="size-4 text-green-500" />
                    ) : (
                      <XCircle className="size-4 text-muted-foreground" />
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {user.betaAddedAt
                      ? new Date(user.betaAddedAt).toLocaleDateString("pt-BR")
                      : "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem
                          onClick={() => setUserToRemove(user.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <UserMinus className="size-4 mr-2" />
                          Remover do Beta
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Página {page} de {pagination.totalPages} • {pagination.total} total
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setPage((p) => Math.min(pagination.totalPages, p + 1))
              }
              disabled={page === pagination.totalPages}
            >
              Próxima
            </Button>
          </div>
        </div>
      )}

      {/* Remove Confirmation */}
      <AlertDialog
        open={userToRemove !== null}
        onOpenChange={(open) => {
          if (!open) {
            setUserToRemove(null);
            setRemoveReason("");
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover do programa beta</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover este usuário do programa beta? Ele
              perderá acesso aos recursos exclusivos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2 px-6 pb-2">
            <Label htmlFor="remove-reason">Motivo (opcional)</Label>
            <Textarea
              id="remove-reason"
              value={removeReason}
              onChange={(e) => setRemoveReason(e.target.value)}
              placeholder="Descreva o motivo da remoção..."
              className="border-border-700 resize-none"
              rows={3}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemove}
              disabled={removeUser.isPending}
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add Beta User Dialog */}
      <AddBetaUserDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      />
    </>
  );
}
