import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import type { DashboardSearchResponse } from "@/types";

export function useDashboardSearch(query: string, limit = 10) {
  const normalizedQuery = query.trim();

  return useQuery({
    queryKey: ["dashboard-search", normalizedQuery, limit],
    queryFn: async () => {
      const params = new URLSearchParams({
        q: normalizedQuery,
        limit: String(limit),
      });

      return api.get<DashboardSearchResponse>(
        `/api/dashboard/search?${params}`
      );
    },
    enabled: normalizedQuery.length > 0,
    staleTime: 30 * 1000,
  });
}
