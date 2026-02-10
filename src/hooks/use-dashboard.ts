import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import type {
  DashboardActiveLoan,
  DashboardPendingLoan,
  DashboardRecentActivity,
  DashboardStats,
} from "@/types";

type DashboardData = {
  stats: DashboardStats;
  recentActivity: DashboardRecentActivity[];
  pendingLoans: DashboardPendingLoan[];
  activeLoans: DashboardActiveLoan[];
};

type DashboardApiResponse = {
  stats: {
    itemsCount: number;
    activeLentCount: number;
    activeBorrowedCount: number;
    pendingCount: number;
  };
  recentActivity: DashboardRecentActivity[];
  pendingLoans: DashboardPendingLoan[];
  activeLoans: DashboardActiveLoan[];
};

export function useDashboard() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const data = await api.get<DashboardApiResponse>("/api/dashboard/");

      return {
        stats: {
          totalItems: data.stats.itemsCount,
          activeLoans: data.stats.activeLentCount,
          borrowedItems: data.stats.activeBorrowedCount,
          pendingLoans: data.stats.pendingCount,
        },
        recentActivity: data.recentActivity,
        pendingLoans: data.pendingLoans,
        activeLoans: data.activeLoans,
      } satisfies DashboardData;
    },
    staleTime: 30 * 1000, // 30s
  });
}
