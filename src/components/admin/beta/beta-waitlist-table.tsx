"use client";

import {
  ArrowUpDown,
  CheckCircle2,
  Clock,
  UserPlus,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";
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
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAddBetaUser } from "@/hooks/use-admin-beta";
import { useAdminBetaWaitlist } from "@/hooks/use-admin-beta-waitlist";
import type { BetaWaitlistUser } from "@/types";

const LIMIT = 20;

type SortOrder = "asc" | "desc";

export function BetaWaitlistTable() {
  const [page, setPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [userToApprove, setUserToApprove] = useState<BetaWaitlistUser | null>(
    null
  );

  const { data, isLoading } = useAdminBetaWaitlist({
    page,
    limit: LIMIT,
    sortOrder,
  });
  const addBetaUser = useAddBetaUser();

  const users = data?.users ?? [];
  const pagination = data?.pagination;

  const filteredUsers = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    if (!normalizedSearch) return users;
    return users.filter((user) =>
      user.email.toLowerCase().includes(normalizedSearch)
    );
  }, [searchTerm, users]);

  const toggleSortOrder = () => {
    setSortOrder((order) => (order === "asc" ? "desc" : "asc"));
    setPage(1);
  };

  const handleApprove = async () => {
    if (!userToApprove) return;

    try {
      await addBetaUser.mutateAsync({ email: userToApprove.email });
      toast.success(`Usuario aprovado: ${userToApprove.email}`);
    } catch {
      toast.error("Erro ao aprovar usuario");
    } finally {
      setUserToApprove(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {["s1", "s2", "s3", "s4"].map((key) => (
          <div
            key={key}
            className="h-16 bg-surface-800 rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-lg font-semibold">Waitlist (Auto-cadastro)</h2>
          <p className="text-sm text-muted-foreground">
            {pagination?.total ?? 0} usuario
            {(pagination?.total ?? 0) !== 1 ? "s" : ""} aguardando aprovacao
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <Input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Buscar por email"
            className="w-64 border-border-700"
          />
          <p className="text-xs text-muted-foreground">
            Filtro aplicado apenas nesta pagina
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-border-700 bg-surface-900">
        <Table>
          <TableHeader>
            <TableRow className="border-border-700 hover:bg-surface-800">
              <TableHead>Usuario</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>E-mail verificado</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="-ml-3 h-8 gap-1 font-medium"
                  onClick={toggleSortOrder}
                >
                  Solicitado em
                  <ArrowUpDown className="size-3.5" />
                </Button>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-28" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-muted-foreground py-8"
                >
                  {searchTerm.trim()
                    ? "Nenhum resultado nesta pagina"
                    : "Nenhum usuario na waitlist"}
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow
                  key={user.id}
                  className="border-border-700 hover:bg-surface-800"
                >
                  <TableCell>
                    <span className="font-medium">{user.name || "-"}</span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {user.email}
                  </TableCell>
                  <TableCell>
                    {user.emailVerified ? (
                      <CheckCircle2 className="size-4 text-green-500" />
                    ) : (
                      <XCircle className="size-4 text-muted-foreground" />
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(user.betaWaitlistedAt).toLocaleDateString(
                      "pt-BR"
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1 w-fit"
                    >
                      <Clock className="size-3" />
                      Pendente
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      onClick={() => setUserToApprove(user)}
                      disabled={addBetaUser.isPending}
                    >
                      <UserPlus className="size-4 mr-2" />
                      Aprovar
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Pagina {page} de {pagination.totalPages} • {pagination.total} total
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
              Proxima
            </Button>
          </div>
        </div>
      )}

      <AlertDialog
        open={userToApprove !== null}
        onOpenChange={(open) => {
          if (!open) setUserToApprove(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Aprovar usuario na beta</AlertDialogTitle>
            <AlertDialogDescription>
              Ao aprovar, o usuario recebera acesso beta e podera fazer login.
              Deseja continuar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleApprove}
              disabled={addBetaUser.isPending}
            >
              Aprovar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
