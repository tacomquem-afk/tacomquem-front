import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import type {
  AdminDeleteUserResponse,
  AdminUserDetailResponse,
  AdminUsersResponse,
} from "@/types";

interface AdminUsersFilters {
  page?: number;
  search?: string;
  role?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export function useAdminUsers(filters: AdminUsersFilters = {}) {
  const {
    page = 1,
    search,
    role,
    isActive,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = filters;

  const params = new URLSearchParams();
  params.append("page", page.toString());
  if (search) params.append("search", search);
  if (role) params.append("role", role);
  if (isActive !== undefined) params.append("isActive", isActive.toString());
  if (sortBy) params.append("sortBy", sortBy);
  if (sortOrder) params.append("sortOrder", sortOrder);

  return useQuery({
    queryKey: ["admin", "users", filters],
    queryFn: () =>
      api.get<AdminUsersResponse>(`/api/admin/users/?${params.toString()}`),
    staleTime: 30 * 1000,
  });
}

export function useAdminUser(id: string) {
  return useQuery({
    queryKey: ["admin", "users", id],
    queryFn: () => api.get<AdminUserDetailResponse>(`/api/admin/users/${id}`),
    enabled: !!id,
  });
}

export function useBlockUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, reason }: { userId: string; reason: string }) =>
      api.post(`/api/admin/users/${userId}/block`, { reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
}

export function useUnblockUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) =>
      api.post(`/api/admin/users/${userId}/unblock`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, reason }: { userId: string; reason: string }) =>
      api.request<AdminDeleteUserResponse>(`/api/admin/users/${userId}`, {
        method: "DELETE",
        body: { reason },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
}
