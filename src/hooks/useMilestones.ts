import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createMilestone,
  deleteMilestone,
  fetchMilestones,
  updateMilestone,
} from '@/lib/api'
import { QUERY_KEYS } from '@/lib/constants'
import { invalidateOpsCaches } from '@/lib/invalidateOps'
import type { MilestonePayload } from '@/lib/types'

/**
 * Loads timeline milestones for the admin Timeline manager.
 */
export function useMilestones() {
  return useQuery({
    queryKey: QUERY_KEYS.milestones,
    queryFn: fetchMilestones,
  })
}

/**
 * Creates a milestone and refreshes the list.
 */
export function useCreateMilestone() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: MilestonePayload) => createMilestone(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.milestones })
      await invalidateOpsCaches(queryClient)
    },
  })
}

/**
 * Updates a milestone and refreshes the list.
 */
export function useUpdateMilestone() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: Partial<MilestonePayload>
    }) => updateMilestone(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.milestones })
      await invalidateOpsCaches(queryClient)
    },
  })
}

/**
 * Deletes a milestone and refreshes the list.
 */
export function useDeleteMilestone() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteMilestone(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.milestones })
      await invalidateOpsCaches(queryClient)
    },
  })
}
