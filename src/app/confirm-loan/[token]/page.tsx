"use client";

import { useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { api } from "@/lib/api/client";
import { useAuth } from "@/providers/auth-provider";
import type { Loan } from "@/types";

type ConfirmLoanResponse = {
  message: string;
  loan: Loan;
};

type PublicLoanInfo = {
  itemName: string;
  itemImages: string[];
  lenderName: string;
};

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

  useEffect(() => {
    if (!token) return;

    let cancelled = false;
    api
      .get<PublicLoanInfo>(`/api/links/${token}`, { skipAuth: true })
      .then((data) => {
        if (!cancelled) setPublicInfo(data);
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
  const itemImage = loan?.item.images[0] ?? publicInfo?.itemImages?.[0];
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
  const expectedReturnDate = loan?.expectedReturnDate
    ? new Date(loan.expectedReturnDate).toLocaleString("pt-BR")
    : null;

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
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-3 pb-0">
          <div className="rounded-lg border bg-muted/30 p-3">
            <div className="flex gap-3">
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md border bg-muted">
                {itemImage ? (
                  // biome-ignore lint/performance/noImgElement: dynamic external images and graceful fallback
                  <img
                    src={itemImage}
                    alt={itemName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                    Sem imagem
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground">
                  Item sendo confirmado
                </p>
                <p className="truncate font-semibold">{itemName}</p>
                {lenderName && (
                  <p className="text-sm text-muted-foreground">
                    Emprestado por {lenderName}
                  </p>
                )}
              </div>
            </div>

            {(statusLabel || expectedReturnDate || loan?.lenderNotes) && (
              <div className="mt-3 space-y-1 text-sm">
                {statusLabel && (
                  <p>
                    <span className="text-muted-foreground">Status:</span>{" "}
                    {statusLabel}
                  </p>
                )}
                {expectedReturnDate && (
                  <p>
                    <span className="text-muted-foreground">
                      Devolução prevista:
                    </span>{" "}
                    {expectedReturnDate}
                  </p>
                )}
                {loan?.lenderNotes && (
                  <p>
                    <span className="text-muted-foreground">Observações:</span>{" "}
                    {loan.lenderNotes}
                  </p>
                )}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-6">{content}</CardContent>
      </Card>
    </div>
  );
}
