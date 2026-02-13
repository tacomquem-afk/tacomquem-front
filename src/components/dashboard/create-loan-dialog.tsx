"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarClock, Loader2, Mail, NotebookPen } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { FormError } from "@/components/forms/form-error";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateLoan } from "@/hooks/use-loans";
import type { ApiError } from "@/lib/api/client";
import {
  type CreateLoanFormData,
  createLoanSchema,
} from "@/lib/validations/loan";
import type { Item } from "@/types";

type CreateLoanDialogProps = {
  item: Item;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CreateLoanDialog({
  item,
  open,
  onOpenChange,
}: CreateLoanDialogProps) {
  const createLoan = useCreateLoan();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<CreateLoanFormData>({
    resolver: zodResolver(createLoanSchema),
    defaultValues: {
      borrowerEmail: "",
      expectedReturnDate: "",
      lenderNotes: "",
    },
  });

  const onSubmit = async (data: CreateLoanFormData) => {
    try {
      const response = await createLoan.mutateAsync({
        itemId: item.id,
        borrowerEmail: data.borrowerEmail,
        expectedReturnDate: data.expectedReturnDate
          ? new Date(data.expectedReturnDate).toISOString()
          : undefined,
        lenderNotes: data.lenderNotes || undefined,
      });

      let copiedLink = false;
      try {
        await navigator.clipboard.writeText(response.confirmUrl);
        copiedLink = true;
      } catch {
        copiedLink = false;
      }

      if (copiedLink) {
        toast.success("Empréstimo criado! Link de confirmação copiado.");
      } else {
        toast.success("Empréstimo criado com sucesso!");
        toast.info(response.confirmUrl, {
          description: "Compartilhe este link para confirmar o empréstimo.",
        });
      }

      reset();
      onOpenChange(false);
    } catch (err) {
      const apiError = err as ApiError;
      setError("root", {
        message: apiError.error ?? "Erro ao criar empréstimo. Tente novamente.",
      });
    }
  };

  const handleOpenChange = (value: boolean) => {
    if (!value) {
      reset();
    }
    onOpenChange(value);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">Emprestar Item</DialogTitle>
          <DialogDescription>
            Registre um novo empréstimo para{" "}
            <span className="font-medium text-foreground">{item.name}</span>.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="borrower-email">Email de quem vai pegar</Label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                id="borrower-email"
                type="email"
                placeholder="amigo@email.com"
                className="pl-10"
                {...register("borrowerEmail")}
              />
            </div>
            {errors.borrowerEmail && (
              <FormError message={errors.borrowerEmail.message} />
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="expected-return-date">
              Data prevista de devolução{" "}
              <span className="text-muted-foreground font-normal">
                (opcional)
              </span>
            </Label>
            <div className="relative">
              <CalendarClock
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                id="expected-return-date"
                type="datetime-local"
                className="pl-10"
                {...register("expectedReturnDate")}
              />
            </div>
            {errors.expectedReturnDate && (
              <FormError message={errors.expectedReturnDate.message} />
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lender-notes">
              Observações{" "}
              <span className="text-muted-foreground font-normal">
                (opcional)
              </span>
            </Label>
            <div className="relative">
              <NotebookPen
                className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"
                aria-hidden="true"
              />
              <Textarea
                id="lender-notes"
                placeholder="Ex: deve devolver com bateria carregada."
                rows={3}
                className="pl-10"
                {...register("lenderNotes")}
              />
            </div>
            {errors.lenderNotes && <FormError message={errors.lenderNotes.message} />}
          </div>

          <FormError message={errors.root?.message} />

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={createLoan.isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={createLoan.isPending}>
              {createLoan.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Confirmar Empréstimo
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
