import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import type { AddBetaUserInput, BetaProgramResponse } from "@/types";

export function useAdminBetaProgram() {
  return useQuery({
    queryKey: ["admin", "beta"],
    queryFn: () => api.get<BetaProgramResponse>("/api/admin/beta-program/"),
    staleTime: 30 * 1000,
  });
}

export function useAddBetaUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: AddBetaUserInput) =>
      api.post("/api/admin/beta-program/add-user", input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "beta"] });
    },
  });
}

export function useRemoveBetaUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api.post(`/api/admin/beta-program/${id}/remove-user`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "beta"] });
    },
  });
}
