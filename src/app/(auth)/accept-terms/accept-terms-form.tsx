"use client";

import { Loader2, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { AuthCard } from "@/components/auth/auth-card";
import { FormError } from "@/components/forms/form-error";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { acceptTerms, getTerms } from "@/lib/api/auth";
import { clearTokens } from "@/lib/api/client";
import type { ApiError } from "@/lib/api/client";
import type { TermsInfo } from "@/types";

export function AcceptTermsForm() {
  const router = useRouter();
  const [terms, setTerms] = useState<TermsInfo | null>(null);
  const [accepted, setAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getTerms().then(setTerms).catch(() => {});
  }, []);

  const handleAccept = async () => {
    if (!accepted) return;
    setIsLoading(true);
    setError(null);
    try {
      await acceptTerms();
      router.push("/dashboard");
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.error ?? "Erro ao aceitar os termos. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDecline = () => {
    clearTokens();
    router.push("/login");
  };

  return (
    <AuthCard
      title="Termos de Uso atualizados"
      description="Para continuar usando o TáComQuem, aceite os termos abaixo"
    >
      <div className="space-y-6">
        <div className="flex items-start gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
          <p className="text-sm text-muted-foreground">
            Atualizamos nossos Termos de Uso e Política de Privacidade
            {terms?.version ? ` (versão ${terms.version})` : ""}. Por exigência
            da LGPD (Art. 8º), seu consentimento explícito é necessário para
            continuar.
          </p>
        </div>

        <div className="space-y-3 text-sm text-muted-foreground">
          <p>Ao aceitar, você concorda com:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <Link
                href={terms?.termsUrl ?? "/terms"}
                target="_blank"
                className="text-primary hover:underline"
              >
                Termos de Uso
              </Link>{" "}
              — regras de uso da plataforma
            </li>
            <li>
              <Link
                href={terms?.privacyUrl ?? "/privacy"}
                target="_blank"
                className="text-primary hover:underline"
              >
                Política de Privacidade
              </Link>{" "}
              — como seus dados são tratados (LGPD)
            </li>
          </ul>
        </div>

        <div className="flex items-start space-x-2">
          <Checkbox
            id="acceptTerms"
            checked={accepted}
            onCheckedChange={(v) => setAccepted(v === true)}
            className="mt-0.5"
          />
          <Label
            htmlFor="acceptTerms"
            className="cursor-pointer text-sm font-normal leading-snug"
          >
            Li e concordo com os{" "}
            <Link href={terms?.termsUrl ?? "/terms"} target="_blank" className="text-primary hover:underline">
              Termos de Uso
            </Link>{" "}
            e a{" "}
            <Link href={terms?.privacyUrl ?? "/privacy"} target="_blank" className="text-primary hover:underline">
              Política de Privacidade
            </Link>
          </Label>
        </div>

        {error && <FormError message={error} />}

        <div className="flex flex-col gap-2">
          <Button
            onClick={handleAccept}
            disabled={!accepted || isLoading}
            className="w-full"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Aceitar e continuar
          </Button>
          <Button
            variant="ghost"
            onClick={handleDecline}
            disabled={isLoading}
            className="w-full text-muted-foreground"
          >
            Recusar e sair
          </Button>
        </div>
      </div>
    </AuthCard>
  );
}
