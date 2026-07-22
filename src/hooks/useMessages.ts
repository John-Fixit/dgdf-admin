import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { deleteMessage, fetchMessages, markMessageRead } from '@/lib/api'
import { QUERY_KEYS } from '@/lib/constants'
import { invalidateOpsCaches } from '@/lib/invalidateOps'

/**
 * Fetches contact messages via TanStack Query.
 * Polls periodically so new public contact submissions surface in the UI.
 */
export function useMessages() {
  return useQuery({
    queryKey: QUERY_KEYS.messages,
    queryFn: fetchMessages,
    refetchInterval: 30_000,
    refetchOnWindowFocus: true,
  })
}

/**
 * Marks a message as read and refreshes related caches.
 */
export function useMarkMessageRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => markMessageRead(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.messages })
      await invalidateOpsCaches(queryClient)
    },
  })
}

/**
 * Deletes a message and refreshes related caches.
 */
export function useDeleteMessage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteMessage(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.messages })
      await invalidateOpsCaches(queryClient)
    },
  })
}
