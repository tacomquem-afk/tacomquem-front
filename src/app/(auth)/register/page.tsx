import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { config } from "@/lib/config";
import { RegisterForm } from "./register-form";

export const metadata: Metadata = {
  title: "Criar Conta",
  description: "Crie sua conta TáComQuem e comece a gerenciar seus empréstimos",
};

export default function RegisterPage() {
  if (!config.authEnabled) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="w-full max-w-md text-center space-y-4">
          <h1 className="text-2xl font-bold">Autenticação Desabilitada</h1>
          <p className="text-muted-foreground">
            O login e cadastro ainda não estão disponíveis nesta versão.
            Voltamos em breve.
          </p>
        </div>
      </div>
    );
  }

  if (config.betaModeEnabled) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="w-full max-w-md text-center space-y-4">
          <h1 className="text-2xl font-bold">Acesso Beta Privado</h1>
          <p className="text-muted-foreground">
            O cadastro está disponível apenas por convite durante o beta. Em
            breve abriremos para todos!
          </p>
          <p>
            <Link
              href="/login"
              className="text-sm text-primary hover:underline"
            >
              Já tenho um convite
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={<RegisterFormSkeleton />}>
      <RegisterForm />
    </Suspense>
  );
}

function RegisterFormSkeleton() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        <div className="h-10 w-40 mx-auto bg-muted animate-pulse rounded" />
        <div className="h-[500px] bg-muted animate-pulse rounded-lg" />
      </div>
    </div>
  );
}
