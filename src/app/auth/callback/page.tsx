"use client";

import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

import { clearTokens, setTokens } from "@/lib/api/client";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      const accessToken = searchParams.get("accessToken");
      const refreshToken = searchParams.get("refreshToken");
      const error = searchParams.get("error");

      // Verificar se há erro na URL
      if (error) {
        const errorMessages: Record<string, string> = {
          oauth_denied: "Você cancelou a autorização com Google.",
          no_code: "Erro na comunicação com Google. Tente novamente.",
          oauth_failed: "Erro ao fazer login com Google. Tente novamente.",
          beta_not_available:
            "Desculpe, o acesso à plataforma é exclusivo para beta testers.",
        };

        setErrorMessage(errorMessages[error] ?? "Erro na autenticação.");
        setStatus("error");

        // Redirecionar para login após 3 segundos
        setTimeout(() => {
          router.push(`/login?error=${error}`);
        }, 3000);
        return;
      }

      // Verificar se temos os tokens
      if (!accessToken || !refreshToken) {
        setErrorMessage("Tokens não encontrados na resposta.");
        setStatus("error");

        // Redirecionar para login após 3 segundos
        setTimeout(() => {
          router.push("/login?error=missing_tokens");
        }, 3000);
        return;
      }

      try {
        // Salvar os tokens
        setTokens(accessToken, refreshToken);

        const termsAccepted = searchParams.get("termsAccepted") === "true";

        setStatus("success");

        // Se termos não aceitos (OAuth novo usuário), ir para tela de aceite
        if (!termsAccepted) {
          setTimeout(() => {
            router.push("/accept-terms");
          }, 500);
          return;
        }

        // Buscar a URL de retorno do sessionStorage (se existir)
        const returnUrl = sessionStorage.getItem("authReturnUrl");
        sessionStorage.removeItem("authReturnUrl");

        // Redirecionar para a URL de retorno ou dashboard
        setTimeout(() => {
          router.push(returnUrl ?? "/dashboard");
        }, 500);
      } catch (err) {
        console.error("Error handling callback:", err);
        clearTokens();
        setErrorMessage("Erro ao processar autenticação.");
        setStatus("error");

        setTimeout(() => {
          router.push("/login?error=oauth_failed");
        }, 3000);
      }
    };

    handleCallback();
  }, [searchParams, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4 text-center">
        {status === "loading" && (
          <>
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Autenticando...</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
            </div>
            <p className="text-muted-foreground">
              Login realizado com sucesso! Redirecionando...
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/20">
              <XCircle className="h-6 w-6 text-red-500" />
            </div>
            <p className="text-muted-foreground">{errorMessage}</p>
            <p className="text-sm text-muted-foreground">
              Você será redirecionado para a página de login...
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense>
      <AuthCallbackContent />
    </Suspense>
  );
}
