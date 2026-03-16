import { useQuery } from "@tanstack/react-query"
import { fetchDashboardStats } from "@/services/apiMock"

/**
 * Hook that fetches and caches dashboard statistics.
 * Data is considered fresh for 5 minutes.
 * @returns {{ data: object, isLoading: boolean, isError: boolean, error: Error }}
 */
export function useDashboardData() {
  return useQuery({
    queryKey: ["dashboardStats"],
    queryFn: fetchDashboardStats,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  })
}
