"use client";

import { Clock } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { AuthCard } from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";

function WaitingListContent() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name");

  return (
    <AuthCard
      title="Você está na lista de espera!"
      description="Sua conta foi criada com sucesso"
    >
      <div className="space-y-6 text-center">
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Clock className="h-8 w-8 text-primary" aria-hidden="true" />
          </div>
        </div>

        <div className="space-y-2 text-sm text-muted-foreground">
          {name && (
            <p>
              Olá, <strong className="text-foreground">{name}</strong>!
            </p>
          )}
          <p>
            O Tá Com Quem está em fase de beta fechado. Você foi adicionado à
            lista de espera e será avisado assim que seu acesso for liberado.
          </p>
          <p>Fique de olho no seu e-mail!</p>
        </div>

        <Button asChild variant="outline" className="w-full">
          <Link href="/login">Voltar ao login</Link>
        </Button>
      </div>
    </AuthCard>
  );
}

export default function WaitingListPage() {
  return (
    <Suspense>
      <WaitingListContent />
    </Suspense>
  );
}
