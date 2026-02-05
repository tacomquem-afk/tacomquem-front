import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api/client'
import type { DashboardStats, Loan } from '@/types'

type DashboardData = {
  stats: DashboardStats
  recentLoans: Loan[]
}

export function useDashboard() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const data = await api.get<DashboardData>('/api/dashboard')
      return data
    },
    staleTime: 30 * 1000, // 30s
  })
}
