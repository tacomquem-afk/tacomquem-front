import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import type {
  AdminDashboardStats,
  AdminLoanStats,
  AdminUserStats,
} from "@/types";

export function useAdminDashboard() {
  return useQuery({
    queryKey: ["admin", "analytics", "dashboard"],
    queryFn: () =>
      api.get<AdminDashboardStats>("/api/admin/analytics/dashboard"),
    staleTime: 60 * 1000,
  });
}

export function useAdminUserStats() {
  return useQuery({
    queryKey: ["admin", "analytics", "users"],
    queryFn: () => api.get<AdminUserStats>("/api/admin/analytics/users/stats"),
    staleTime: 60 * 1000,
  });
}

export function useAdminLoanStats() {
  return useQuery({
    queryKey: ["admin", "analytics", "loans"],
    queryFn: () => api.get<AdminLoanStats>("/api/admin/analytics/loans/stats"),
    staleTime: 60 * 1000,
  });
}
