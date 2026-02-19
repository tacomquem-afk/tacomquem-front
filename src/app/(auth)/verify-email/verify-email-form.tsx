"use client";

import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { AuthCard } from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";
import { verifyEmail } from "@/lib/api/auth";
import type { ApiError } from "@/lib/api/client";

export function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const verifyEmailToken = async () => {
      if (!token) {
        setError("Token não fornecido.");
        setIsLoading(false);
        return;
      }

      try {
        await verifyEmail(token);
        setSuccess(true);
      } catch (err) {
        const apiError = err as ApiError;
        setError(
          apiError.error ?? "Erro ao verificar email. O token pode ter expirado."
        );
      } finally {
        setIsLoading(false);
      }
    };

    verifyEmailToken();
  }, [token]);

  if (isLoading) {
    return (
      <AuthCard title="Verificando email...">
        <div className="flex flex-col items-center justify-center gap-4 py-8">
          <Loader2 className="h-12 w-12 animate-spin text-primary" aria-hidden="true" />
          <p className="text-sm text-muted-foreground">
            Aguarde enquanto verificamos seu email...
          </p>
        </div>
      </AuthCard>
    );
  }

  if (success) {
    return (
      <AuthCard title="Email verificado!">
        <div className="flex flex-col items-center gap-4 py-2 text-center">
          <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-500" aria-hidden="true" />
          <p className="text-sm text-muted-foreground">
            Seu email foi verificado com sucesso. Você já pode fazer login na sua conta.
          </p>
        </div>
        <div className="mt-6">
          <Link href="/login" className="block">
            <Button className="w-full">
              Ir para o login
            </Button>
          </Link>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Erro na verificação">
      <div className="flex flex-col items-center gap-4 py-2 text-center">
        <AlertCircle className="h-12 w-12 text-destructive" aria-hidden="true" />
        <p className="text-sm text-muted-foreground">
          {error || "Este link de verificação é inválido ou expirou."}
        </p>
      </div>
      <div className="mt-6 space-y-3">
        <Link href="/login" className="block">
          <Button variant="outline" className="w-full">
            Voltar para o login
          </Button>
        </Link>
        <Link
          href="/register"
          className="block text-center text-sm text-primary hover:underline"
        >
          Criar uma nova conta
        </Link>
      </div>
    </AuthCard>
  );
}
