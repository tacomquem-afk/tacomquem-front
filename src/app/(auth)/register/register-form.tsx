"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Lock, Mail, User } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { AuthCard } from "@/components/auth/auth-card";
import { SocialLoginButton } from "@/components/auth/social-login-button";
import { FormError } from "@/components/forms/form-error";
import { PasswordInput } from "@/components/forms/password-input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Divider } from "@/components/ui/divider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type ApiError, api } from "@/lib/api/client";
import { type RegisterFormData, registerSchema } from "@/lib/validations/auth";
import { useAuth } from "@/providers/auth-provider";
import type { PublicLoanInfo } from "@/types";

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register: registerUser, isAuthenticated, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const nextParam = searchParams.get("next");
  const safeNextParam = nextParam?.startsWith("/") ? nextParam : null;
  const loginHref = safeNextParam
    ? `/login?next=${encodeURIComponent(safeNextParam)}`
    : "/login";
  const confirmToken = useMemo(() => {
    if (!safeNextParam?.startsWith("/confirm-loan/")) return null;
    const token = safeNextParam.slice("/confirm-loan/".length).split("?")[0];
    return token || null;
  }, [safeNextParam]);
  const [publicLoanInfo, setPublicLoanInfo] = useState<PublicLoanInfo | null>(
    null
  );

  // Redirect authenticated users away from register page
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push(safeNextParam ?? "/dashboard");
    }
  }, [authLoading, isAuthenticated, safeNextParam, router]);

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
    const errorParam = searchParams.get("error");
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
      setError(errorMessages[errorParam]);
    }
  }, [searchParams]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      acceptTerms: undefined,
    },
  });

  const password = watch("password");

  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { level: 0, label: "", color: "" };

    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[^a-zA-Z0-9]/.test(pwd)) score++;

    if (score <= 2) return { level: 25, label: "Fraca", color: "bg-red-500" };
    if (score === 3)
      return { level: 50, label: "Média", color: "bg-yellow-500" };
    if (score === 4)
      return { level: 75, label: "Forte", color: "bg-green-500" };
    return { level: 100, label: "Excelente", color: "bg-green-600" };
  };

  const passwordStrength = getPasswordStrength(password);

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      await registerUser(data.name, data.email, data.password);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.error ?? "Erro ao criar conta. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard
      title="Criar sua conta"
      description="Comece a gerenciar seus empréstimos"
    >
      {publicLoanInfo && (
        <div
          className="mb-4 rounded-md border border-primary/30 bg-primary/10 p-3 text-sm"
          role="note"
        >
          Você está criando conta para confirmar o empréstimo de{" "}
          <strong>{publicLoanInfo.itemName}</strong> com{" "}
          <strong>{publicLoanInfo.lenderName}</strong>.
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome</Label>
          <div className="relative">
            <User
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              id="name"
              type="text"
              placeholder="Seu nome"
              autoComplete="name"
              className="pl-10"
              {...register("name")}
              aria-invalid={!!errors.name}
            />
          </div>
          {errors.name && <FormError message={errors.name.message} />}
        </div>

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
            />
          </div>
          {errors.email && <FormError message={errors.email.message} />}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Senha</Label>
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
          {password && (
            <div className="space-y-1">
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                  style={{ width: `${passwordStrength.level}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Força da senha: {passwordStrength.label}
              </p>
            </div>
          )}
          {errors.password && <FormError message={errors.password.message} />}
        </div>

        <div className="space-y-1">
          <div className="flex items-start space-x-2">
            <Checkbox
              id="acceptTerms"
              onCheckedChange={(checked) =>
                setValue("acceptTerms", checked === true ? true : (undefined as unknown as true), {
                  shouldValidate: true,
                })
              }
              className="mt-0.5"
            />
            <Label
              htmlFor="acceptTerms"
              className="text-sm font-normal leading-snug cursor-pointer"
            >
              Li e concordo com os{" "}
              <Link href="/terms" target="_blank" className="text-primary hover:underline">
                Termos de Uso
              </Link>{" "}
              e a{" "}
              <Link href="/privacy" target="_blank" className="text-primary hover:underline">
                Política de Privacidade
              </Link>
            </Label>
          </div>
          {errors.acceptTerms && (
            <FormError message={errors.acceptTerms.message} />
          )}
        </div>

        {error && <FormError message={error} />}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Criar conta
        </Button>

        <Divider text="ou" />

        <SocialLoginButton provider="google" isLoading={isLoading} />

        <p className="text-center text-sm text-muted-foreground">
          Já tem uma conta?{" "}
          <Link href={loginHref} className="text-primary hover:underline">
            Entrar
          </Link>
        </p>
      </form>
    </AuthCard>
  );
}
