import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  deleteGalleryItem,
  fetchGallery,
  updateGalleryItem,
  uploadGalleryItem,
} from '@/lib/api'
import { QUERY_KEYS } from '@/lib/constants'
import { invalidateOpsCaches } from '@/lib/invalidateOps'
import type { GalleryUpdatePayload, GalleryUploadPayload } from '@/lib/types'

/**
 * Fetches gallery items via TanStack Query.
 */
export function useGallery() {
  return useQuery({
    queryKey: QUERY_KEYS.gallery,
    queryFn: fetchGallery,
  })
}

/**
 * Mutation to upload a new gallery item with cache invalidation.
 */
export function useUploadGallery() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: GalleryUploadPayload) => uploadGalleryItem(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.gallery })
      await invalidateOpsCaches(queryClient)
    },
  })
}

/**
 * Mutation to update an existing gallery item.
 */
export function useUpdateGallery() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: GalleryUpdatePayload
    }) => updateGalleryItem(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.gallery })
      await invalidateOpsCaches(queryClient)
    },
  })
}

/**
 * Mutation to delete a gallery item with cache invalidation.
 */
export function useDeleteGallery() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteGalleryItem(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.gallery })
      await invalidateOpsCaches(queryClient)
    },
  })
}
