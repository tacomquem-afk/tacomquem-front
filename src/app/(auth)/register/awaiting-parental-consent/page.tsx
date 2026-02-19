"use client";

import { MailCheck } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { AuthCard } from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";

function AwaitingParentalConsentContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  return (
    <AuthCard
      title="Aguardando autorização"
      description="Um e-mail foi enviado ao responsável legal"
    >
      <div className="space-y-6 text-center">
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <MailCheck className="h-8 w-8 text-primary" aria-hidden="true" />
          </div>
        </div>

        <div className="space-y-2 text-sm text-muted-foreground">
          <p>
            Como você tem menos de 12 anos, enviamos um e-mail de autorização
            para o responsável legal
            {email && (
              <>
                {" "}em <strong className="text-foreground">{email}</strong>
              </>
            )}
            .
          </p>
          <p>
            O acesso à conta só será liberado após a confirmação do responsável
            legal pelo link enviado no e-mail.
          </p>
        </div>

        <Button asChild variant="outline" className="w-full">
          <Link href="/login">Voltar ao login</Link>
        </Button>
      </div>
    </AuthCard>
  );
}

export default function AwaitingParentalConsentPage() {
  return (
    <Suspense>
      <AwaitingParentalConsentContent />
    </Suspense>
  );
}
