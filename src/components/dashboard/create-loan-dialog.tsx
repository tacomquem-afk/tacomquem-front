"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  CalendarClock,
  ChevronDown,
  ChevronUp,
  Copy,
  Loader2,
  Mail,
  MessageCircle,
  NotebookPen,
} from "lucide-react";
import { useMemo, useState } from "react";
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
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [showOptionalDetails, setShowOptionalDetails] = useState(false);

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

  const whatsappShareUrl = useMemo(() => {
    if (!shareUrl) return "";
    const message = `Oi! Registrei o empréstimo de "${item.name}". Confirma aqui: ${shareUrl}`;
    return `https://wa.me/?text=${encodeURIComponent(message)}`;
  }, [item.name, shareUrl]);

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

      setShareUrl(response.confirmUrl);
      toast.success("Empréstimo criado com sucesso!");
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
      setShareUrl(null);
      setShowOptionalDetails(false);
    }
    onOpenChange(value);
  };

  const handleCopyLink = async () => {
    if (!shareUrl) return;

    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copiado para a área de transferência.");
    } catch {
      toast.error("Não foi possível copiar o link.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">Emprestar Item</DialogTitle>
          {!shareUrl ? (
            <DialogDescription>
              Registre um novo empréstimo para{" "}
              <span className="font-medium text-foreground">{item.name}</span>.
            </DialogDescription>
          ) : (
            <DialogDescription>
              Empréstimo criado. Agora envie o link para quem vai confirmar.
            </DialogDescription>
          )}
        </DialogHeader>

        {!shareUrl ? (
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

            <Button
              type="button"
              variant="ghost"
              className="w-full justify-between px-2"
              onClick={() => setShowOptionalDetails((prev) => !prev)}
            >
              <span className="text-sm text-muted-foreground">
                {showOptionalDetails
                  ? "Ocultar detalhes opcionais"
                  : "Adicionar detalhes opcionais"}
              </span>
              {showOptionalDetails ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>

            {showOptionalDetails && (
              <div className="space-y-4 rounded-md border p-3">
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
                  {errors.lenderNotes && (
                    <FormError message={errors.lenderNotes.message} />
                  )}
                </div>
              </div>
            )}

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
                Criar empréstimo
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="loan-share-url">Link de confirmação</Label>
              <Input id="loan-share-url" readOnly value={shareUrl} />
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <Button asChild>
                <a
                  href={whatsappShareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Compartilhar WhatsApp
                </a>
              </Button>
              <Button type="button" variant="outline" onClick={handleCopyLink}>
                <Copy className="mr-2 h-4 w-4" />
                Copiar link
              </Button>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setShareUrl(null);
                  reset();
                }}
              >
                Novo empréstimo
              </Button>
              <Button type="button" onClick={() => handleOpenChange(false)}>
                Fechar
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
