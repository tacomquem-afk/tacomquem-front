"use client";

import { FlaskConical } from "lucide-react";
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
import { useAddBetaUser } from "@/hooks/use-admin-beta";
import type { AddBetaUserFormData } from "@/lib/validations/admin";
import { addBetaUserSchema } from "@/lib/validations/admin";

type AddBetaUserDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function AddBetaUserDialog({
  open,
  onOpenChange,
}: AddBetaUserDialogProps) {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<
    Partial<Record<keyof AddBetaUserFormData, string>>
  >({});

  const addBetaUser = useAddBetaUser();

  const handleSubmit = async () => {
    // Reset errors
    setErrors({});

    // Validate
    const result = addBetaUserSchema.safeParse({ email });
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof AddBetaUserFormData, string>> =
        {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof AddBetaUserFormData] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    try {
      await addBetaUser.mutateAsync({ email });
      toast.success("Usuário adicionado ao programa beta");
      setEmail("");
      onOpenChange(false);
    } catch {
      toast.error("Erro ao adicionar usuário ao programa beta");
    }
  };

  const handleClose = () => {
    setEmail("");
    setErrors({});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="border-border-700">
        <DialogHeader>
          <DialogTitle>Adicionar ao Programa Beta</DialogTitle>
          <DialogDescription>
            Adicione um usuário ao programa beta usando o email.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email do Usuário</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="usuario@exemplo.com"
              className="border-border-700"
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email}</p>
            )}
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={addBetaUser.isPending}>
            <FlaskConical className="size-4 mr-2" />
            Adicionar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
