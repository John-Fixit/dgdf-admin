import { useQuery } from '@tanstack/react-query'
import { fetchAnalyticsDaily, fetchAnalyticsSummary } from '@/lib/api'
import { QUERY_KEYS } from '@/lib/constants'

/**
 * Fetches 30-day GA4 visitor totals. Kept independent of the main
 * dashboard query so an analytics outage never blocks the rest of the page.
 */
export function useAnalyticsSummary() {
  return useQuery({
    queryKey: QUERY_KEYS.analyticsSummary,
    queryFn: fetchAnalyticsSummary,
    retry: 1,
  })
}

/**
 * Fetches the GA4 daily active-users trend for the last 30 days.
 */
export function useAnalyticsDaily() {
  return useQuery({
    queryKey: QUERY_KEYS.analyticsDaily,
    queryFn: fetchAnalyticsDaily,
    retry: 1,
  })
}
