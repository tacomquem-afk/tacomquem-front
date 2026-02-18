import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import type { AdminModerationItem, AdminModerationLoan } from "@/types";

export function useAdminModerationItem(id: string) {
  return useQuery({
    queryKey: ["admin", "moderation", "items", id],
    queryFn: () =>
      api.get<{ item: AdminModerationItem }>(
        `/api/admin/moderation/items/${id}`
      ),
    enabled: !!id,
  });
}

export function useDeleteModerationItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (itemId: string) =>
      api.delete(`/api/admin/moderation/items/${itemId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "moderation"] });
    },
  });
}

export function useAdminModerationLoan(id: string) {
  return useQuery({
    queryKey: ["admin", "moderation", "loans", id],
    queryFn: () =>
      api.get<{ loan: AdminModerationLoan }>(
        `/api/admin/moderation/loans/${id}`
      ),
    enabled: !!id,
  });
}

export function useCancelModerationLoan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (loanId: string) =>
      api.post(`/api/admin/moderation/loans/${loanId}/cancel`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "moderation"] });
    },
  });
}
