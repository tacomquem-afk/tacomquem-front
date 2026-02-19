"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { AuthCard } from "@/components/auth/auth-card";
import { BetaRejectionPanel } from "@/components/auth/beta-rejection-panel";
import { SocialLoginButton } from "@/components/auth/social-login-button";
import { FormError } from "@/components/forms/form-error";
import { PasswordInput } from "@/components/forms/password-input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Divider } from "@/components/ui/divider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type ApiError, api } from "@/lib/api/client";
import { type LoginFormData, loginSchema } from "@/lib/validations/auth";
import { useAuth } from "@/providers/auth-provider";
import type { PublicLoanInfo } from "@/types";

export function LoginForm() {
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isBetaRejected, setIsBetaRejected] = useState(false);

  const registered = searchParams.get("registered") === "true";
  const passwordReset = searchParams.get("passwordReset") === "true";
  const errorParam = searchParams.get("error");
  const nextParam = searchParams.get("next");
  const safeNextParam = nextParam?.startsWith("/") ? nextParam : null;
  const redirectTo = safeNextParam ?? "/dashboard";
  const registerHref = safeNextParam
    ? `/register?next=${encodeURIComponent(safeNextParam)}`
    : "/register";
  const confirmToken = useMemo(() => {
    if (!safeNextParam?.startsWith("/confirm-loan/")) return null;
    const token = safeNextParam.slice("/confirm-loan/".length).split("?")[0];
    return token || null;
  }, [safeNextParam]);
  const [publicLoanInfo, setPublicLoanInfo] = useState<PublicLoanInfo | null>(
    null
  );

  useEffect(() => {
    if (!confirmToken) {
      setPublicLoanInfo(null);
      return;
    }

    let cancelled = false;
    api
      .get<PublicLoanInfo>(`/api/links/${confirmToken}`, { skipAuth: true })
      .then((data) => {
        if (!cancelled) setPublicLoanInfo(data);
      })
      .catch(() => {
        if (!cancelled) setPublicLoanInfo(null);
      });

    return () => {
      cancelled = true;
    };
  }, [confirmToken]);

  useEffect(() => {
    const errorMessages: Record<string, string> = {
      oauth_denied: "Você cancelou a autorização com Google.",
      no_code: "Erro na comunicação com Google. Tente novamente.",
      oauth_failed: "Erro ao fazer login com Google. Tente novamente.",
      beta_not_available:
        "Desculpe, o acesso à plataforma é exclusivo para beta testers.",
      missing_tokens: "Erro na autenticação. Tente novamente.",
      session_expired: "Sua sessão expirou. Faça login novamente.",
    };

    if (errorParam && errorMessages[errorParam]) {
      if (errorParam === "beta_not_available") {
        setIsBetaRejected(true);
      } else {
        setError(errorMessages[errorParam]);
      }
    }
  }, [errorParam]);

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
    setIsBetaRejected(false);

    try {
      await login(data.email, data.password, redirectTo);
    } catch (err) {
      const apiError = err as ApiError;
      if (apiError.status === 403) {
        setIsBetaRejected(true);
      } else {
        setError(apiError.error ?? "Erro ao fazer login. Tente novamente.");
      }
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
      {passwordReset && (
        <div
          className="mb-4 rounded-md bg-green-500/10 border border-green-500/20 p-3 text-sm text-green-500"
          role="alert"
        >
          Senha redefinida com sucesso! Faça login com a nova senha.
        </div>
      )}
      {publicLoanInfo && (
        <div
          className="mb-4 rounded-md border border-primary/30 bg-primary/10 p-3 text-sm"
          role="note"
        >
          Você está entrando para confirmar o empréstimo de{" "}
          <strong>{publicLoanInfo.itemName}</strong> com{" "}
          <strong>{publicLoanInfo.lenderName}</strong>.
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

        {isBetaRejected ? (
          <BetaRejectionPanel />
        ) : (
          error && <FormError message={error} />
        )}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Entrar
        </Button>

        <Divider text="ou" />

        <SocialLoginButton provider="google" isLoading={isLoading} />

        <p className="text-center text-sm text-muted-foreground">
          Não tem uma conta?{" "}
          <Link href={registerHref} className="text-primary hover:underline">
            Cadastre-se
          </Link>
        </p>
      </form>
    </AuthCard>
  );
}
