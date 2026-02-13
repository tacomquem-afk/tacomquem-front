"use client";

import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { api } from "@/lib/api/client";
import { useAuth } from "@/providers/auth-provider";

type ConfirmLoanResponse = {
  message: string;
};

export default function ConfirmLoanPage() {
  const params = useParams<{ token: string }>();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const token = typeof params.token === "string" ? params.token : "";
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    if (!token || isLoading) return;

    if (!isAuthenticated) {
      router.replace(`/login?next=${encodeURIComponent(`/confirm-loan/${token}`)}`);
      return;
    }

    let cancelled = false;
    setStatus("loading");
    setMessage("");

    api
      .post<ConfirmLoanResponse>(`/api/links/${token}/confirm`)
      .then((data) => {
        if (cancelled) return;
        setStatus("success");
        setMessage(data.message || "Empréstimo confirmado com sucesso.");
      })
      .catch((err) => {
        if (cancelled) return;
        const detail =
          (err as { error?: string }).error ||
          "Não foi possível confirmar este empréstimo.";
        setStatus("error");
        setMessage(detail);
      });

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, isLoading, router, token]);

  const content = useMemo(() => {
    if (status === "loading" || status === "idle") {
      return (
        <>
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10">
            <Loader2 className="size-6 animate-spin text-primary" />
          </div>
          <h1 className="text-center text-2xl font-display font-bold">
            Confirmando empréstimo
          </h1>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Aguarde enquanto validamos seu link.
          </p>
        </>
      );
    }

    if (status === "success") {
      return (
        <>
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-green-500/10">
            <CheckCircle2 className="size-6 text-green-500" />
          </div>
          <h1 className="text-center text-2xl font-display font-bold">
            Empréstimo confirmado
          </h1>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            {message}
          </p>
          <Button asChild className="mt-6 w-full">
            <Link href="/dashboard">Ir para o dashboard</Link>
          </Button>
        </>
      );
    }

    return (
      <>
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-red-500/10">
          <XCircle className="size-6 text-red-500" />
        </div>
        <h1 className="text-center text-2xl font-display font-bold">
          Não foi possível confirmar
        </h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">{message}</p>
        <div className="mt-6 flex gap-2">
          <Button asChild className="w-full" variant="outline">
            <Link href="/dashboard">Voltar ao dashboard</Link>
          </Button>
        </div>
      </>
    );
  }, [message, status]);

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader />
        <CardContent>{content}</CardContent>
      </Card>
    </div>
  );
}
