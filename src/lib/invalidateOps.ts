import type { QueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/lib/constants'

/**
 * Refresh dashboard + audit caches after admin mutations.
 */
export async function invalidateOpsCaches(
  queryClient: QueryClient,
): Promise<void> {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard }),
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.auditLogs }),
  ])
}
