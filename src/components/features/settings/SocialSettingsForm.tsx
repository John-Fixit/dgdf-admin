import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { addToast, Button } from '@heroui/react'
import { Save } from 'lucide-react'
import { SettingsField, fieldClass } from './SettingsField'
import { useUpdateSiteSettingsSection } from '@/hooks'
import { useDrawerStore } from '@/store/drawerStore'
import type { SiteSettings } from '@/lib/types'

interface SocialSettingsFormProps {
  values: SiteSettings['social']
}

type FormValues = SiteSettings['social']

/**
 * Drawer form for editing social media profile URLs.
 */
export function SocialSettingsForm({
  values,
}: SocialSettingsFormProps): React.ReactElement {
  const closeDrawer = useDrawerStore((s) => s.closeDrawer)
  const mutation = useUpdateSiteSettingsSection()
  const { register, handleSubmit, reset, formState } = useForm<FormValues>({
    defaultValues: values,
  })

  useEffect(() => {
    reset(values)
  }, [values, reset])

  const submit = handleSubmit(async (data) => {
    try {
      await mutation.mutateAsync({
        section: 'social',
        data: {
          facebook: data.facebook.trim(),
          instagram: data.instagram.trim(),
          youtube: data.youtube.trim(),
          twitter: data.twitter.trim(),
        },
      })
      addToast({
        title: 'Changes saved',
        description: 'Social links updated successfully',
        color: 'success',
      })
      closeDrawer()
    } catch {
      addToast({
        title: 'Failed to save. Try again.',
        color: 'danger',
      })
    }
  })

  return (
    <form
      className="flex h-full flex-col"
      onSubmit={(event) => {
        event.preventDefault()
        void submit()
      }}
    >
      <div className="flex-1 space-y-5 overflow-y-auto px-1 pb-6">
        <SettingsField
          id="social-facebook"
          label="Facebook URL"
          helper="Full Facebook page URL"
        >
          <input
            id="social-facebook"
            type="url"
            placeholder="https://facebook.com/…"
            className={fieldClass}
            {...register('facebook')}
          />
        </SettingsField>

        <SettingsField
          id="social-instagram"
          label="Instagram URL"
          helper="Full Instagram profile URL"
        >
          <input
            id="social-instagram"
            type="url"
            placeholder="https://instagram.com/…"
            className={fieldClass}
            {...register('instagram')}
          />
        </SettingsField>

        <SettingsField
          id="social-youtube"
          label="YouTube URL"
          helper="Full YouTube channel URL"
        >
          <input
            id="social-youtube"
            type="url"
            placeholder="https://youtube.com/…"
            className={fieldClass}
            {...register('youtube')}
          />
        </SettingsField>

        <SettingsField
          id="social-twitter"
          label="Twitter / X URL"
          helper="Full Twitter or X profile URL"
        >
          <input
            id="social-twitter"
            type="url"
            placeholder="https://twitter.com/…"
            className={fieldClass}
            {...register('twitter')}
          />
        </SettingsField>
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
        <Button
          variant="bordered"
          className="border-slate-200"
          onPress={closeDrawer}
          isDisabled={mutation.isPending}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          color="primary"
          className="rounded-lg font-semibold"
          isLoading={mutation.isPending}
          isDisabled={!formState.isDirty}
          startContent={
            mutation.isPending ? null : <Save className="h-4 w-4" />
          }
        >
          Save social links
        </Button>
      </div>
    </form>
  )
}
