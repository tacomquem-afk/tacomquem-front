"use client";

import {
  CheckCircle2,
  Clock,
  Mail,
  MoreHorizontal,
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
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
import {
  useAddBetaInvite,
  useAdminBetaInvites,
  useRemoveBetaInvite,
} from "@/hooks/use-admin-beta-invites";

const LIMIT = 20;

export function BetaInvitesList() {
  const [offset, setOffset] = useState(0);
  const [emailToRemove, setEmailToRemove] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newReason, setNewReason] = useState("");
  const [emailError, setEmailError] = useState("");

  const { data, isLoading } = useAdminBetaInvites({ limit: LIMIT, offset });
  const addInvite = useAddBetaInvite();
  const removeInvite = useRemoveBetaInvite();

  const invites = data?.invites ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / LIMIT);
  const currentPage = Math.floor(offset / LIMIT) + 1;

  const handleAddInvite = async () => {
    setEmailError("");

    if (!newEmail.trim()) {
      setEmailError("Email é obrigatório");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail.trim())) {
      setEmailError("Email inválido");
      return;
    }

    try {
      await addInvite.mutateAsync({
        email: newEmail.trim().toLowerCase(),
        ...(newReason.trim() ? { reason: newReason.trim() } : {}),
      });
      toast.success(`Convite enviado para ${newEmail.trim()}`);
      setNewEmail("");
      setNewReason("");
      setIsAddDialogOpen(false);
    } catch (err: unknown) {
      const status = (err as { status?: number })?.status;
      if (status === 409) {
        toast.error("Este email já está na whitelist");
      } else {
        toast.error("Erro ao adicionar convite");
      }
    }
  };

  const handleRemoveInvite = async () => {
    if (!emailToRemove) return;
    try {
      await removeInvite.mutateAsync(emailToRemove);
      toast.success(`Convite de ${emailToRemove} removido`);
    } catch {
      toast.error("Erro ao remover convite");
    } finally {
      setEmailToRemove(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {["s1", "s2", "s3"].map((k) => (
          <div
            key={k}
            className="h-14 bg-surface-800 rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold">Whitelist de Convites</h2>
          <p className="text-sm text-muted-foreground">
            {total} email{total !== 1 ? "s" : ""} na fila de acesso beta
          </p>
        </div>
        <Button size="sm" onClick={() => setIsAddDialogOpen(true)}>
          <Mail className="size-4 mr-2" />
          Adicionar Convite
        </Button>
      </div>

      <div className="rounded-lg border border-border-700 bg-surface-900">
        <Table>
          <TableHeader>
            <TableRow className="border-border-700 hover:bg-surface-800">
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Adicionado em</TableHead>
              <TableHead>Usado em</TableHead>
              <TableHead>Motivo</TableHead>
              <TableHead>Adicionado por</TableHead>
              <TableHead className="w-14" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {invites.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center text-muted-foreground py-8"
                >
                  Nenhum convite na whitelist
                </TableCell>
              </TableRow>
            ) : (
              invites.map((invite) => (
                <TableRow
                  key={invite.email}
                  className="border-border-700 hover:bg-surface-800"
                >
                  <TableCell className="font-medium">{invite.email}</TableCell>
                  <TableCell>
                    {invite.usedAt ? (
                      <Badge
                        variant="success"
                        className="flex items-center gap-1 w-fit"
                      >
                        <CheckCircle2 className="size-3" />
                        Usado
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1 w-fit"
                      >
                        <Clock className="size-3" />
                        Pendente
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(invite.addedAt).toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {invite.usedAt
                      ? new Date(invite.usedAt).toLocaleDateString("pt-BR")
                      : "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground max-w-48 truncate">
                    {invite.reason ?? "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {invite.addedBy.name}
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
                          onClick={() => setEmailToRemove(invite.email)}
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

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Página {currentPage} de {totalPages} • {total} total
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOffset((o) => Math.max(0, o - LIMIT))}
              disabled={offset === 0}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOffset((o) => o + LIMIT)}
              disabled={currentPage >= totalPages}
            >
              Próxima
            </Button>
          </div>
        </div>
      )}

      {/* Add Invite Dialog */}
      <Dialog
        open={isAddDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setNewEmail("");
            setNewReason("");
            setEmailError("");
          }
          setIsAddDialogOpen(open);
        }}
      >
        <DialogContent className="border-border-700">
          <DialogHeader>
            <DialogTitle>Adicionar Convite Beta</DialogTitle>
            <DialogDescription>
              Adicione um email à whitelist. Quando este usuário se cadastrar,
              receberá acesso beta automaticamente.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="invite-email">Email</Label>
              <Input
                id="invite-email"
                type="email"
                value={newEmail}
                onChange={(e) => {
                  setNewEmail(e.target.value);
                  setEmailError("");
                }}
                placeholder="usuario@exemplo.com"
                className="border-border-700"
              />
              {emailError && (
                <p className="text-sm text-destructive">{emailError}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="invite-reason">Motivo (opcional)</Label>
              <Textarea
                id="invite-reason"
                value={newReason}
                onChange={(e) => setNewReason(e.target.value)}
                placeholder="Ex: QA Engineer, UX Designer, Tester..."
                className="border-border-700 resize-none"
                rows={3}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsAddDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleAddInvite} disabled={addInvite.isPending}>
              <Mail className="size-4 mr-2" />
              Adicionar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Remove Confirmation */}
      <AlertDialog
        open={emailToRemove !== null}
        onOpenChange={(open) => {
          if (!open) setEmailToRemove(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover convite</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover o convite de{" "}
              <strong>{emailToRemove}</strong> da whitelist? Isso apenas impede
              novos cadastros — usuários já com acesso beta não são afetados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveInvite}
              disabled={removeInvite.isPending}
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
