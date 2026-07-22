import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addToast } from '@heroui/react'
import { deleteAuditLogs } from '@/lib/api'
import { QUERY_KEYS } from '@/lib/constants'

/**
 * Clears all audit log entries (super admin).
 */
export function useDeleteAuditLogs() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteAuditLogs,
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.auditLogs })
      addToast({
        title: 'Audit logs cleared',
        description: `${data.deletedCount} entries removed`,
        color: 'success',
      })
    },
    onError: (err: Error) => {
      addToast({
        title: err.message || 'Failed to clear audit logs',
        color: 'danger',
      })
    },
  })
}
