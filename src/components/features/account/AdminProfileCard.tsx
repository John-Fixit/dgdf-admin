import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { addToast, Button } from '@heroui/react'
import { Save } from 'lucide-react'
import { SettingsField, fieldClass } from '@/components/features/settings'
import { useAuth, useUpdateProfile } from '@/hooks'
import { cn } from '@/lib/utils'

const EASE = [0.22, 1, 0.36, 1] as const

const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Full name is required')
    .max(100, 'Name must be 100 characters or fewer'),
  email: z.string(),
  role: z.string(),
})

type ProfileFormValues = z.infer<typeof profileSchema>

interface AdminProfileCardProps {
  index?: number
}

/**
 * Account settings card for editing the admin display name.
 */
export function AdminProfileCard({
  index = 0,
}: AdminProfileCardProps): React.ReactElement {
  const { user } = useAuth()
  const mutation = useUpdateProfile()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name ?? '',
      email: user?.email ?? '',
      role: 'Administrator',
    },
  })

  useEffect(() => {
    reset({
      name: user?.name ?? '',
      email: user?.email ?? '',
      role: 'Administrator',
    })
  }, [user?.name, user?.email, reset])

  const submit = handleSubmit(async (data) => {
    try {
      await mutation.mutateAsync({ name: data.name.trim() })
      addToast({
        title: 'Profile updated',
        color: 'success',
      })
    } catch (err) {
      addToast({
        title:
          err instanceof Error ? err.message : 'Failed to update profile',
        color: 'danger',
      })
    }
  })

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05, ease: EASE }}
      className="rounded-[14px] border border-slate-200/80 bg-white p-6 shadow-ambient sm:p-7"
    >
      <header className="mb-6 border-b border-slate-100 pb-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-accent">
          Account
        </p>
        <h2 className="mt-1.5 font-display text-xl font-semibold text-primary">
          Admin Profile
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Update how your name appears across the admin portal
        </p>
      </header>

      <form
        className="space-y-5"
        onSubmit={(event) => {
          event.preventDefault()
          void submit()
        }}
      >
        <SettingsField
          id="profile-name"
          label="Full Name"
          helper="Display name shown in the sidebar and activity logs"
        >
          <input
            id="profile-name"
            type="text"
            autoComplete="name"
            className={cn(fieldClass, errors.name && 'border-error')}
            {...register('name')}
          />
          {errors.name ? (
            <p className="text-xs text-error">{errors.name.message}</p>
          ) : null}
        </SettingsField>

        <SettingsField
          id="profile-email"
          label="Email Address"
          helper="Email cannot be changed for security"
        >
          <input
            id="profile-email"
            type="email"
            readOnly
            className={cn(
              fieldClass,
              'cursor-not-allowed bg-slate-50 text-slate-500',
            )}
            {...register('email')}
          />
        </SettingsField>

        <SettingsField
          id="profile-role"
          label="Role"
          helper="Your access level in the admin portal"
        >
          <input
            id="profile-role"
            type="text"
            readOnly
            className={cn(
              fieldClass,
              'cursor-not-allowed bg-slate-50 text-slate-500',
            )}
            {...register('role')}
          />
        </SettingsField>

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            color="primary"
            className="rounded-lg font-semibold"
            isLoading={mutation.isPending}
            isDisabled={!isDirty}
            startContent={
              mutation.isPending ? null : <Save className="h-4 w-4" />
            }
          >
            Save Profile
          </Button>
        </div>
      </form>
    </motion.section>
  )
}
