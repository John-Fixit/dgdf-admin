import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { addToast, Button } from '@heroui/react'
import { Save } from 'lucide-react'
import { SettingsField, fieldClass } from './SettingsField'
import { useUpdateSiteSettingsSection } from '@/hooks'
import { useDrawerStore } from '@/store/drawerStore'
import { cn } from '@/lib/utils'
import type { SiteSettings } from '@/lib/types'

interface ContactSettingsFormProps {
  values: SiteSettings['contact']
}

type FormValues = SiteSettings['contact']

/**
 * Drawer form for editing public contact details.
 */
export function ContactSettingsForm({
  values,
}: ContactSettingsFormProps): React.ReactElement {
  const closeDrawer = useDrawerStore((s) => s.closeDrawer)
  const mutation = useUpdateSiteSettingsSection()
  const { register, handleSubmit, watch, reset, formState } =
    useForm<FormValues>({
      defaultValues: values,
    })

  useEffect(() => {
    reset(values)
  }, [values, reset])

  const phone = watch('phone') ?? ''
  const email = watch('email') ?? ''
  const address = watch('address') ?? ''
  const officeHours = watch('officeHours') ?? ''

  const submit = handleSubmit(async (data) => {
    try {
      await mutation.mutateAsync({
        section: 'contact',
        data: {
          phone: data.phone.trim(),
          email: data.email.trim(),
          address: data.address.trim(),
          officeHours: data.officeHours.trim(),
        },
      })
      addToast({
        title: 'Changes saved',
        description: 'Contact details updated successfully',
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
        <div className="grid grid-cols-1 gap-5">
          <SettingsField
            id="contact-phone"
            label="Phone Number"
            helper="Primary public phone number"
            maxLength={40}
            count={phone.length}
          >
            <input
              id="contact-phone"
              maxLength={40}
              className={fieldClass}
              {...register('phone')}
            />
          </SettingsField>

          <SettingsField
            id="contact-email"
            label="Email Address"
            helper="Primary public inbox for inquiries"
            maxLength={80}
            count={email.length}
          >
            <input
              id="contact-email"
              type="email"
              maxLength={80}
              className={fieldClass}
              {...register('email')}
            />
          </SettingsField>
        </div>

        <SettingsField
          id="contact-address"
          label="Physical Address"
          helper="Office address — line breaks are preserved on the public site"
          maxLength={200}
          count={address.length}
        >
          <textarea
            id="contact-address"
            rows={3}
            maxLength={200}
            className={cn(fieldClass, 'h-auto resize-y py-3')}
            {...register('address')}
          />
        </SettingsField>

        <SettingsField
          id="contact-hours"
          label="Office Hours"
          helper="Hours of operation shown to visitors"
          maxLength={80}
          count={officeHours.length}
        >
          <input
            id="contact-hours"
            maxLength={80}
            className={fieldClass}
            {...register('officeHours')}
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
          Save contact
        </Button>
      </div>
    </form>
  )
}
