import { useQuery } from '@tanstack/react-query'
import { fetchDonations } from '@/lib/api'
import { QUERY_KEYS } from '@/lib/constants'

/**
 * Fetches donations via TanStack Query.
 */
export function useDonations() {
  return useQuery({
    queryKey: QUERY_KEYS.donations,
    queryFn: fetchDonations,
  })
}
