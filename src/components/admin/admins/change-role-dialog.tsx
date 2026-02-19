"use client";

import { Shield } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAdminAccounts, useUpdateAdminRole } from "@/hooks/use-admin-admins";
import type { AdminRole } from "@/types";

const roles: Array<{ value: string; label: string }> = [
  { value: "ANALYST", label: "Analista" },
  { value: "SUPPORT", label: "Suporte" },
  { value: "MODERATOR", label: "Moderador" },
  { value: "SUPER_ADMIN", label: "Super Admin" },
];

type ChangeRoleDialogProps = {
  adminId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ChangeRoleDialog({
  adminId,
  open,
  onOpenChange,
}: ChangeRoleDialogProps) {
  const [selectedRole, setSelectedRole] = useState<string>("");

  const { data } = useAdminAccounts();
  const updateRole = useUpdateAdminRole();

  const admin = data?.find((a) => a.id === adminId);

  useEffect(() => {
    if (admin) {
      setSelectedRole(admin.role);
    }
  }, [admin]);

  const handleSubmit = async () => {
    if (!adminId || !selectedRole) return;

    try {
      await updateRole.mutateAsync({
        id: adminId,
        input: { role: selectedRole as AdminRole },
      });
      toast.success("Função atualizada com sucesso");
      onOpenChange(false);
    } catch {
      toast.error("Erro ao atualizar função");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-border-700">
        <DialogHeader>
          <DialogTitle>Alterar Função</DialogTitle>
          <DialogDescription>
            Altere a função administrativa de {admin?.name}.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="role">Nova Função</Label>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="border-border-700" id="role">
                <SelectValue placeholder="Selecione uma função" />
              </SelectTrigger>
              <SelectContent className="border-border-700">
                {roles.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={updateRole.isPending}>
            <Shield className="size-4 mr-2" />
            Salvar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
