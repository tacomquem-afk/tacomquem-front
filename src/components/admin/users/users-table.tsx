"use client";

import {
  BadgeCheck,
  MailCheck,
  MailX,
  MoreHorizontal,
  Search,
  ShieldBan,
  Trash2,
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useAdminUsers,
  useBlockUser,
  useDeleteUser,
  useUnblockUser,
} from "@/hooks/use-admin-users";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { UserDetailSheet } from "./user-detail-sheet";

const roleLabels: Record<string, string> = {
  SUPER_ADMIN: "Super Admin",
  MODERATOR: "Moderador",
  ANALYST: "Analista",
  SUPPORT: "Suporte",
  USER: "Usuário",
};

const roleColors: Record<
  string,
  "default" | "outline" | "success" | "warning"
> = {
  SUPER_ADMIN: "success",
  MODERATOR: "warning",
  ANALYST: "default",
  SUPPORT: "default",
  USER: "outline",
};

export function UsersTable() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebouncedValue(searchInput, 400);
  const [role, setRole] = useState<string>("all");
  const [isActive, setIsActive] = useState<string>("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [userToBlock, setUserToBlock] = useState<string | null>(null);
  const [blockReason, setBlockReason] = useState("");
  const [userToUnblock, setUserToUnblock] = useState<string | null>(null);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [deleteReason, setDeleteReason] = useState("");

  const { data, isLoading } = useAdminUsers({
    page,
    search: debouncedSearch || undefined,
    role: role === "all" ? undefined : role,
    isActive: isActive === "all" ? undefined : isActive === "true",
    sortBy,
    sortOrder,
  });
  const blockUser = useBlockUser();
  const unblockUser = useUnblockUser();
  const deleteUser = useDeleteUser();

  const users = data?.users ?? [];
  const pagination = data?.pagination;

  const handleBlock = async () => {
    if (!userToBlock || blockReason.length < 10) return;

    try {
      await blockUser.mutateAsync({ userId: userToBlock, reason: blockReason });
      toast.success("Usuário bloqueado com sucesso");
    } catch {
      toast.error("Erro ao bloquear usuário");
    } finally {
      setUserToBlock(null);
      setBlockReason("");
    }
  };

  const handleUnblock = async () => {
    if (!userToUnblock) return;

    try {
      await unblockUser.mutateAsync(userToUnblock);
      toast.success("Usuário desbloqueado com sucesso");
    } catch {
      toast.error("Erro ao desbloquear usuário");
    } finally {
      setUserToUnblock(null);
    }
  };

  const handleDelete = async () => {
    if (!userToDelete || deleteReason.trim().length < 10) return;

    try {
      await deleteUser.mutateAsync({
        userId: userToDelete,
        reason: deleteReason.trim(),
      });
      toast.success("Usuário excluído com sucesso");
    } catch {
      toast.error("Erro ao excluir usuário");
    } finally {
      setUserToDelete(null);
      setDeleteReason("");
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    setPage(1);
  };

  const handleRoleChange = (value: string) => {
    setRole(value);
    setPage(1);
  };

  const handleIsActiveChange = (value: string) => {
    setIsActive(value);
    setPage(1);
  };

  const handleSortByChange = (value: string) => {
    setSortBy(value);
    setPage(1);
  };

  const handleSortOrderChange = (value: "asc" | "desc") => {
    setSortOrder(value);
    setPage(1);
  };

  const resetFilters = () => {
    setSearchInput("");
    setRole("all");
    setIsActive("all");
    setSortBy("createdAt");
    setSortOrder("desc");
    setPage(1);
  };

  const hasActiveFilters = searchInput || role !== "all" || isActive !== "all";

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-16 bg-surface-800 rounded-lg animate-pulse" />
        <div className="h-16 bg-surface-800 rounded-lg animate-pulse" />
        <div className="h-16 bg-surface-800 rounded-lg animate-pulse" />
        <div className="h-16 bg-surface-800 rounded-lg animate-pulse" />
        <div className="h-16 bg-surface-800 rounded-lg animate-pulse" />
      </div>
    );
  }

  return (
    <>
      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por email..."
              value={searchInput}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={role} onValueChange={handleRoleChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Função" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="USER">Usuário</SelectItem>
              <SelectItem value="ANALYST">Analista</SelectItem>
              <SelectItem value="SUPPORT">Suporte</SelectItem>
              <SelectItem value="MODERATOR">Moderador</SelectItem>
              <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
            </SelectContent>
          </Select>
          <Select value={isActive} onValueChange={handleIsActiveChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="true">Ativos</SelectItem>
              <SelectItem value="false">Bloqueados</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={handleSortByChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt">Data cadastro</SelectItem>
              <SelectItem value="lastActivity">Última atividade</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              handleSortOrderChange(sortOrder === "asc" ? "desc" : "asc")
            }
            title={`Ordem: ${sortOrder === "asc" ? "Crescente" : "Decrescente"}`}
          >
            {sortOrder === "asc" ? "↑" : "↓"}
          </Button>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={resetFilters}>
              Limpar filtros
            </Button>
          )}
        </div>
      </div>

      <div className="rounded-lg border border-border-700 bg-surface-900">
        <Table>
          <TableHeader>
            <TableRow className="border-border-700 hover:bg-surface-800">
              <TableHead className="w-[250px]">Usuário</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Função</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Email Verificado</TableHead>
              <TableHead className="text-right">Itens</TableHead>
              <TableHead className="text-right">Empréstimos</TableHead>
              <TableHead className="w-[70px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center text-muted-foreground py-8"
                >
                  Nenhum usuário encontrado
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow
                  key={user.id}
                  className="border-border-700 hover:bg-surface-800 cursor-pointer"
                  onClick={() => setSelectedUserId(user.id)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8">
                        <AvatarFallback>
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {user.email}
                  </TableCell>
                  <TableCell>
                    <Badge variant={roleColors[user.role] ?? "outline"}>
                      {roleLabels[user.role] ?? user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {!user.isActive ? (
                      <span className="flex items-center gap-1 text-sm text-destructive">
                        <ShieldBan className="size-3" />
                        Bloqueado
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-sm text-accent-green">
                        <BadgeCheck className="size-3" />
                        Ativo
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {user.emailVerified ? (
                      <span className="flex items-center gap-1 text-sm text-accent-green">
                        <MailCheck className="size-3" />
                        Sim
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MailX className="size-3" />
                        Não
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {user.itemsCount}
                  </TableCell>
                  <TableCell className="text-right">
                    {user.loansAsLender + user.loansAsBorrower}
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[160px]">
                        <DropdownMenuItem
                          onClick={() => setSelectedUserId(user.id)}
                        >
                          Ver Detalhes
                        </DropdownMenuItem>
                        {!user.isActive ? (
                          <DropdownMenuItem
                            onClick={() => setUserToUnblock(user.id)}
                            className="text-accent-green focus:text-accent-green"
                          >
                            Desbloquear
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            onClick={() => setUserToBlock(user.id)}
                            className="text-destructive focus:text-destructive"
                          >
                            Bloquear
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() => setUserToDelete(user.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 size-4" />
                          Excluir
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

      {/* Detail Sheet */}
      <Sheet
        open={selectedUserId !== null}
        onOpenChange={(open) => !open && setSelectedUserId(null)}
      >
        <SheetContent className="w-full sm:max-w-md border-border-700">
          <SheetTitle className="sr-only" aria-hidden={!!selectedUserId}>
            Detalhes do Usuário
          </SheetTitle>
          {selectedUserId && (
            <UserDetailSheet
              userId={selectedUserId}
              onClose={() => setSelectedUserId(null)}
            />
          )}
        </SheetContent>
      </Sheet>

      {/* Block Confirmation */}
      <AlertDialog
        open={userToBlock !== null}
        onOpenChange={(open) => {
          if (!open) {
            setUserToBlock(null);
            setBlockReason("");
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bloquear usuário</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja bloquear este usuário? Ele não poderá mais
              acessar a plataforma.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Input
            placeholder="Motivo do bloqueio (mínimo 10 caracteres)"
            value={blockReason}
            onChange={(e) => setBlockReason(e.target.value)}
          />
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBlock}
              disabled={blockReason.length < 10}
            >
              Bloquear
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Unblock Confirmation */}
      <AlertDialog
        open={userToUnblock !== null}
        onOpenChange={(open) => !open && setUserToUnblock(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Desbloquear usuário</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja desbloquear este usuário?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleUnblock}>
              Desbloquear
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={userToDelete !== null}
        onOpenChange={(open) => {
          if (!open) {
            setUserToDelete(null);
            setDeleteReason("");
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir usuário</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação remove o acesso do usuário de forma permanente e não
              pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Input
            placeholder="Motivo da exclusão (mínimo 10 caracteres)"
            value={deleteReason}
            onChange={(e) => setDeleteReason(e.target.value)}
          />
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteReason.trim().length < 10}
            >
              Excluir usuário
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
