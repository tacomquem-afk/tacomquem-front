"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FormError } from "@/components/forms/form-error";
import { PasswordInput } from "@/components/forms/password-input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { deleteAccount } from "@/lib/api/auth";
import {
  type DeleteAccountFormData,
  deleteAccountSchema,
} from "@/lib/validations/auth";

type DeleteAccountDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
};

export function DeleteAccountDialog({
  open,
  onOpenChange,
  onSuccess,
}: DeleteAccountDialogProps) {
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DeleteAccountFormData>({
    resolver: zodResolver(deleteAccountSchema),
    defaultValues: { password: "" },
  });

  const onSubmit = async (data: DeleteAccountFormData) => {
    setServerError(null);
    try {
      await deleteAccount(data.password);
      reset();
      onSuccess();
    } catch (err) {
      const apiError = err as { error?: string; status?: number };
      if (apiError.status === 409) {
        setServerError(
          "Você possui empréstimos ativos. Finalize-os antes de excluir sua conta."
        );
      } else {
        setServerError(
          apiError.error ?? "Erro ao excluir conta. Tente novamente."
        );
      }
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      reset();
      setServerError(null);
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Excluir conta</DialogTitle>
          <DialogDescription>
            Esta ação é irreversível. Seus dados pessoais serão anonimizados
            conforme a LGPD. Digite sua senha para confirmar.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="delete-password">Senha</Label>
            <PasswordInput
              id="delete-password"
              placeholder="Digite sua senha"
              error={!!errors.password}
              {...register("password")}
            />
            {errors.password && <FormError message={errors.password.message} />}
          </div>

          {serverError && <FormError message={serverError} />}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="destructive" disabled={isSubmitting}>
              {isSubmitting ? "Excluindo..." : "Excluir minha conta"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
