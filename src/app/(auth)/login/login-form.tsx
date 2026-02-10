"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Mail, Lock } from "lucide-react";

import { AuthCard } from "@/components/auth/auth-card";
import { SocialLoginButton } from "@/components/auth/social-login-button";
import { PasswordInput } from "@/components/forms/password-input";
import { FormError } from "@/components/forms/form-error";
import { Divider } from "@/components/ui/divider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/providers/auth-provider";
import { loginSchema, type LoginFormData } from "@/lib/validations/auth";
import type { ApiError } from "@/lib/api/client";

export function LoginForm() {
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const registered = searchParams.get("registered") === "true";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      await login(data.email, data.password);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.error ?? "Erro ao fazer login. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard
      title="Bem-vindo de volta"
      description="Entre com sua conta para continuar"
    >
      {registered && (
        <div
          className="mb-4 rounded-md bg-green-500/10 border border-green-500/20 p-3 text-sm text-green-500"
          role="alert"
        >
          Conta criada com sucesso! Faça login para continuar.
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              autoComplete="email"
              spellCheck={false}
              className="pl-10"
              {...register("email")}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
          </div>
          {errors.email && <FormError message={errors.email.message} />}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Senha</Label>
            <Link
              href="/forgot-password"
              className="text-sm text-primary hover:underline"
            >
              Esqueceu a senha?
            </Link>
          </div>
          <div className="relative">
            <Lock
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground z-10"
              aria-hidden="true"
            />
            <PasswordInput
              id="password"
              placeholder="••••••••"
              autoComplete="current-password"
              className="pl-10"
              {...register("password")}
              error={!!errors.password}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
            />
          </div>
          {errors.password && <FormError message={errors.password.message} />}
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox id="rememberMe" {...register("rememberMe")} />
          <Label htmlFor="rememberMe" className="text-sm font-normal">
            Lembrar de mim
          </Label>
        </div>

        {error && <FormError message={error} />}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Entrar
        </Button>

        <Divider text="ou" />

        <SocialLoginButton provider="google" isLoading={isLoading} />

        <p className="text-center text-sm text-muted-foreground">
          Não tem uma conta?{" "}
          <Link href="/register" className="text-primary hover:underline">
            Cadastre-se
          </Link>
        </p>
      </form>
    </AuthCard>
  );
}
