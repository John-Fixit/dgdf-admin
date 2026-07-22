import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createLeadershipMember,
  deleteLeadershipMember,
  fetchLeadership,
  updateLeadershipMember,
} from '@/lib/api'
import { QUERY_KEYS } from '@/lib/constants'
import { invalidateOpsCaches } from '@/lib/invalidateOps'
import type { LeadershipMemberPayload } from '@/lib/types'

/**
 * Loads leadership members for the admin Leadership Manager.
 */
export function useLeadership() {
  return useQuery({
    queryKey: QUERY_KEYS.leadership,
    queryFn: fetchLeadership,
  })
}

/**
 * Creates a leadership member and refreshes the list.
 */
export function useCreateLeadership() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: LeadershipMemberPayload) =>
      createLeadershipMember(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.leadership })
      await invalidateOpsCaches(queryClient)
    },
  })
}

/**
 * Updates a leadership member and refreshes the list.
 */
export function useUpdateLeadership() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: LeadershipMemberPayload
    }) => updateLeadershipMember(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.leadership })
      await invalidateOpsCaches(queryClient)
    },
  })
}

/**
 * Deletes a leadership member and refreshes the list.
 */
export function useDeleteLeadership() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteLeadershipMember(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.leadership })
      await invalidateOpsCaches(queryClient)
    },
  })
}
