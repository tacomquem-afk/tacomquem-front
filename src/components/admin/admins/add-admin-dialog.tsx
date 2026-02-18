"use client";

import { Shield } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateAdmin } from "@/hooks/use-admin-admins";
import type { AddAdminFormData } from "@/lib/validations/admin";
import { addAdminSchema } from "@/lib/validations/admin";
import type { AdminRole } from "@/types";

const roles: Array<{ value: string; label: string }> = [
  { value: "ANALYST", label: "Analista" },
  { value: "SUPPORT", label: "Suporte" },
  { value: "MODERATOR", label: "Moderador" },
  { value: "SUPER_ADMIN", label: "Super Admin" },
];

type AddAdminDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function AddAdminDialog({ open, onOpenChange }: AddAdminDialogProps) {
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState<string>("");
  const [errors, setErrors] = useState<
    Partial<Record<keyof AddAdminFormData, string>>
  >({});

  const createAdmin = useCreateAdmin();

  const handleSubmit = async () => {
    // Reset errors
    setErrors({});

    // Validate
    const result = addAdminSchema.safeParse({ userId, role });
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof AddAdminFormData, string>> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof AddAdminFormData] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    try {
      await createAdmin.mutateAsync({
        userId,
        role: role as AdminRole,
      });
      toast.success("Administrador adicionado com sucesso");
      setUserId("");
      setRole("");
      onOpenChange(false);
    } catch {
      toast.error("Erro ao adicionar administrador");
    }
  };

  const handleClose = () => {
    setUserId("");
    setRole("");
    setErrors({});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="border-border-700">
        <DialogHeader>
          <DialogTitle>Adicionar Administrador</DialogTitle>
          <DialogDescription>
            Adicione um usuário existente como administrador.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="userId">ID do Usuário</Label>
            <Input
              id="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Cole o ID do usuário aqui"
              className="border-border-700"
            />
            {errors.userId && (
              <p className="text-sm text-destructive">{errors.userId}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Função</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="border-border-700" id="role">
                <SelectValue placeholder="Selecione uma função" />
              </SelectTrigger>
              <SelectContent className="border-border-700">
                {roles.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.role && (
              <p className="text-sm text-destructive">{errors.role}</p>
            )}
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={createAdmin.isPending}>
            <Shield className="size-4 mr-2" />
            Adicionar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
