import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import type { BetaInvitesResponse } from "@/types";

type BetaInvitesParams = {
  limit?: number;
  offset?: number;
};

export function useAdminBetaInvites(params: BetaInvitesParams = {}) {
  const { limit = 20, offset = 0 } = params;

  return useQuery({
    queryKey: ["admin", "beta-invites", { limit, offset }],
    queryFn: () =>
      api.get<BetaInvitesResponse>(
        `/api/admin/beta-invites?limit=${limit}&offset=${offset}`
      ),
    staleTime: 30 * 1000,
  });
}

export function useAddBetaInvite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { email: string; reason?: string }) =>
      api.post("/api/admin/beta-invites", input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "beta-invites"] });
    },
  });
}

export function useRemoveBetaInvite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (email: string) =>
      api.delete(`/api/admin/beta-invites/${encodeURIComponent(email)}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "beta-invites"] });
    },
  });
}
