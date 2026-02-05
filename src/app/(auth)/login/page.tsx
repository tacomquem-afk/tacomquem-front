import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Entrar",
  description: "Acesse sua conta TáComQuem",
};

export default function LoginPage() {
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
