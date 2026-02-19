"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Loader2, Lock } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { AuthCard } from "@/components/auth/auth-card";
import { FormError } from "@/components/forms/form-error";
import { PasswordInput } from "@/components/forms/password-input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { resetPassword } from "@/lib/api/auth";
import type { ApiError } from "@/lib/api/client";
import {
  type ResetPasswordFormData,
  resetPasswordSchema,
} from "@/lib/validations/auth";

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  if (!token) {
    return (
      <AuthCard title="Link inválido">
        <div className="flex flex-col items-center gap-4 py-2 text-center">
          <AlertCircle className="h-12 w-12 text-destructive" aria-hidden="true" />
          <p className="text-sm text-muted-foreground">
            Este link de redefinição de senha é inválido ou expirou.
          </p>
        </div>
        <div className="mt-6">
          <Link
            href="/forgot-password"
            className="block text-center text-sm text-primary hover:underline"
          >
            Solicitar novo link
          </Link>
        </div>
      </AuthCard>
    );
  }

  if (success) {
    router.push("/login?passwordReset=true");
    return null;
  }

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      await resetPassword(token, data.password);
      setSuccess(true);
    } catch (err) {
      const apiError = err as ApiError;
      setError(
        apiError.error ?? "Erro ao redefinir a senha. Tente novamente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard
      title="Redefinir senha"
      description="Digite sua nova senha abaixo."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password">Nova senha</Label>
          <div className="relative">
            <Lock
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground z-10"
              aria-hidden="true"
            />
            <PasswordInput
              id="password"
              placeholder="••••••••"
              autoComplete="new-password"
              className="pl-10"
              {...register("password")}
              error={!!errors.password}
              aria-invalid={!!errors.password}
            />
          </div>
          {errors.password && <FormError message={errors.password.message} />}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
          <div className="relative">
            <Lock
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground z-10"
              aria-hidden="true"
            />
            <PasswordInput
              id="confirmPassword"
              placeholder="••••••••"
              autoComplete="new-password"
              className="pl-10"
              {...register("confirmPassword")}
              error={!!errors.confirmPassword}
              aria-invalid={!!errors.confirmPassword}
            />
          </div>
          {errors.confirmPassword && (
            <FormError message={errors.confirmPassword.message} />
          )}
        </div>

        {error && <FormError message={error} />}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Redefinir senha
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          <Link href="/login" className="text-primary hover:underline">
            Voltar para o login
          </Link>
        </p>
      </form>
    </AuthCard>
  );
}
