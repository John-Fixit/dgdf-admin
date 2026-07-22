import { useQuery } from '@tanstack/react-query'
import { fetchAuditLogs } from '@/lib/api'
import { QUERY_KEYS } from '@/lib/constants'
import type { AuditLogFilters } from '@/lib/types'

/**
 * Fetches audit trail records via TanStack Query.
 */
export function useAuditLogs(filters: AuditLogFilters = {}) {
  return useQuery({
    queryKey: [...QUERY_KEYS.auditLogs, filters] as const,
    queryFn: () => fetchAuditLogs(filters),
  })
}
