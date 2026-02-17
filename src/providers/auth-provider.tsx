"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { login as apiLogin, register as apiRegister } from "@/lib/api/auth";
import { clearTokens, setTokens } from "@/lib/api/client";
import type { User } from "@/types";

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string,
    redirectTo?: string
  ) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    redirectToLogin?: string
  ) => Promise<void>;
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
    async (email: string, password: string, redirectTo = "/dashboard") => {
      const response = await apiLogin(email, password);
      setTokens(response.accessToken, response.refreshToken);
      setUser(response.user);
      router.push(redirectTo);
    },
    [router]
  );

  const register = useCallback(
    async (
      name: string,
      email: string,
      password: string,
      redirectToLogin = "/login?registered=true"
    ) => {
      await apiRegister(name, email, password);
      router.push(redirectToLogin);
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
