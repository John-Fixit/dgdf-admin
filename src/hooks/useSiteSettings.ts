import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchSiteSettings, updateSiteSettingsSection } from '@/lib/api'
import { QUERY_KEYS } from '@/lib/constants'
import { invalidateOpsCaches } from '@/lib/invalidateOps'
import type { UpdateSiteSettingsSectionPayload } from '@/lib/types'

/**
 * Loads global site settings.
 */
export function useSiteSettings() {
  return useQuery({
    queryKey: QUERY_KEYS.settings,
    queryFn: fetchSiteSettings,
  })
}

/**
 * Saves one site-settings section and refreshes the settings query.
 */
export function useUpdateSiteSettingsSection() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateSiteSettingsSectionPayload) =>
      updateSiteSettingsSection(payload),
    onSuccess: async (data) => {
      queryClient.setQueryData(QUERY_KEYS.settings, data)
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.settings })
      await invalidateOpsCaches(queryClient)
    },
  })
}
