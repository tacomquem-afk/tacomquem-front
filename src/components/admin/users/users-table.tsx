"use client";

import { BadgeCheck, MoreHorizontal, ShieldBan } from "lucide-react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent } from "@/components/ui/sheet";
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
  useUnblockUser,
} from "@/hooks/use-admin-users";
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
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [userToBlock, setUserToBlock] = useState<string | null>(null);
  const [userToUnblock, setUserToUnblock] = useState<string | null>(null);

  const { data, isLoading } = useAdminUsers(page);
  const blockUser = useBlockUser();
  const unblockUser = useUnblockUser();

  const users = data?.users ?? [];
  const pagination = data?.pagination;

  const handleBlock = async () => {
    if (!userToBlock) return;

    try {
      await blockUser.mutateAsync(userToBlock);
      toast.success("Usuário bloqueado com sucesso");
    } catch {
      toast.error("Erro ao bloquear usuário");
    } finally {
      setUserToBlock(null);
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
      <div className="rounded-lg border border-border-700 bg-surface-900">
        <Table>
          <TableHeader>
            <TableRow className="border-border-700 hover:bg-surface-800">
              <TableHead className="w-[250px]">Usuário</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Função</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Itens</TableHead>
              <TableHead className="text-right">Empréstimos</TableHead>
              <TableHead className="w-[70px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
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
                        <AvatarImage src={user.avatarUrl ?? undefined} />
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
                    {user.isBlocked ? (
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
                  <TableCell className="text-right">
                    {user.itemsCount}
                  </TableCell>
                  <TableCell className="text-right">
                    {user.loansCount}
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
                        {user.isBlocked ? (
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
        onOpenChange={(open) => !open && setUserToBlock(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bloquear usuário</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja bloquear este usuário? Ele não poderá mais
              acessar a plataforma.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleBlock}>
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
    </>
  );
}
