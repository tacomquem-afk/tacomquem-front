"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  CalendarClock,
  ChevronDown,
  ChevronUp,
  Copy,
  Loader2,
  Mail,
  MessageCircle,
  NotebookPen,
  Package,
  Search,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { CreateItemDialog } from "@/components/dashboard/create-item-dialog";
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
import { useItems } from "@/hooks/use-items";
import { useCreateLoan, useLoans } from "@/hooks/use-loans";
import type { ApiError } from "@/lib/api/client";
import type { Item } from "@/types";
import {
  type CreateLoanFormData,
  createLoanSchema,
} from "@/lib/validations/loan";

type RegisterLoanDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type Step = 1 | 2 | 3;

export function RegisterLoanDialog({
  open,
  onOpenChange,
}: RegisterLoanDialogProps) {
  const [step, setStep] = useState<Step>(1);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [createItemOpen, setCreateItemOpen] = useState(false);
  const [showOptionalDetails, setShowOptionalDetails] = useState(false);

  const queryClient = useQueryClient();
  const { data: items = [] } = useItems();
  const { data: activeLoans } = useLoans("lent");
  const createLoan = useCreateLoan();

  // Filter available items (active and not lent)
  const availableItems = useMemo(() => {
    return items.filter(
      (item) =>
        item.isActive &&
        !activeLoans?.some(
          (l) => l.item.id === item.id && l.status !== "returned"
        )
    );
  }, [items, activeLoans]);

  // Filter items by search query
  const filteredItems = useMemo(() => {
    return availableItems.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [availableItems, searchQuery]);

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
    if (!shareUrl || !selectedItem) return "";
    const message = `Oi! Registrei o empréstimo de "${selectedItem.name}". Confirma aqui: ${shareUrl}`;
    return `https://wa.me/?text=${encodeURIComponent(message)}`;
  }, [shareUrl, selectedItem]);

  // Watch for new items and auto-select them
  useEffect(() => {
    const newItems = (queryClient.getQueryData(["items"]) as Item[]) || [];
    if (newItems.length > items.length) {
      const newItem = newItems.find(
        (item) => !items.some((existing) => existing.id === item.id)
      );
      if (newItem) {
        setSelectedItem(newItem);
        setStep(2);
      }
    }
  }, [queryClient, items]);

  const handleSelectItem = (item: Item) => {
    setSelectedItem(item);
    setStep(2);
  };

  const handleBackToItems = () => {
    setStep(1);
  };

  const handleOpenCreateItem = () => {
    setCreateItemOpen(true);
  };

  const onSubmit = async (data: CreateLoanFormData) => {
    if (!selectedItem) {
      setError("root", {
        message: "Selecione um item para criar o empréstimo.",
      });
      return;
    }

    try {
      const response = await createLoan.mutateAsync({
        itemId: selectedItem.id,
        borrowerEmail: data.borrowerEmail,
        expectedReturnDate: data.expectedReturnDate
          ? new Date(data.expectedReturnDate).toISOString()
          : undefined,
        lenderNotes: data.lenderNotes || undefined,
      });

      setShareUrl(response.confirmUrl);
      setStep(3);
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
      setStep(1);
      setSelectedItem(null);
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

  const handleNewLoan = () => {
    reset();
    setStep(1);
    setSelectedItem(null);
    setShareUrl(null);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md max-w-lg">
          {step === 1 && (
            <DialogHeader>
              <DialogTitle className="font-display">
                Registrar Empréstimo
              </DialogTitle>
              <DialogDescription>
                Selecione um item para emprestar ou cadastre um novo.
              </DialogDescription>
            </DialogHeader>
          )}

          {step === 2 && (
            <DialogHeader>
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleBackToItems}
                  className="h-8 w-8"
                >
                  <ArrowLeft className="size-4" />
                </Button>
                <div>
                  <DialogTitle className="font-display">
                    Dados do Empréstimo
                  </DialogTitle>
                  <DialogDescription>
                    Emprestar{" "}
                    <span className="font-medium text-foreground">
                      {selectedItem?.name}
                    </span>
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
          )}

          {step === 3 && (
            <DialogHeader>
              <DialogTitle className="font-display">
                Empréstimo Criado
              </DialogTitle>
              <DialogDescription>
                Empréstimo criado. Agora envie o link para quem vai confirmar.
              </DialogDescription>
            </DialogHeader>
          )}

          {step === 1 && (
            <div className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar itens..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Items list */}
              <div className="max-h-96 overflow-y-auto space-y-2">
                {filteredItems.length === 0 ? (
                  <div className="text-center py-8 space-y-4">
                    <Package className="size-12 text-muted-foreground mx-auto" />
                    <div>
                      <p className="font-medium">
                        {searchQuery
                          ? "Nenhum item encontrado"
                          : "Nenhum item disponível"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {searchQuery
                          ? "Tente uma busca diferente"
                          : "Cadastre um novo item para começar a emprestar"}
                      </p>
                    </div>
                    <Button onClick={handleOpenCreateItem}>
                      Cadastrar novo item
                    </Button>
                  </div>
                ) : (
                  <>
                    {filteredItems.map((item) => (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() => handleSelectItem(item)}
                        className="w-full flex items-center gap-3 p-3 rounded-lg border border-border-700 hover:border-primary hover:bg-primary/5 transition-colors text-left"
                      >
                        {item.images[0] ? (
                          <div className="relative h-12 w-12 rounded-md overflow-hidden shrink-0">
                            <Image
                              src={item.images[0]}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="h-12 w-12 rounded-md bg-surface-800 flex items-center justify-center shrink-0">
                            <Package className="size-6 text-muted-foreground" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{item.name}</p>
                          {item.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </button>
                    ))}
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handleOpenCreateItem}
                    >
                      <Package className="mr-2 size-4" />
                      Cadastrar novo item
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Selected item preview */}
              {selectedItem && (
                <div className="flex items-center gap-3 p-3 rounded-lg border border-border-700 bg-surface-900">
                  {selectedItem.images[0] ? (
                    <div className="relative h-16 w-16 rounded-md overflow-hidden shrink-0">
                      <Image
                        src={selectedItem.images[0]}
                        alt={selectedItem.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-16 w-16 rounded-md bg-surface-800 flex items-center justify-center shrink-0">
                      <Package className="size-8 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{selectedItem.name}</p>
                    {selectedItem.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {selectedItem.description}
                      </p>
                    )}
                  </div>
                </div>
              )}

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
                  onClick={handleBackToItems}
                  disabled={createLoan.isPending}
                >
                  Voltar
                </Button>
                <Button type="submit" disabled={createLoan.isPending}>
                  {createLoan.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Criar empréstimo
                </Button>
              </DialogFooter>
            </form>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="loan-share-url">Link de confirmação</Label>
                <Input id="loan-share-url" readOnly value={shareUrl ?? ""} />
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
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCopyLink}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copiar link
                </Button>
              </div>

              <DialogFooter>
                <Button type="button" variant="ghost" onClick={handleNewLoan}>
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

      <CreateItemDialog
        open={createItemOpen}
        onOpenChange={(open) => {
          setCreateItemOpen(open);
          if (!open) {
            // Keep the dialog open if we want to auto-select the new item
          }
        }}
      />
    </>
  );
}
