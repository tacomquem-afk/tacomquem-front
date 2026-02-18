import type { Metadata } from "next";
import { Suspense } from "react";

import { config } from "@/lib/config";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Entrar",
  description: "Acesse sua conta TáComQuem",
};

export default function LoginPage() {
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

  return (
    <Suspense fallback={<LoginFormSkeleton />}>
      <LoginForm />
    </Suspense>
  );
}

function LoginFormSkeleton() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        <div className="h-10 w-40 mx-auto bg-muted animate-pulse rounded" />
        <div className="h-96 bg-muted animate-pulse rounded-lg" />
      </div>
    </div>
  );
}
