import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchContent, updateContentSection } from '@/lib/api'
import { QUERY_KEYS } from '@/lib/constants'
import { invalidateOpsCaches } from '@/lib/invalidateOps'
import type { UpdateContentSectionPayload } from '@/lib/types'

/**
 * Loads the full public-site content document.
 */
export function useContent() {
  return useQuery({
    queryKey: QUERY_KEYS.content,
    queryFn: fetchContent,
  })
}

/**
 * Persists a single content section and refreshes the content query.
 */
export function useUpdateContentSection() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateContentSectionPayload) =>
      updateContentSection(payload),
    onSuccess: async (data) => {
      queryClient.setQueryData(QUERY_KEYS.content, data)
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.content })
      await invalidateOpsCaches(queryClient)
    },
  })
}
