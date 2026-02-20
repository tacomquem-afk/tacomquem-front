"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  CalendarClock,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Copy,
  Loader2,
  Mail,
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
          <div className="space-y-5">
            <div className="flex flex-col items-center gap-3 py-1 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                <CheckCircle2 className="h-7 w-7 text-green-600 dark:text-green-500" />
              </div>
              <p className="text-sm text-muted-foreground">
                Compartilhe o link com quem vai confirmar o empréstimo de{" "}
                <span className="font-medium text-foreground">{item.name}</span>
                .
              </p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="loan-share-url">Link de confirmação</Label>
              <div className="flex gap-2">
                <Input
                  id="loan-share-url"
                  readOnly
                  value={shareUrl}
                  className="truncate font-mono text-xs"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleCopyLink}
                  className="shrink-0"
                  title="Copiar link"
                >
                  <Copy className="h-4 w-4" />
                  <span className="sr-only">Copiar link</span>
                </Button>
              </div>
            </div>

            <Button
              asChild
              className="w-full bg-[#25D366] text-white hover:bg-[#1da851] focus-visible:ring-[#25D366]"
            >
              <a
                href={whatsappShareUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  className="mr-2 h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Compartilhar no WhatsApp
              </a>
            </Button>

            <DialogFooter className="sm:justify-between">
              <Button
                type="button"
                variant="ghost"
                className="text-muted-foreground"
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
