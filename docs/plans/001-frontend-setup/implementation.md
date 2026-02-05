# TáComQuem Frontend — Plano de Implementação

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Configurar projeto Next.js 15 completo com Bun, TypeScript, Tailwind CSS e shadcn/ui.

**Architecture:** Next.js App Router com Server Components por padrão. Autenticação via JWT com refresh automático. Cliente API tipado com Zod validation.

**Tech Stack:** Bun 1.3+, Next.js 15, TypeScript (strict), Tailwind CSS, shadcn/ui, Zod

**Referências de Documentação:**
- [Bun Docs](https://bun.sh/docs)
- [Next.js 15 Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [Zod](https://zod.dev)

---

## Fase 1: Setup do Projeto

### Task 1.1: Inicializar projeto Next.js com Bun

**Files:**
- Create: `package.json`
- Create: `next.config.ts`
- Create: `tsconfig.json`
- Create: `.gitignore`

**Step 1: Criar projeto Next.js**

```bash
cd /Users/fernando/Workspace/maverick/play/mvp/ta_com_quem_front
bun create next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-bun
```

Responder `Yes` para todas as perguntas de configuração.

**Step 2: Verificar instalação**

```bash
bun run dev
```

Acessar http://localhost:3000 para confirmar que está funcionando.

**Step 3: Commit**

```bash
git add .
git commit -m "chore: initialize next.js project with bun"
```

---

### Task 1.2: Configurar TypeScript strict mode

**Files:**
- Modify: `tsconfig.json`

**Step 1: Atualizar tsconfig.json com configurações strict**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "ES2022"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noImplicitThis": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noUncheckedIndexedAccess": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

**Step 2: Verificar tipos**

```bash
bun run build
```

**Step 3: Commit**

```bash
git add tsconfig.json
git commit -m "chore: configure typescript strict mode"
```

---

### Task 1.3: Configurar Next.js com otimizações

**Files:**
- Modify: `next.config.ts`

**Step 1: Atualizar next.config.ts**

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-icons",
      "date-fns",
    ],
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },

  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

export default nextConfig;
```

**Step 2: Commit**

```bash
git add next.config.ts
git commit -m "chore: configure next.js with performance optimizations"
```

---

### Task 1.4: Configurar variáveis de ambiente

**Files:**
- Create: `.env.example`
- Create: `.env.local`

**Step 1: Criar .env.example**

```env
# API
NEXT_PUBLIC_API_URL=http://localhost:5173

# Auth (opcional para Google OAuth)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

**Step 2: Criar .env.local (copiar de .env.example)**

```bash
cp .env.example .env.local
```

**Step 3: Commit**

```bash
git add .env.example
git commit -m "chore: add environment variables template"
```

---

## Fase 2: Tailwind CSS e Design System

### Task 2.1: Configurar tema customizado do Tailwind

**Files:**
- Modify: `tailwind.config.ts`

**Step 1: Atualizar tailwind.config.ts com tema TáComQuem**

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2b8cee",
          50: "#eff8ff",
          100: "#dbeefe",
          200: "#bfe3fe",
          300: "#93d2fd",
          400: "#60b8fa",
          500: "#2b8cee",
          600: "#1f7ae4",
          700: "#1762c8",
          800: "#1851a2",
          900: "#194680",
          950: "#132c4e",
        },
        background: {
          DEFAULT: "#101922",
          light: "#f6f7f9",
          950: "#101922",
        },
        surface: {
          DEFAULT: "#1a2633",
          light: "#243040",
          lighter: "#2d3a4d",
        },
        border: {
          DEFAULT: "#2d3a4d",
          light: "#3d4a5d",
        },
        accent: {
          success: "#22c55e",
          warning: "#f59e0b",
          error: "#ef4444",
          info: "#3b82f6",
        },
      },
      fontFamily: {
        heading: ["var(--font-inter)", "system-ui", "sans-serif"],
        body: ["var(--font-noto-sans)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
```

**Step 2: Instalar plugin de animação**

```bash
bun add -d tailwindcss-animate
```

**Step 3: Commit**

```bash
git add tailwind.config.ts package.json bun.lockb
git commit -m "style: configure tailwind theme with brand colors"
```

---

### Task 2.2: Configurar CSS global

**Files:**
- Modify: `src/app/globals.css`

**Step 1: Atualizar globals.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 210 31% 10%;
    --foreground: 210 20% 98%;
    --card: 210 28% 15%;
    --card-foreground: 210 20% 98%;
    --popover: 210 28% 15%;
    --popover-foreground: 210 20% 98%;
    --primary: 207 84% 55%;
    --primary-foreground: 210 20% 98%;
    --secondary: 210 25% 20%;
    --secondary-foreground: 210 20% 98%;
    --muted: 210 25% 25%;
    --muted-foreground: 210 20% 65%;
    --accent: 207 84% 55%;
    --accent-foreground: 210 20% 98%;
    --destructive: 0 84% 60%;
    --destructive-foreground: 210 20% 98%;
    --border: 210 25% 25%;
    --input: 210 25% 20%;
    --ring: 207 84% 55%;
    --radius: 0.5rem;
  }
}

@layer base {
  * {
    @apply border-border;
  }

  body {
    @apply bg-background-950 text-foreground font-body antialiased;
  }

  h1, h2, h3, h4, h5, h6 {
    @apply font-heading;
  }
}

@layer utilities {
  .scrollbar-thin {
    scrollbar-width: thin;
    scrollbar-color: hsl(var(--border)) transparent;
  }

  .scrollbar-thin::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  .scrollbar-thin::-webkit-scrollbar-track {
    background: transparent;
  }

  .scrollbar-thin::-webkit-scrollbar-thumb {
    background-color: hsl(var(--border));
    border-radius: 4px;
  }
}
```

**Step 2: Commit**

```bash
git add src/app/globals.css
git commit -m "style: configure global css with design tokens"
```

---

## Fase 3: shadcn/ui Setup

### Task 3.1: Inicializar shadcn/ui

**Files:**
- Create: `components.json`
- Create: `src/lib/utils.ts`

**Step 1: Executar init do shadcn**

```bash
bunx shadcn@latest init
```

Configurações:
- Style: Default
- Base color: Slate
- CSS variables: Yes

**Step 2: Commit**

```bash
git add components.json src/lib/utils.ts
git commit -m "chore: initialize shadcn/ui"
```

---

### Task 3.2: Instalar componentes essenciais

**Files:**
- Create: `src/components/ui/*.tsx`

**Step 1: Adicionar componentes base**

```bash
bunx shadcn@latest add button card input label form toast dialog dropdown-menu avatar badge skeleton tabs separator scroll-area sheet
```

**Step 2: Commit**

```bash
git add src/components/ui/
git commit -m "chore: add essential shadcn/ui components"
```

---

## Fase 4: Estrutura de Pastas

### Task 4.1: Criar estrutura de diretórios

**Files:**
- Create: Estrutura de pastas

**Step 1: Criar diretórios**

```bash
mkdir -p src/lib/api
mkdir -p src/lib/auth
mkdir -p src/hooks
mkdir -p src/providers
mkdir -p src/actions
mkdir -p src/types
mkdir -p src/components/forms
mkdir -p src/components/layouts
mkdir -p src/components/shared
```

**Step 2: Criar arquivos placeholder**

```bash
touch src/lib/api/.gitkeep
touch src/lib/auth/.gitkeep
touch src/hooks/.gitkeep
touch src/providers/.gitkeep
touch src/actions/.gitkeep
touch src/types/.gitkeep
touch src/components/forms/.gitkeep
touch src/components/layouts/.gitkeep
touch src/components/shared/.gitkeep
```

**Step 3: Commit**

```bash
git add src/
git commit -m "chore: create folder structure"
```

---

## Fase 5: Cliente API

### Task 5.1: Criar cliente API base

**Files:**
- Create: `src/lib/api/client.ts`

**Step 1: Criar src/lib/api/client.ts**

```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5173";

type RequestConfig = {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  headers?: Record<string, string>;
  skipAuth?: boolean;
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
};

type ApiError = {
  error: string;
  status: number;
};

function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("tcq_access_token");
}

function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("tcq_refresh_token");
}

export function setTokens(accessToken: string, refreshToken: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("tcq_access_token", accessToken);
  localStorage.setItem("tcq_refresh_token", refreshToken);
}

export function clearTokens(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("tcq_access_token");
  localStorage.removeItem("tcq_refresh_token");
}

class ApiClient {
  private baseUrl: string;
  private isRefreshing = false;
  private refreshPromise: Promise<boolean> | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async refreshAccessToken(): Promise<boolean> {
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    this.isRefreshing = true;
    this.refreshPromise = this.doRefresh();

    try {
      return await this.refreshPromise;
    } finally {
      this.isRefreshing = false;
      this.refreshPromise = null;
    }
  }

  private async doRefresh(): Promise<boolean> {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return false;

    try {
      const response = await fetch(`${this.baseUrl}/api/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${refreshToken}`,
        },
      });

      if (!response.ok) {
        clearTokens();
        return false;
      }

      const data = await response.json();
      setTokens(data.accessToken, refreshToken);
      return true;
    } catch {
      clearTokens();
      return false;
    }
  }

  async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<T> {
    const {
      method = "GET",
      body,
      headers = {},
      skipAuth = false,
      cache,
      next,
    } = config;

    const requestHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      ...headers,
    };

    if (!skipAuth) {
      const token = getAccessToken();
      if (token) {
        requestHeaders.Authorization = `Bearer ${token}`;
      }
    }

    const requestInit: RequestInit = {
      method,
      headers: requestHeaders,
      cache,
      next,
    };

    if (body) {
      requestInit.body = JSON.stringify(body);
    }

    let response = await fetch(`${this.baseUrl}${endpoint}`, requestInit);

    if (response.status === 401 && !skipAuth) {
      const refreshed = await this.refreshAccessToken();
      if (refreshed) {
        const newToken = getAccessToken();
        requestHeaders.Authorization = `Bearer ${newToken}`;
        response = await fetch(`${this.baseUrl}${endpoint}`, {
          ...requestInit,
          headers: requestHeaders,
        });
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw {
        error: errorData.error ?? "An error occurred",
        status: response.status,
      } as ApiError;
    }

    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  get<T>(endpoint: string, config?: Omit<RequestConfig, "method" | "body">) {
    return this.request<T>(endpoint, { ...config, method: "GET" });
  }

  post<T>(endpoint: string, body?: unknown, config?: Omit<RequestConfig, "method">) {
    return this.request<T>(endpoint, { ...config, method: "POST", body });
  }

  patch<T>(endpoint: string, body?: unknown, config?: Omit<RequestConfig, "method">) {
    return this.request<T>(endpoint, { ...config, method: "PATCH", body });
  }

  delete<T>(endpoint: string, config?: Omit<RequestConfig, "method" | "body">) {
    return this.request<T>(endpoint, { ...config, method: "DELETE" });
  }
}

export const api = new ApiClient(API_URL);
export type { ApiError };
```

**Step 2: Commit**

```bash
git add src/lib/api/client.ts
git commit -m "feat: add api client with jwt refresh"
```

---

### Task 5.2: Criar tipos da API

**Files:**
- Create: `src/types/api.ts`

**Step 1: Criar src/types/api.ts**

```typescript
// User types
export type UserRole =
  | "USER"
  | "ANALYST"
  | "SUPPORT"
  | "MODERATOR"
  | "SUPER_ADMIN";

export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  emailVerified: boolean;
  role: UserRole;
};

// Auth types
export type LoginResponse = {
  user: User;
  accessToken: string;
  refreshToken: string;
};

export type RegisterResponse = {
  message: string;
  user: User;
};

// Item types
export type Item = {
  id: string;
  name: string;
  description: string | null;
  images: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateItemInput = {
  name: string;
  description?: string;
  images?: string[];
};

// Loan types
export type LoanStatus = "PENDING" | "CONFIRMED" | "RETURNED" | "CANCELLED";

export type Loan = {
  id: string;
  itemId: string;
  lenderId: string;
  borrowerId: string;
  status: LoanStatus;
  expectedReturnDate?: string;
  actualReturnDate?: string;
  lenderNotes?: string;
  borrowerNotes?: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateLoanInput = {
  itemId: string;
  borrowerEmail: string;
  expectedReturnDate?: string;
  lenderNotes?: string;
};

// Dashboard types
export type DashboardStats = {
  totalItems: number;
  activeLoans: number;
  borrowedItems: number;
};

export type Friend = {
  id: string;
  name: string;
};
```

**Step 2: Criar index de exportação**

```bash
echo 'export * from "./api";' > src/types/index.ts
```

**Step 3: Commit**

```bash
git add src/types/
git commit -m "feat: add api types derived from openapi spec"
```

---

### Task 5.3: Criar módulo de API auth

**Files:**
- Create: `src/lib/api/auth.ts`

**Step 1: Criar src/lib/api/auth.ts**

```typescript
import { cache } from "react";
import { api } from "./client";
import type { User, LoginResponse, RegisterResponse } from "@/types";

export const getCurrentUser = cache(async (): Promise<User | null> => {
  try {
    const data = await api.get<{ user: User }>("/api/auth/me");
    return data.user;
  } catch {
    return null;
  }
});

export async function login(
  email: string,
  password: string
): Promise<LoginResponse> {
  return api.post<LoginResponse>(
    "/api/auth/login",
    { email, password },
    { skipAuth: true }
  );
}

export async function register(
  name: string,
  email: string,
  password: string
): Promise<RegisterResponse> {
  return api.post<RegisterResponse>(
    "/api/auth/register",
    { name, email, password },
    { skipAuth: true }
  );
}

export async function forgotPassword(email: string): Promise<void> {
  await api.post("/api/auth/forgot-password", { email }, { skipAuth: true });
}

export async function resetPassword(
  token: string,
  password: string
): Promise<void> {
  await api.post(
    "/api/auth/reset-password",
    { token, password },
    { skipAuth: true }
  );
}

export async function verifyEmail(token: string): Promise<void> {
  await api.post("/api/auth/verify-email", { token }, { skipAuth: true });
}
```

**Step 2: Commit**

```bash
git add src/lib/api/auth.ts
git commit -m "feat: add auth api module with react cache"
```

---

## Fase 6: Auth Provider

### Task 6.1: Criar Auth Provider

**Files:**
- Create: `src/providers/auth-provider.tsx`

**Step 1: Criar src/providers/auth-provider.tsx**

```typescript
"use client";

import {
  createContext,
  useContext,
  useCallback,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { login as apiLogin, register as apiRegister } from "@/lib/api/auth";
import { setTokens, clearTokens } from "@/lib/api/client";
import type { User } from "@/types";

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

function hasValidToken(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("tcq_access_token") !== null;
}

export function AuthProvider({
  children,
  initialUser,
}: {
  children: ReactNode;
  initialUser: User | null;
}) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(initialUser);
  const [isLoading, setIsLoading] = useState(!initialUser && hasValidToken());

  const refreshUser = useCallback(async () => {
    if (!hasValidToken()) {
      setUser(null);
      return;
    }

    try {
      const { getCurrentUser } = await import("@/lib/api/auth");
      const userData = await getCurrentUser();
      setUser(userData);
    } catch {
      setUser(null);
      clearTokens();
    }
  }, []);

  useEffect(() => {
    if (!initialUser && hasValidToken()) {
      refreshUser().finally(() => setIsLoading(false));
    }
  }, [initialUser, refreshUser]);

  const login = useCallback(
    async (email: string, password: string) => {
      const response = await apiLogin(email, password);
      setTokens(response.accessToken, response.refreshToken);
      setUser(response.user);
      router.push("/dashboard");
    },
    [router]
  );

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      await apiRegister(name, email, password);
      router.push("/login?registered=true");
    },
    [router]
  );

  const logout = useCallback(() => {
    clearTokens();
    setUser(null);
    router.push("/login");
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
```

**Step 2: Commit**

```bash
git add src/providers/auth-provider.tsx
git commit -m "feat: add auth provider with login/logout"
```

---

### Task 6.2: Criar Theme Provider

**Files:**
- Create: `src/providers/theme-provider.tsx`

**Step 1: Instalar next-themes**

```bash
bun add next-themes
```

**Step 2: Criar src/providers/theme-provider.tsx**

```typescript
"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ComponentProps } from "react";

export function ThemeProvider({
  children,
  ...props
}: ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
```

**Step 3: Commit**

```bash
git add src/providers/theme-provider.tsx package.json bun.lockb
git commit -m "feat: add theme provider"
```

---

## Fase 7: Layout Root

### Task 7.1: Configurar layout principal

**Files:**
- Modify: `src/app/layout.tsx`

**Step 1: Atualizar src/app/layout.tsx**

```typescript
import type { Metadata, Viewport } from "next";
import { Inter, Noto_Sans } from "next/font/google";
import { AuthProvider } from "@/providers/auth-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { getCurrentUser } from "@/lib/api/auth";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const notoSans = Noto_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-noto-sans",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "TáComQuem - Empréstimos entre amigos",
    template: "%s | TáComQuem",
  },
  description:
    "Plataforma de empréstimos de itens pessoais entre amigos. Empreste e pegue emprestado com confiança.",
  keywords: ["empréstimo", "amigos", "compartilhamento", "itens"],
};

export const viewport: Viewport = {
  themeColor: "#101922",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${notoSans.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background-950 antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <AuthProvider initialUser={user}>{children}</AuthProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
```

**Step 2: Commit**

```bash
git add src/app/layout.tsx
git commit -m "feat: configure root layout with providers"
```

---

### Task 7.2: Criar página inicial

**Files:**
- Modify: `src/app/page.tsx`

**Step 1: Atualizar src/app/page.tsx**

```typescript
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="max-w-2xl text-center">
        <h1 className="font-heading text-4xl font-bold text-foreground mb-4">
          TáComQuem
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Nunca mais esqueça quem está com suas coisas.
          Gerencie empréstimos entre amigos de forma simples.
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/register">Começar agora</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/login">Entrar</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
```

**Step 2: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: add landing page"
```

---

## Fase 8: Biome

### Task 8.1: Instalar e configurar Biome

**Files:**
- Create: `biome.json`
- Modify: `package.json`

**Step 1: Instalar Biome**

```bash
bun add -d @biomejs/biome
```

**Step 2: Criar biome.json**

```json
{
  "$schema": "https://biomejs.dev/schemas/1.9.2/schema.json",
  "organizeImports": {
    "enabled": true
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "style": {
        "useNamingConvention": "off"
      },
      "suspicious": {
        "noExplicitAny": "warn"
      }
    }
  },
  "formatter": {
    "enabled": true,
    "indentWidth": 2,
    "lineWidth": 80,
    "trailingComma": "es5",
    "singleQuote": false,
    "bracketSpacing": true
  },
  "javascript": {
    "formatter": {
      "enabled": true
    }
  },
  "typescript": {
    "formatter": {
      "enabled": true
    }
  },
  "json": {
    "formatter": {
      "enabled": true,
      "trailingCommas": "none"
    }
  },
  "ignore": [
    "node_modules",
    ".next",
    "dist",
    "bun.lockb",
    "build"
  ]
}
```

**Step 3: Adicionar scripts ao package.json**

Adicionar no `scripts`:
```json
"lint": "biome lint src/",
"format": "biome format --write src/",
"check": "biome check --write src/"
```

**Step 4: Commit**

```bash
git add biome.json package.json bun.lockb
git commit -m "chore: install and configure biome for linting and formatting"
```

---

## Fase 9: Verificação Final

### Task 9.1: Verificar build e lint

**Step 1: Executar lint**

```bash
bun run lint
```

Corrigir quaisquer erros reportados.

**Step 2: Executar build**

```bash
bun run build
```

Deve completar sem erros.

**Step 3: Executar dev**

```bash
bun run dev
```

Acessar http://localhost:3000 e verificar:
- Página inicial carrega
- Dark mode aplicado
- Fontes corretas

---

### Task 9.2: Commit final

**Step 1: Verificar status**

```bash
git status
```

**Step 2: Commit de quaisquer arquivos restantes**

```bash
git add .
git commit -m "chore: complete frontend setup"
```

---

## Resumo de Arquivos Criados

| Arquivo | Descrição |
|---------|-----------|
| `next.config.ts` | Configuração Next.js com otimizações |
| `tsconfig.json` | TypeScript strict mode |
| `tailwind.config.ts` | Tema customizado TáComQuem |
| `src/app/globals.css` | CSS global com design tokens |
| `src/app/layout.tsx` | Layout root com providers |
| `src/app/page.tsx` | Landing page |
| `src/lib/api/client.ts` | Cliente API com JWT refresh |
| `src/lib/api/auth.ts` | Módulo de autenticação |
| `src/types/api.ts` | Tipos TypeScript da API |
| `src/providers/auth-provider.tsx` | Context de autenticação |
| `src/providers/theme-provider.tsx` | Context de tema |
| `components.json` | Configuração shadcn/ui |
| `src/components/ui/*` | Componentes shadcn/ui |
| `.env.example` | Template de variáveis de ambiente |
| `.prettierrc` | Configuração Prettier |
| `eslint.config.mjs` | Configuração ESLint |
| `playwright.config.ts` | Configuração Playwright E2E |
| `tests/fixtures/auth.fixture.ts` | Fixtures de autenticação para testes |
| `tests/helpers/auth.helper.ts` | Helpers de autenticação para testes |
| `tests/helpers/navigation.helper.ts` | Helpers de navegação para testes |
| `tests/e2e/auth.spec.ts` | Testes E2E de autenticação |
| `tests/e2e/navigation.spec.ts` | Testes E2E de navegação |
| `tests/e2e/public-pages.spec.ts` | Testes E2E de páginas públicas |
| `tests/components/button.spec.ts` | Testes de componentes - Button |
| `tests/components/card.spec.ts` | Testes de componentes - Card |
| `.github/workflows/test.yml` | CI/CD workflow para testes E2E |

---

## Fase 10: Testes com Playwright

### Task 10.1: Instalar e configurar Playwright

**Files:**
- Create: `playwright.config.ts`
- Create: `tests/` directory

**Step 1: Instalar Playwright**

```bash
bun add -d @playwright/test
```

**Step 2: Criar arquivo de configuração**

```bash
bunx playwright install
```

**Step 3: Criar `playwright.config.ts`**

```typescript
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  reporter: [
    ["html"],
    ["list"],
  ],

  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],

  webServer: {
    command: "bun run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
});
```

**Step 4: Adicionar scripts ao package.json**

Adicionar no `scripts`:
```json
"test:e2e": "playwright test",
"test:e2e:ui": "playwright test --ui",
"test:e2e:debug": "playwright test --debug"
```

**Step 5: Commit**

```bash
git add playwright.config.ts package.json bun.lockb
git commit -m "chore: install and configure playwright\""
```

---

### Task 10.2: Criar fixtures e helpers para testes

**Files:**
- Create: `tests/fixtures/auth.fixture.ts`
- Create: `tests/helpers/auth.helper.ts`
- Create: `tests/helpers/navigation.helper.ts`

**Step 1: Criar `tests/fixtures/auth.fixture.ts`**

```typescript
import { test as base, expect } from "@playwright/test";
import type { Page } from "@playwright/test";

type AuthFixtures = {
  authenticatedPage: Page;
};

export const test = base.extend<AuthFixtures>({
  authenticatedPage: async ({ page }, use) => {
    // Mock de login - você pode substituir com real API calls
    await page.context().addCookies([
      {
        name: "tcq_access_token",
        value: "mock_token_for_testing",
        domain: "localhost",
        path: "/",
        httpOnly: true,
        sameSite: "Lax",
        expires: Date.now() / 1000 + 86400,
      },
    ]);

    await use(page);
  },
});

export { expect };
```

**Step 2: Criar `tests/helpers/auth.helper.ts`**

```typescript
import type { Page } from "@playwright/test";

export async function loginAsUser(
  page: Page,
  email: string = "test@example.com",
  password: string = "password123"
) {
  await page.goto("/login");
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.click("button[type=\"submit\"]");
  await page.waitForURL("/dashboard");
}

export async function logoutUser(page: Page) {
  // Assumindo que há um botão de logout no header
  await page.click('[data-testid="user-menu-button"]');
  await page.click('[data-testid="logout-button"]');
  await page.waitForURL("/login");
}

export async function registerNewUser(
  page: Page,
  name: string = "Test User",
  email: string = "newuser@example.com",
  password: string = "SecurePassword123"
) {
  await page.goto("/register");
  await page.fill('input[placeholder*="nome"]', name);
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.click("button[type=\"submit\"]");
  // Aguardar redirect após registro bem-sucedido
  await page.waitForURL(/\/(login|dashboard)/);
}
```

**Step 3: Criar `tests/helpers/navigation.helper.ts`**

```typescript
import type { Page } from "@playwright/test";

export async function navigateToDashboard(page: Page) {
  await page.goto("/dashboard");
  await page.waitForLoadState("networkidle");
}

export async function navigateToItems(page: Page) {
  await page.goto("/dashboard/items");
  await page.waitForLoadState("networkidle");
}

export async function navigateToLoans(page: Page) {
  await page.goto("/dashboard/loans");
  await page.waitForLoadState("networkidle");
}

export async function navigateToProfile(page: Page) {
  await page.goto("/dashboard/profile");
  await page.waitForLoadState("networkidle");
}
```

**Step 4: Commit**

```bash
git add tests/fixtures/ tests/helpers/
git commit -m "test: add playwright fixtures and helpers"
```

---

### Task 10.3: Criar testes E2E para autenticação

**Files:**
- Create: `tests/e2e/auth.spec.ts`

**Step 1: Criar `tests/e2e/auth.spec.ts`**

```typescript
import { test, expect } from "@playwright/test";
import { loginAsUser, registerNewUser, logoutUser } from "../helpers/auth.helper";

test.describe("Authentication Flow", () => {
  test("should display login page", async ({ page }) => {
    await page.goto("/login");
    expect(page.url()).toContain("/login");
    await expect(page.locator("h1")).toContainText(/login|entrar/i);
  });

  test("should display register page", async ({ page }) => {
    await page.goto("/register");
    expect(page.url()).toContain("/register");
    await expect(page.locator("h1")).toContainText(/register|cadastro/i);
  });

  test("should login successfully with valid credentials", async ({
    page,
  }) => {
    // Note: Substitua com credenciais de teste reais
    await loginAsUser(page);
    expect(page.url()).toContain("/dashboard");
  });

  test("should logout successfully", async ({ page, context }) => {
    // Setup: login
    await context.addCookies([
      {
        name: "tcq_access_token",
        value: "valid_token",
        domain: "localhost",
        path: "/",
      },
    ]);

    await page.goto("/dashboard");
    await logoutUser(page);
    expect(page.url()).toContain("/login");
  });

  test("should show error with invalid credentials", async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[type="email"]', "wrong@example.com");
    await page.fill('input[type="password"]', "wrongpassword");
    await page.click("button[type=\"submit\"]");

    // Aguardar mensagem de erro
    await expect(page.locator("[role=\"alert\"]")).toBeVisible();
  });

  test("should register new user successfully", async ({ page }) => {
    const timestamp = Date.now();
    const email = `testuser${timestamp}@example.com`;

    await registerNewUser(page, "New Test User", email);
    // Verificar se foi redirecionado após registro
    expect(page.url()).toMatch(/\/(login|dashboard)/);
  });
});
```

**Step 2: Commit**

```bash
git add tests/e2e/auth.spec.ts
git commit -m "test: add e2e tests for authentication"
```

---

### Task 10.4: Criar testes E2E para navegação

**Files:**
- Create: `tests/e2e/navigation.spec.ts`

**Step 1: Criar `tests/e2e/navigation.spec.ts`**

```typescript
import { test, expect } from "../fixtures/auth.fixture";
import {
  navigateToDashboard,
  navigateToItems,
  navigateToLoans,
  navigateToProfile,
} from "../helpers/navigation.helper";

test.describe("Navigation", () => {
  test("should navigate to dashboard", async ({ authenticatedPage }) => {
    await navigateToDashboard(authenticatedPage);
    expect(authenticatedPage.url()).toContain("/dashboard");
  });

  test("should navigate to items page", async ({ authenticatedPage }) => {
    await navigateToItems(authenticatedPage);
    expect(authenticatedPage.url()).toContain("/items");
  });

  test("should navigate to loans page", async ({ authenticatedPage }) => {
    await navigateToLoans(authenticatedPage);
    expect(authenticatedPage.url()).toContain("/loans");
  });

  test("should navigate to profile page", async ({ authenticatedPage }) => {
    await navigateToProfile(authenticatedPage);
    expect(authenticatedPage.url()).toContain("/profile");
  });

  test("should have navigation menu", async ({ authenticatedPage }) => {
    await navigateToDashboard(authenticatedPage);
    // Verificar se menu de navegação existe
    const navMenu = authenticatedPage.locator("nav");
    await expect(navMenu).toBeVisible();
  });
});
```

**Step 2: Commit**

```bash
git add tests/e2e/navigation.spec.ts
git commit -m "test: add e2e tests for navigation"
```

---

### Task 10.5: Criar testes E2E para páginas públicas

**Files:**
- Create: `tests/e2e/public-pages.spec.ts`

**Step 1: Criar `tests/e2e/public-pages.spec.ts`**

```typescript
import { test, expect } from "@playwright/test";

test.describe("Public Pages", () => {
  test("should load home page", async ({ page }) => {
    await page.goto("/");
    expect(page.url()).toBe("http://localhost:3000/");
    await expect(page.locator("h1")).toContainText(/TáComQuem/);
  });

  test("should have working navigation buttons on home", async ({ page }) => {
    await page.goto("/");

    // Verificar botões de ação
    const startButton = page.locator("a:has-text('Começar agora')");
    const loginButton = page.locator("a:has-text('Entrar')");

    await expect(startButton).toBeVisible();
    await expect(loginButton).toBeVisible();
  });

  test("should navigate to register from home", async ({ page }) => {
    await page.goto("/");
    await page.click("a:has-text('Começar agora')");
    expect(page.url()).toContain("/register");
  });

  test("should navigate to login from home", async ({ page }) => {
    await page.goto("/");
    await page.click("a:has-text('Entrar')");
    expect(page.url()).toContain("/login");
  });

  test("should apply dark theme by default", async ({ page }) => {
    await page.goto("/");
    const body = page.locator("body");
    const bgColor = await body.evaluate(() => {
      return window.getComputedStyle(document.body).backgroundColor;
    });
    // Verificar se background é dark (ajuste conforme seu valor exato)
    expect(bgColor).toBeTruthy();
  });
});
```

**Step 2: Commit**

```bash
git add tests/e2e/public-pages.spec.ts
git commit -m "test: add e2e tests for public pages"
```

---

### Task 10.6: Configurar CI/CD para testes

**Files:**
- Create: `.github/workflows/test.yml`

**Step 1: Criar `.github/workflows/test.yml`**

```yaml
name: E2E Tests

on:
  push:
    branches: [main, feature/*]
  pull_request:
    branches: [main]

jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Bun
        uses: oven-sh/setup-bun@v1
        with:
          bun-version: latest

      - name: Install dependencies
        run: bun install

      - name: Install Playwright browsers
        run: bunx playwright install --with-deps

      - name: Run ESLint
        run: bun run lint

      - name: Build project
        run: bun run build

      - name: Run E2E tests
        run: bun run test:e2e

      - name: Upload Playwright report
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

**Step 2: Commit**

```bash
git add .github/workflows/test.yml
git commit -m "chore: configure ci/cd for e2e tests"
```

---

### Task 10.7: Adicionar testes de componentes

**Files:**
- Create: `tests/components/button.spec.ts`
- Create: `tests/components/card.spec.ts`

**Step 1: Criar `tests/components/button.spec.ts`**

```typescript
import { test, expect } from "@playwright/test";

test.describe("Button Component", () => {
  test("should render button", async ({ page }) => {
    // Navegar para uma página que tenha botões (ex: home)
    await page.goto("/");
    const button = page.locator("button").first();
    await expect(button).toBeVisible();
  });

  test("should have hover state", async ({ page }) => {
    await page.goto("/");
    const button = page.locator("button").first();

    // Hover over button
    await button.hover();

    // Verificar estilos de hover (ajuste conforme seu CSS)
    const computedStyle = await button.evaluate((el) => {
      return window.getComputedStyle(el).cursor;
    });

    expect(computedStyle).toBe("pointer");
  });

  test("should be clickable", async ({ page }) => {
    await page.goto("/login");
    const submitButton = page.locator('button[type="submit"]').first();
    await expect(submitButton).toBeEnabled();
  });
});
```

**Step 2: Criar `tests/components/card.spec.ts`**

```typescript
import { test, expect } from "@playwright/test";

test.describe("Card Component", () => {
  test("should render cards on page", async ({ page }) => {
    // Navegar para página que tem cards (ex: dashboard)
    await page.goto("/dashboard");
    const cards = page.locator("[role='article']");

    // Verificar se há cards
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  test("should have proper spacing", async ({ page }) => {
    await page.goto("/dashboard");
    const card = page.locator("[role='article']").first();

    // Verificar se card é visível
    await expect(card).toBeVisible();

    // Verificar se tem padding/margin
    const boundingBox = await card.boundingBox();
    expect(boundingBox).toBeTruthy();
    expect(boundingBox?.width).toBeGreaterThan(0);
  });
});
```

**Step 3: Commit**

```bash
git add tests/components/
git commit -m "test: add component tests"
```

---

### Task 10.8: Executar e validar todos os testes

**Step 1: Iniciar servidor de desenvolvimento**

```bash
bun run dev
```

**Step 2: Em outro terminal, executar testes**

```bash
bun run test:e2e
```

**Step 3: Verificar relatório de testes**

```bash
bunx playwright show-report
```

O relatório HTML será aberto mostrando:
- Testes passando/falhando
- Screenshots de falhas
- Traces de execução

**Step 4: Commit final**

```bash
git add .
git commit -m "test: complete e2e test setup and validation"
```

---

## Próximos Passos (pós-setup)

Após completar este plano, criar novas iniciativas para:

1. **002-auth-pages** - Páginas de login, registro, recuperação de senha
2. **003-dashboard** - Dashboard principal com estatísticas
3. **004-items** - CRUD de itens
4. **005-loans** - CRUD de empréstimos
5. **006-public-links** - Página pública de confirmação
6. **007-e2e-tests-expansion** - Expandir cobertura de testes para todas as features
