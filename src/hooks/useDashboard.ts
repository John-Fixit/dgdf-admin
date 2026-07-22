import { useQuery } from '@tanstack/react-query'
import { fetchDashboard } from '@/lib/api'
import { QUERY_KEYS } from '@/lib/constants'

/**
 * Fetches the live admin dashboard aggregate.
 */
export function useDashboard() {
  return useQuery({
    queryKey: QUERY_KEYS.dashboard,
    queryFn: fetchDashboard,
  })
}
