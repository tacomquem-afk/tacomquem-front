import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import type { BetaWaitlistResponse } from "@/types";

type BetaWaitlistParams = {
  page?: number;
  limit?: number;
  sortOrder?: "asc" | "desc";
};

export function useAdminBetaWaitlist(params: BetaWaitlistParams = {}) {
  const { page = 1, limit = 20, sortOrder = "asc" } = params;

  return useQuery({
    queryKey: ["admin", "beta-waitlist", { page, limit, sortOrder }],
    queryFn: () =>
      api.get<BetaWaitlistResponse>(
        `/api/admin/beta-program/waitlist?page=${page}&limit=${limit}&sortOrder=${sortOrder}`
      ),
    staleTime: 30 * 1000,
  });
}
