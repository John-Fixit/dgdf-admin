import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchContent, updateContent } from '@/lib/api'
import { QUERY_KEYS } from '@/lib/constants'
import type { SiteContentDocument } from '@/lib/types'

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
 * Persists the content document and refreshes related queries.
 */
export function useUpdateContent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: SiteContentDocument) => updateContent(payload),
    onSuccess: async (data) => {
      queryClient.setQueryData(QUERY_KEYS.content, data)
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard })
    },
  })
}
