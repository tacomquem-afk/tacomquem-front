import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import type {
  AdminDashboardStats,
  AdminLoanStats,
  AdminUserStats,
} from "@/types";

const BACKEND = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333";

export function useAdminDashboard() {
  return useQuery({
    queryKey: ["admin", "analytics", "dashboard"],
    queryFn: () =>
      api.get<AdminDashboardStats>(`${BACKEND}/api/admin/analytics/dashboard`),
    staleTime: 60 * 1000,
  });
}

export function useAdminUserStats() {
  return useQuery({
    queryKey: ["admin", "analytics", "users"],
    queryFn: () =>
      api.get<AdminUserStats>(`${BACKEND}/api/admin/analytics/users/stats`),
    staleTime: 60 * 1000,
  });
}

export function useAdminLoanStats() {
  return useQuery({
    queryKey: ["admin", "analytics", "loans"],
    queryFn: () =>
      api.get<AdminLoanStats>(`${BACKEND}/api/admin/analytics/loans/stats`),
    staleTime: 60 * 1000,
  });
}
