import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import type {
  AddBetaUserInput,
  BetaProgramResponse,
  RemoveBetaUserInput,
} from "@/types";

type BetaProgramParams = {
  page?: number;
  limit?: number;
  sortBy?: "betaAddedAt" | "createdAt";
  sortOrder?: "asc" | "desc";
};

export function useAdminBetaProgram(params: BetaProgramParams = {}) {
  const {
    page = 1,
    limit = 20,
    sortBy = "betaAddedAt",
    sortOrder = "desc",
  } = params;

  return useQuery({
    queryKey: ["admin", "beta", { page, limit, sortBy, sortOrder }],
    queryFn: () =>
      api.get<BetaProgramResponse>(
        `/api/admin/beta-program/?page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}`
      ),
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
    mutationFn: ({ id, ...body }: { id: string } & RemoveBetaUserInput) =>
      api.post(`/api/admin/beta-program/${id}/remove-user`, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "beta"] });
    },
  });
}
