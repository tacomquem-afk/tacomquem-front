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
