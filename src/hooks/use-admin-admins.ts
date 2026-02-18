import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import type {
  AdminAccountsResponse,
  AdminAuditLogResponse,
  CreateAdminInput,
  UpdateAdminRoleInput,
} from "@/types";

export function useAdminAccounts() {
  return useQuery({
    queryKey: ["admin", "admins"],
    queryFn: () => api.get<AdminAccountsResponse>("/api/admin/admins/"),
    staleTime: 30 * 1000,
  });
}

export function useAdminAuditLog(page = 1) {
  return useQuery({
    queryKey: ["admin", "admins", "audit-log", page],
    queryFn: () =>
      api.get<AdminAuditLogResponse>(
        `/api/admin/admins/audit-log?page=${page}`
      ),
    staleTime: 60 * 1000,
  });
}

export function useCreateAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateAdminInput) =>
      api.post("/api/admin/admins/", input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "admins"] });
    },
  });
}

export function useUpdateAdminRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateAdminRoleInput }) =>
      api.patch(`/api/admin/admins/${id}/role`, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "admins"] });
    },
  });
}

export function useDeleteAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/api/admin/admins/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "admins"] });
    },
  });
}
