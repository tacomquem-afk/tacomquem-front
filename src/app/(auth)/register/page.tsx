import type { Metadata } from "next";
import { Suspense } from "react";
import { RegisterForm } from "./register-form";

export const metadata: Metadata = {
  title: "Criar Conta",
  description: "Crie sua conta TáComQuem e comece a gerenciar seus empréstimos",
};

export default function RegisterPage() {
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
