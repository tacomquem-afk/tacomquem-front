"use client";

import { MoreHorizontal, Shield, Trash2 } from "lucide-react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAdminAccounts, useDeleteAdmin } from "@/hooks/use-admin-admins";
import { AddAdminDialog } from "./add-admin-dialog";
import { ChangeRoleDialog } from "./change-role-dialog";

const roleLabels: Record<string, string> = {
  SUPER_ADMIN: "Super Admin",
  MODERATOR: "Moderador",
  ANALYST: "Analista",
  SUPPORT: "Suporte",
};

const roleColors: Record<
  string,
  "default" | "outline" | "success" | "warning"
> = {
  SUPER_ADMIN: "success",
  MODERATOR: "warning",
  ANALYST: "default",
  SUPPORT: "default",
};

export function AdminsTable() {
  const [adminToDelete, setAdminToDelete] = useState<string | null>(null);
  const [adminToChangeRole, setAdminToChangeRole] = useState<string | null>(
    null
  );
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const { data, isLoading } = useAdminAccounts();
  const deleteAdmin = useDeleteAdmin();

  const admins = data?.admins ?? [];

  const handleDelete = async () => {
    if (!adminToDelete) return;

    try {
      await deleteAdmin.mutateAsync(adminToDelete);
      toast.success("Administrador removido com sucesso");
    } catch {
      toast.error("Erro ao remover administrador");
    } finally {
      setAdminToDelete(null);
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
        <h2 className="text-lg font-semibold">Administradores</h2>
        <Button size="sm" onClick={() => setIsAddDialogOpen(true)}>
          <Shield className="size-4 mr-2" />
          Adicionar Admin
        </Button>
      </div>

      <div className="rounded-lg border border-border-700 bg-surface-900">
        <Table>
          <TableHeader>
            <TableRow className="border-border-700 hover:bg-surface-800">
              <TableHead className="w-[250px]">Administrador</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Função</TableHead>
              <TableHead>Cadastrado em</TableHead>
              <TableHead className="w-[70px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {admins.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground py-8"
                >
                  Nenhum administrador encontrado
                </TableCell>
              </TableRow>
            ) : (
              admins.map((admin) => (
                <TableRow
                  key={admin.id}
                  className="border-border-700 hover:bg-surface-800"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8">
                        <AvatarImage src={admin.avatarUrl ?? undefined} />
                        <AvatarFallback>
                          {admin.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{admin.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {admin.email}
                  </TableCell>
                  <TableCell>
                    <Badge variant={roleColors[admin.role] ?? "outline"}>
                      {roleLabels[admin.role] ?? admin.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(admin.createdAt).toLocaleDateString("pt-BR")}
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
                          onClick={() => setAdminToChangeRole(admin.id)}
                        >
                          Alterar Função
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setAdminToDelete(admin.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="size-4 mr-2" />
                          Remover
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

      {/* Delete Confirmation */}
      <AlertDialog
        open={adminToDelete !== null}
        onOpenChange={(open) => !open && setAdminToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover administrador</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover este administrador? Ele perderá
              acesso ao painel administrativo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Change Role Dialog */}
      <ChangeRoleDialog
        adminId={adminToChangeRole}
        open={adminToChangeRole !== null}
        onOpenChange={(open) => !open && setAdminToChangeRole(null)}
      />

      {/* Add Admin Dialog */}
      <AddAdminDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      />
    </>
  );
}
