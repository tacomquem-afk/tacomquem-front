"use client";

import { Mail, MoreHorizontal, UserMinus } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAdminBetaProgram, useRemoveBetaUser } from "@/hooks/use-admin-beta";
import { AddBetaUserDialog } from "./add-beta-user-dialog";

export function BetaUsersTable() {
  const [userToRemove, setUserToRemove] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const { data, isLoading } = useAdminBetaProgram();
  const removeUser = useRemoveBetaUser();

  const users = data?.users ?? [];
  const total = data?.total ?? 0;

  const handleRemove = async () => {
    if (!userToRemove) return;

    try {
      await removeUser.mutateAsync(userToRemove);
      toast.success("Usuário removido do programa beta");
    } catch {
      toast.error("Erro ao remover usuário do programa beta");
    } finally {
      setUserToRemove(null);
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
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold">Usuários Beta</h2>
          <p className="text-sm text-muted-foreground">
            {total} usuário{total !== 1 ? "s" : ""} no programa
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
              <TableHead className="w-[250px]">Usuário</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Adicionado em</TableHead>
              <TableHead className="w-[70px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
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
                  <TableCell className="text-muted-foreground">
                    {new Date(user.addedAt).toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[160px]">
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

      {/* Remove Confirmation */}
      <AlertDialog
        open={userToRemove !== null}
        onOpenChange={(open) => !open && setUserToRemove(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover do programa beta</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover este usuário do programa beta? Ele
              perderá acesso aos recursos exclusivos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleRemove}>
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
