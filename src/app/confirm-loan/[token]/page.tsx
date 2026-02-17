"use client";

import { useQueryClient } from "@tanstack/react-query";
import {
  CalendarClock,
  CheckCircle2,
  FileText,
  ImageIcon,
  Loader2,
  UserRound,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { api } from "@/lib/api/client";
import { useAuth } from "@/providers/auth-provider";
import type { Loan, PublicLoanInfo } from "@/types";

type ConfirmLoanResponse = {
  message: string;
  loan: Loan;
};

function asNonEmptyString(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((entry): entry is string => typeof entry === "string");
}

function normalizePublicLoanInfo(payload: unknown): PublicLoanInfo | null {
  if (!payload || typeof payload !== "object") return null;

  const data = payload as Record<string, unknown>;
  const itemName = asNonEmptyString(data.itemName ?? data.item_name);
  const lenderName = asNonEmptyString(data.lenderName ?? data.lender_name);
  const itemImages = asStringArray(data.itemImages ?? data.item_images);

  if (!itemName || !lenderName) return null;

  return {
    itemName,
    itemImages,
    lenderName,
    expectedReturnDate: asNonEmptyString(
      data.expectedReturnDate ?? data.expected_return_date
    ),
    lenderNotes: asNonEmptyString(data.lenderNotes ?? data.lender_notes),
  };
}

function formatDateTime(value: string | null | undefined): string | null {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toLocaleString("pt-BR");
}

export default function ConfirmLoanPage() {
  const params = useParams<{ token: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isAuthenticated, isLoading } = useAuth();
  const token = typeof params.token === "string" ? params.token : "";
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState<string>("");
  const [loan, setLoan] = useState<Loan | null>(null);
  const [publicInfo, setPublicInfo] = useState<PublicLoanInfo | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    if (!token) return;

    let cancelled = false;
    api
      .get<unknown>(`/api/links/${token}`, { skipAuth: true })
      .then((data) => {
        if (!cancelled) setPublicInfo(normalizePublicLoanInfo(data));
      })
      .catch(() => {
        if (!cancelled) setPublicInfo(null);
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  useEffect(() => {
    if (!token || isLoading) return;

    if (!isAuthenticated) {
      router.replace(
        `/login?next=${encodeURIComponent(`/confirm-loan/${token}`)}`
      );
    }
  }, [isAuthenticated, isLoading, router, token]);

  const handleConfirmLoan = async () => {
    if (!token || !isAuthenticated || status === "loading") return;

    setStatus("loading");
    setMessage("");

    try {
      const data = await api.post<ConfirmLoanResponse>(
        `/api/links/${token}/confirm`
      );
      queryClient.invalidateQueries({ queryKey: ["loans"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      setLoan(data.loan);
      setStatus("success");
      setMessage(data.message || "Empréstimo confirmado com sucesso.");
    } catch (err) {
      const detail =
        (err as { error?: string }).error ||
        "Não foi possível confirmar este empréstimo.";
      setStatus("error");
      setMessage(detail);
    }
  };

  const itemName = loan?.item.name ?? publicInfo?.itemName ?? "Item";
  const itemImages = loan?.item.images ?? publicInfo?.itemImages ?? [];
  const itemImage = itemImages[selectedImageIndex] ?? itemImages[0];
  const lenderName = loan?.lender.name ?? publicInfo?.lenderName;
  const statusLabel =
    loan?.status === "confirmed"
      ? "Confirmado"
      : loan?.status === "pending"
        ? "Pendente"
        : loan?.status === "returned"
          ? "Devolvido"
          : loan?.status === "cancelled"
            ? "Cancelado"
            : null;
  const expectedReturnDate = formatDateTime(
    loan?.expectedReturnDate ?? publicInfo?.expectedReturnDate
  );
  const lenderNotes = loan?.lenderNotes ?? publicInfo?.lenderNotes;

  let content: ReactNode;

  if (isLoading || (!isAuthenticated && status === "idle")) {
    content = (
      <>
        <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-primary/10">
          <Loader2 className="size-6 animate-spin text-primary" />
        </div>
        <h1 className="text-center text-xl font-display font-bold">
          Carregando confirmação
        </h1>
        <p className="mt-1 text-center text-sm text-muted-foreground">
          Aguarde enquanto validamos seu acesso.
        </p>
      </>
    );
  } else if (status === "loading") {
    content = (
      <>
        <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-primary/10">
          <Loader2 className="size-6 animate-spin text-primary" />
        </div>
        <h1 className="text-center text-xl font-display font-bold">
          Confirmando empréstimo
        </h1>
        <p className="mt-1 text-center text-sm text-muted-foreground">
          Estamos registrando que você recebeu este item.
        </p>
      </>
    );
  } else if (status === "idle") {
    content = (
      <>
        <h1 className="text-center text-xl font-display font-bold">
          Confirmar recebimento
        </h1>
        <p className="mt-1 text-center text-sm text-muted-foreground">
          Confirme para registrar que você pegou este item emprestado.
        </p>
        <Button className="mt-6 w-full" onClick={handleConfirmLoan}>
          Confirmar que peguei
        </Button>
      </>
    );
  } else if (status === "success") {
    content = (
      <>
        <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-green-500/10">
          <CheckCircle2 className="size-6 text-green-500" />
        </div>
        <h1 className="text-center text-xl font-display font-bold">
          Empréstimo confirmado
        </h1>
        <p className="mt-1 text-center text-sm text-muted-foreground">
          {message}
        </p>
        <Button asChild className="mt-6 w-full">
          <Link href="/dashboard">Ir para o dashboard</Link>
        </Button>
      </>
    );
  } else {
    content = (
      <>
        <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-red-500/10">
          <XCircle className="size-6 text-red-500" />
        </div>
        <h1 className="text-center text-xl font-display font-bold">
          Não foi possível confirmar
        </h1>
        <p className="mt-1 text-center text-sm text-muted-foreground">
          {message}
        </p>
        <Button className="mt-6 w-full" onClick={handleConfirmLoan}>
          Tentar novamente
        </Button>
      </>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,rgba(71,85,105,0.12),transparent_55%)] p-4 sm:p-6">
      <Card className="w-full max-w-4xl overflow-hidden">
        <CardHeader className="pb-0">
          <div className="grid gap-5 rounded-lg border bg-muted/20 p-3 sm:p-4 md:grid-cols-[1.1fr_1fr]">
            <div className="space-y-3">
              <div className="aspect-[4/3] w-full overflow-hidden rounded-md border bg-muted">
                {itemImage ? (
                  <img
                    src={itemImage}
                    alt={itemName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-xs text-muted-foreground">
                    <ImageIcon className="size-6" />
                    Sem imagem disponível
                  </div>
                )}
              </div>

              {itemImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {itemImages.map((image, index) => (
                    <button
                      key={image}
                      type="button"
                      className={`h-16 w-16 shrink-0 overflow-hidden rounded-md border transition ${
                        index === selectedImageIndex
                          ? "border-primary ring-2 ring-primary/30"
                          : "border-border/80 hover:border-primary/50"
                      }`}
                      onClick={() => setSelectedImageIndex(index)}
                      aria-label={`Visualizar imagem ${index + 1} de ${itemImages.length}`}
                    >
                      <img
                        src={image}
                        alt={`${itemName} - imagem ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="min-w-0 space-y-3">
              <div className="rounded-md border bg-background/80 p-3">
                <p className="text-xs text-muted-foreground">Item emprestado</p>
                <h1 className="mt-0.5 line-clamp-2 text-lg font-display font-bold sm:text-xl">
                  {itemName}
                </h1>
                {lenderName && (
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <UserRound className="size-3.5" />
                    Emprestado por {lenderName}
                  </p>
                )}
              </div>

              <div className="rounded-md border bg-background/60 p-3 text-sm">
                <h2 className="mb-2 font-medium">Detalhes do empréstimo</h2>
                <div className="space-y-1.5 text-muted-foreground">
                  {statusLabel && (
                    <p>
                      <span className="font-medium text-foreground">
                        Status:
                      </span>{" "}
                      {statusLabel}
                    </p>
                  )}
                  <p className="flex items-start gap-1.5">
                    <CalendarClock className="mt-0.5 size-3.5 shrink-0" />
                    <span>
                      <span className="font-medium text-foreground">
                        Devolução prevista:
                      </span>{" "}
                      {expectedReturnDate ?? "Não informado"}
                    </span>
                  </p>
                  <p className="flex items-start gap-1.5">
                    <FileText className="mt-0.5 size-3.5 shrink-0" />
                    <span>
                      <span className="font-medium text-foreground">
                        Observações:
                      </span>{" "}
                      {lenderNotes ?? "Não informado"}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">{content}</CardContent>
      </Card>
    </div>
  );
}
