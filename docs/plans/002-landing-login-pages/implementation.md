# TáComQuem Frontend — Plano de Implementação: Landing & Login

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implementar Landing Page, Login e Registro seguindo Web Interface Guidelines e mockups de referência.

**Architecture:** Next.js App Router com Server Components. Formulários com React Hook Form + Zod. Autenticação via AuthProvider existente.

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS, shadcn/ui, React Hook Form, Zod, Lucide React

**Referências de Documentação:**
- [Design Document](./design.md)
- [Web Interface Guidelines](https://github.com/vercel-labs/web-interface-guidelines)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev)

---

## Fase 1: Componentes Base

### Task 1.1: Criar componente Logo

**Files:**
- Create: `src/components/shared/logo.tsx`

**Step 1: Criar src/components/shared/logo.tsx**

```typescript
import Link from "next/link";

type LogoProps = {
  size?: "sm" | "md" | "lg";
  linkToHome?: boolean;
};

const sizeClasses = {
  sm: "h-6 w-6",
  md: "h-8 w-8",
  lg: "h-10 w-10",
};

const textSizeClasses = {
  sm: "text-lg",
  md: "text-xl",
  lg: "text-2xl",
};

export function Logo({ size = "md", linkToHome = true }: LogoProps) {
  const content = (
    <div className="flex items-center gap-2">
      <div
        className={`${sizeClasses[size]} bg-primary rounded-lg flex items-center justify-center`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5 text-primary-foreground"
          aria-hidden="true"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      </div>
      <span
        className={`font-heading font-bold text-foreground ${textSizeClasses[size]}`}
      >
        TáComQuem
      </span>
    </div>
  );

  if (linkToHome) {
    return (
      <Link href="/" className="hover:opacity-90 transition-opacity">
        {content}
      </Link>
    );
  }

  return content;
}
```

**Step 2: Commit**

```bash
git add src/components/shared/logo.tsx
git commit -m "feat: add logo component"
```

---

### Task 1.2: Criar componente Divider

**Files:**
- Create: `src/components/ui/divider.tsx`

**Step 1: Criar src/components/ui/divider.tsx**

```typescript
type DividerProps = {
  text?: string;
};

export function Divider({ text }: DividerProps) {
  if (!text) {
    return <hr className="border-border" />;
  }

  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t border-border" />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-card px-2 text-muted-foreground">{text}</span>
      </div>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/ui/divider.tsx
git commit -m "feat: add divider component"
```

---

### Task 1.3: Criar componente PasswordInput

**Files:**
- Create: `src/components/forms/password-input.tsx`

**Step 1: Criar src/components/forms/password-input.tsx**

```typescript
"use client";

import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface PasswordInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  error?: boolean;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, error, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          className={cn("pr-10", error && "border-destructive", className)}
          ref={ref}
          {...props}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          ) : (
            <Eye className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          )}
        </Button>
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";
```

**Step 2: Commit**

```bash
git add src/components/forms/password-input.tsx
git commit -m "feat: add password input with visibility toggle"
```

---

### Task 1.4: Criar componente AuthCard

**Files:**
- Create: `src/components/auth/auth-card.tsx`

**Step 1: Criar src/components/auth/auth-card.tsx**

```typescript
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Logo } from "@/components/shared/logo";
import { cn } from "@/lib/utils";

type AuthCardProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
};

export function AuthCard({
  title,
  description,
  children,
  className,
}: AuthCardProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="mb-8">
        <Logo size="lg" />
      </div>

      <Card className={cn("w-full max-w-md", className)}>
        <CardHeader className="space-y-1 text-center">
          <h1 className="font-heading text-2xl font-bold tracking-tight text-balance">
            {title}
          </h1>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/auth/auth-card.tsx
git commit -m "feat: add auth card wrapper component"
```

---

### Task 1.5: Criar componente SocialLoginButton

**Files:**
- Create: `src/components/auth/social-login-button.tsx`

**Step 1: Criar src/components/auth/social-login-button.tsx**

```typescript
"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Provider = "google";

type SocialLoginButtonProps = {
  provider: Provider;
  isLoading?: boolean;
  className?: string;
};

const providerConfig = {
  google: {
    label: "Continuar com Google",
    icon: (
      <svg
        className="h-5 w-5"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          fill="#4285F4"
        />
        <path
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          fill="#34A853"
        />
        <path
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          fill="#FBBC05"
        />
        <path
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          fill="#EA4335"
        />
      </svg>
    ),
  },
};

export function SocialLoginButton({
  provider,
  isLoading,
  className,
}: SocialLoginButtonProps) {
  const config = providerConfig[provider];

  const handleClick = () => {
    // TODO: Implementar OAuth flow
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5173";
    window.location.href = `${apiUrl}/api/auth/google`;
  };

  return (
    <Button
      type="button"
      variant="outline"
      className={cn("w-full gap-2", className)}
      onClick={handleClick}
      disabled={isLoading}
    >
      {config.icon}
      {config.label}
    </Button>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/auth/social-login-button.tsx
git commit -m "feat: add social login button component"
```

---

### Task 1.6: Criar componente FormError

**Files:**
- Create: `src/components/forms/form-error.tsx`

**Step 1: Criar src/components/forms/form-error.tsx**

```typescript
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type FormErrorProps = {
  message?: string;
  className?: string;
};

export function FormError({ message, className }: FormErrorProps) {
  if (!message) return null;

  return (
    <div
      className={cn(
        "flex items-center gap-2 text-sm text-destructive",
        className
      )}
      role="alert"
      aria-live="polite"
    >
      <AlertCircle className="h-4 w-4" aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/forms/form-error.tsx
git commit -m "feat: add form error component"
```

---

## Fase 2: Schemas de Validação

### Task 2.1: Criar schemas Zod para autenticação

**Files:**
- Create: `src/lib/validations/auth.ts`

**Step 1: Criar src/lib/validations/auth.ts**

```typescript
import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email é obrigatório")
    .email("Email inválido"),
  password: z
    .string()
    .min(1, "Senha é obrigatória")
    .min(8, "Senha deve ter no mínimo 8 caracteres"),
  rememberMe: z.boolean().optional(),
});

export const registerSchema = z.object({
  name: z
    .string()
    .min(1, "Nome é obrigatório")
    .min(2, "Nome deve ter no mínimo 2 caracteres"),
  email: z
    .string()
    .min(1, "Email é obrigatório")
    .email("Email inválido"),
  password: z
    .string()
    .min(1, "Senha é obrigatória")
    .min(8, "Senha deve ter no mínimo 8 caracteres")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Senha deve conter letra maiúscula, minúscula e número"
    ),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
```

**Step 2: Instalar dependência se necessário**

```bash
bun add @hookform/resolvers
```

**Step 3: Commit**

```bash
git add src/lib/validations/auth.ts package.json bun.lockb
git commit -m "feat: add zod schemas for auth forms"
```

---

## Fase 3: Página de Login

### Task 3.1: Criar layout de autenticação

**Files:**
- Create: `src/app/(auth)/layout.tsx`

**Step 1: Criar src/app/(auth)/layout.tsx**

```typescript
import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Pular para o conteúdo
      </a>
      <main id="main-content">{children}</main>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add src/app/\(auth\)/layout.tsx
git commit -m "feat: add auth layout with skip link"
```

---

### Task 3.2: Criar página de login

**Files:**
- Create: `src/app/(auth)/login/page.tsx`

**Step 1: Criar src/app/(auth)/login/page.tsx**

```typescript
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
```

**Step 2: Commit**

```bash
git add src/app/\(auth\)/login/page.tsx
git commit -m "feat: add login page with suspense"
```

---

### Task 3.3: Criar formulário de login

**Files:**
- Create: `src/app/(auth)/login/login-form.tsx`

**Step 1: Criar src/app/(auth)/login/login-form.tsx**

```typescript
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
          {errors.email && (
            <FormError message={errors.email.message} />
          )}
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
          {errors.password && (
            <FormError message={errors.password.message} />
          )}
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
```

**Step 2: Instalar Checkbox do shadcn se necessário**

```bash
bunx shadcn@latest add checkbox
```

**Step 3: Commit**

```bash
git add src/app/\(auth\)/login/login-form.tsx src/components/ui/checkbox.tsx
git commit -m "feat: add login form with validation"
```

---

## Fase 4: Página de Registro

### Task 4.1: Criar página de registro

**Files:**
- Create: `src/app/(auth)/register/page.tsx`

**Step 1: Criar src/app/(auth)/register/page.tsx**

```typescript
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
```

**Step 2: Commit**

```bash
git add src/app/\(auth\)/register/page.tsx
git commit -m "feat: add register page with suspense"
```

---

### Task 4.2: Criar formulário de registro

**Files:**
- Create: `src/app/(auth)/register/register-form.tsx`

**Step 1: Criar src/app/(auth)/register/register-form.tsx**

```typescript
"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Mail, Lock, User } from "lucide-react";

import { AuthCard } from "@/components/auth/auth-card";
import { SocialLoginButton } from "@/components/auth/social-login-button";
import { PasswordInput } from "@/components/forms/password-input";
import { FormError } from "@/components/forms/form-error";
import { Divider } from "@/components/ui/divider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/providers/auth-provider";
import { registerSchema, type RegisterFormData } from "@/lib/validations/auth";
import type { ApiError } from "@/lib/api/client";

export function RegisterForm() {
  const { register: registerUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
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
    if (score === 3) return { level: 50, label: "Média", color: "bg-yellow-500" };
    if (score === 4) return { level: 75, label: "Forte", color: "bg-green-500" };
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

        {error && <FormError message={error} />}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Criar conta
        </Button>

        <Divider text="ou" />

        <SocialLoginButton provider="google" isLoading={isLoading} />

        <p className="text-center text-sm text-muted-foreground">
          Já tem uma conta?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Entrar
          </Link>
        </p>
      </form>

      <p className="mt-4 text-center text-xs text-muted-foreground">
        Ao criar conta, você concorda com os{" "}
        <Link href="/terms" className="underline hover:text-foreground">
          Termos de Uso
        </Link>
      </p>
    </AuthCard>
  );
}
```

**Step 2: Commit**

```bash
git add src/app/\(auth\)/register/register-form.tsx
git commit -m "feat: add register form with password strength"
```

---

## Fase 5: Landing Page

### Task 5.1: Criar componentes da Landing Page

**Files:**
- Create: `src/components/landing/hero-section.tsx`
- Create: `src/components/landing/feature-card.tsx`
- Create: `src/components/landing/header.tsx`
- Create: `src/components/landing/footer.tsx`

**Step 1: Criar src/components/landing/header.tsx**

```typescript
import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Logo />
        <nav className="flex items-center gap-4">
          <Button asChild variant="ghost" size="sm">
            <Link href="/login">Entrar</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/register">Começar grátis</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
```

**Step 2: Criar src/components/landing/hero-section.tsx**

```typescript
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="container flex flex-col items-center justify-center gap-8 py-24 text-center md:py-32">
      <div className="space-y-4 max-w-3xl">
        <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl text-balance">
          Nunca mais esqueça quem está com suas coisas
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl">
          Gerencie empréstimos entre amigos de forma simples e organizada.
          Saiba exatamente quem pegou o quê e quando.
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <Button asChild size="lg" className="gap-2">
          <Link href="/register">
            Começar grátis
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="#como-funciona">Saiba mais</Link>
        </Button>
      </div>
    </section>
  );
}
```

**Step 3: Criar src/components/landing/feature-card.tsx**

```typescript
import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type FeatureCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <Card className="relative overflow-hidden border-border/50 bg-card/50 backdrop-blur transition-colors hover:border-border hover:bg-card/80">
      <CardHeader>
        <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
```

**Step 4: Criar src/components/landing/footer.tsx**

```typescript
import { Logo } from "@/components/shared/logo";

export function LandingFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <Logo size="sm" />
        <p className="text-sm text-muted-foreground">
          © {currentYear} TáComQuem. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
```

**Step 5: Commit**

```bash
git add src/components/landing/
git commit -m "feat: add landing page components"
```

---

### Task 5.2: Atualizar página inicial

**Files:**
- Modify: `src/app/page.tsx`

**Step 1: Atualizar src/app/page.tsx**

```typescript
import Link from "next/link";
import { Camera, Link2, CheckCircle, History, Bell, Users } from "lucide-react";

import { LandingHeader } from "@/components/landing/header";
import { HeroSection } from "@/components/landing/hero-section";
import { FeatureCard } from "@/components/landing/feature-card";
import { LandingFooter } from "@/components/landing/footer";
import { Button } from "@/components/ui/button";

const howItWorks = [
  {
    icon: Camera,
    title: "Registre o item",
    description:
      "Cadastre seus itens com foto e nome. Mantenha um inventário do que você empresta.",
  },
  {
    icon: Link2,
    title: "Compartilhe o link",
    description:
      "Envie um link para quem pegou emprestado. Eles confirmam o recebimento.",
  },
  {
    icon: CheckCircle,
    title: "Confirme a devolução",
    description:
      "Acompanhe o status de cada empréstimo e marque quando o item voltar.",
  },
];

const features = [
  {
    icon: History,
    title: "Histórico completo",
    description:
      "Veja todo o histórico de empréstimos de cada item. Nunca perca informações.",
  },
  {
    icon: Bell,
    title: "Lembretes automáticos",
    description:
      "Receba notificações quando um empréstimo estiver perto do prazo.",
  },
  {
    icon: Users,
    title: "Compartilhe com amigos",
    description:
      "Seus amigos não precisam criar conta para confirmar empréstimos.",
  },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Pular para o conteúdo
      </a>

      <LandingHeader />

      <main id="main-content" className="flex-1">
        <HeroSection />

        {/* How it works */}
        <section
          id="como-funciona"
          className="container py-16 md:py-24"
          aria-labelledby="how-it-works-title"
        >
          <div className="mx-auto max-w-2xl text-center">
            <h2
              id="how-it-works-title"
              className="font-heading text-3xl font-bold tracking-tight text-balance"
            >
              Como funciona
            </h2>
            <p className="mt-4 text-muted-foreground">
              Três passos simples para organizar seus empréstimos
            </p>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {howItWorks.map((item, index) => (
              <FeatureCard
                key={index}
                icon={item.icon}
                title={item.title}
                description={item.description}
              />
            ))}
          </div>
        </section>

        {/* Features */}
        <section
          className="border-t border-border/40 bg-muted/30 py-16 md:py-24"
          aria-labelledby="features-title"
        >
          <div className="container">
            <div className="mx-auto max-w-2xl text-center">
              <h2
                id="features-title"
                className="font-heading text-3xl font-bold tracking-tight text-balance"
              >
                Tudo que você precisa
              </h2>
              <p className="mt-4 text-muted-foreground">
                Recursos pensados para facilitar sua vida
              </p>
            </div>

            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((item, index) => (
                <FeatureCard
                  key={index}
                  icon={item.icon}
                  title={item.title}
                  description={item.description}
                />
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="container py-16 md:py-24">
          <div className="mx-auto max-w-2xl rounded-2xl bg-primary/5 border border-primary/10 p-8 text-center md:p-12">
            <h2 className="font-heading text-2xl font-bold tracking-tight md:text-3xl text-balance">
              Pronto para organizar seus empréstimos?
            </h2>
            <p className="mt-4 text-muted-foreground">
              Crie sua conta gratuitamente e comece agora mesmo.
            </p>
            <Button asChild size="lg" className="mt-6">
              <Link href="/register">Criar conta grátis</Link>
            </Button>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: redesign landing page with features"
```

---

## Fase 6: Acessibilidade e Polish

### Task 6.1: Adicionar suporte a reduced motion

**Files:**
- Modify: `src/app/globals.css`

**Step 1: Adicionar media query ao globals.css**

Adicionar ao final do arquivo:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

**Step 2: Commit**

```bash
git add src/app/globals.css
git commit -m "a11y: add reduced motion support"
```

---

### Task 6.2: Adicionar color-scheme ao layout

**Files:**
- Modify: `src/app/layout.tsx`

**Step 1: Adicionar style no html tag**

Atualizar a tag `<html>` para incluir:

```typescript
<html
  lang="pt-BR"
  className={`${inter.variable} ${notoSans.variable}`}
  style={{ colorScheme: "dark" }}
  suppressHydrationWarning
>
```

**Step 2: Commit**

```bash
git add src/app/layout.tsx
git commit -m "a11y: add color-scheme dark to html"
```

---

## Fase 7: Testes

### Task 7.1: Adicionar testes para páginas de auth

**Files:**
- Create: `tests/e2e/login.spec.ts`
- Create: `tests/e2e/register.spec.ts`
- Create: `tests/e2e/landing.spec.ts`

**Step 1: Criar tests/e2e/login.spec.ts**

```typescript
import { test, expect } from "@playwright/test";

test.describe("Login Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
  });

  test("should display login form", async ({ page }) => {
    await expect(page.locator("h1")).toContainText("Bem-vindo");
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test("should have proper labels for accessibility", async ({ page }) => {
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');

    await expect(emailInput).toHaveAttribute("id", "email");
    await expect(passwordInput).toHaveAttribute("id", "password");
  });

  test("should show validation errors for empty form", async ({ page }) => {
    await page.click('button[type="submit"]');
    await expect(page.locator("text=Email é obrigatório")).toBeVisible();
  });

  test("should have link to register page", async ({ page }) => {
    const registerLink = page.locator('a[href="/register"]');
    await expect(registerLink).toBeVisible();
    await registerLink.click();
    expect(page.url()).toContain("/register");
  });

  test("should have Google login button", async ({ page }) => {
    await expect(page.locator("text=Continuar com Google")).toBeVisible();
  });

  test("should have password visibility toggle", async ({ page }) => {
    const toggleButton = page.locator('button[aria-label*="senha"]');
    await expect(toggleButton).toBeVisible();
  });
});
```

**Step 2: Criar tests/e2e/register.spec.ts**

```typescript
import { test, expect } from "@playwright/test";

test.describe("Register Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/register");
  });

  test("should display registration form", async ({ page }) => {
    await expect(page.locator("h1")).toContainText("Criar sua conta");
    await expect(page.locator('input[autocomplete="name"]')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test("should show password strength indicator", async ({ page }) => {
    const passwordInput = page.locator('input[type="password"]');
    await passwordInput.fill("weak");
    await expect(page.locator("text=Fraca")).toBeVisible();

    await passwordInput.fill("StrongPass123!");
    await expect(page.locator("text=Forte")).toBeVisible();
  });

  test("should have link to login page", async ({ page }) => {
    const loginLink = page.locator('a[href="/login"]');
    await expect(loginLink).toBeVisible();
    await loginLink.click();
    expect(page.url()).toContain("/login");
  });

  test("should show terms link", async ({ page }) => {
    await expect(page.locator("text=Termos de Uso")).toBeVisible();
  });
});
```

**Step 3: Criar tests/e2e/landing.spec.ts**

```typescript
import { test, expect } from "@playwright/test";

test.describe("Landing Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should display hero section", async ({ page }) => {
    await expect(
      page.locator("text=Nunca mais esqueça quem está com suas coisas")
    ).toBeVisible();
  });

  test("should have working CTA buttons", async ({ page }) => {
    const startButton = page.locator('a[href="/register"]').first();
    await expect(startButton).toBeVisible();
    await startButton.click();
    expect(page.url()).toContain("/register");
  });

  test("should have how it works section", async ({ page }) => {
    await expect(page.locator("text=Como funciona")).toBeVisible();
    await expect(page.locator("text=Registre o item")).toBeVisible();
    await expect(page.locator("text=Compartilhe o link")).toBeVisible();
    await expect(page.locator("text=Confirme a devolução")).toBeVisible();
  });

  test("should have features section", async ({ page }) => {
    await expect(page.locator("text=Tudo que você precisa")).toBeVisible();
  });

  test("should have skip link for accessibility", async ({ page }) => {
    const skipLink = page.locator("text=Pular para o conteúdo");
    await skipLink.focus();
    await expect(skipLink).toBeVisible();
  });

  test("should have footer with copyright", async ({ page }) => {
    await expect(page.locator("text=TáComQuem. Todos os direitos")).toBeVisible();
  });
});
```

**Step 4: Commit**

```bash
git add tests/e2e/login.spec.ts tests/e2e/register.spec.ts tests/e2e/landing.spec.ts
git commit -m "test: add e2e tests for landing, login and register"
```

---

## Fase 8: Verificação Final

### Task 8.1: Executar lint e build

**Step 1: Executar lint**

```bash
bun run lint
```

Corrigir quaisquer erros.

**Step 2: Executar build**

```bash
bun run build
```

Deve completar sem erros.

**Step 3: Executar testes**

```bash
bun run test:e2e
```

Todos os testes devem passar.

---

### Task 8.2: Verificação visual

**Step 1: Iniciar dev server**

```bash
bun run dev
```

**Step 2: Verificar páginas**

- [ ] Landing Page (`/`): Layout correto, CTAs funcionando
- [ ] Login (`/login`): Formulário centralizado, validação funcionando
- [ ] Register (`/register`): Força de senha, validação funcionando
- [ ] Responsividade: Testar em mobile (< 640px)
- [ ] Dark mode: Cores corretas aplicadas
- [ ] Acessibilidade: Tab navigation, focus states visíveis

**Step 3: Commit final**

```bash
git add .
git commit -m "feat: complete landing and auth pages implementation"
```

---

## Resumo de Arquivos

| Arquivo | Descrição |
|---------|-----------|
| `src/components/shared/logo.tsx` | Logo com link |
| `src/components/ui/divider.tsx` | Divider com texto |
| `src/components/forms/password-input.tsx` | Input com toggle |
| `src/components/forms/form-error.tsx` | Mensagem de erro |
| `src/components/auth/auth-card.tsx` | Card wrapper auth |
| `src/components/auth/social-login-button.tsx` | Botão OAuth |
| `src/components/landing/header.tsx` | Header landing |
| `src/components/landing/hero-section.tsx` | Hero section |
| `src/components/landing/feature-card.tsx` | Card de feature |
| `src/components/landing/footer.tsx` | Footer landing |
| `src/lib/validations/auth.ts` | Schemas Zod |
| `src/app/(auth)/layout.tsx` | Layout auth |
| `src/app/(auth)/login/page.tsx` | Página login |
| `src/app/(auth)/login/login-form.tsx` | Formulário login |
| `src/app/(auth)/register/page.tsx` | Página registro |
| `src/app/(auth)/register/register-form.tsx` | Formulário registro |
| `src/app/page.tsx` | Landing page |
| `tests/e2e/login.spec.ts` | Testes login |
| `tests/e2e/register.spec.ts` | Testes registro |
| `tests/e2e/landing.spec.ts` | Testes landing |

---

## Próximos Passos

Após completar esta implementação:

1. **003-forgot-password** - Página de recuperação de senha
2. **004-email-verification** - Fluxo de verificação de email
3. **005-oauth-callback** - Handler de callback OAuth
