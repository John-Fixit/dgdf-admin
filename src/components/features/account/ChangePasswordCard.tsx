import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { addToast, Button } from '@heroui/react'
import { KeyRound } from 'lucide-react'
import { SettingsField, fieldClass } from '@/components/features/settings'
import { useChangePassword } from '@/hooks'
import { cn } from '@/lib/utils'

const EASE = [0.22, 1, 0.36, 1] as const

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'New password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'New password must be different from current password',
    path: ['newPassword'],
  })

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>

interface ChangePasswordCardProps {
  index?: number
}

/**
 * Account settings card for updating the admin password.
 */
export function ChangePasswordCard({
  index = 0,
}: ChangePasswordCardProps): React.ReactElement {
  const mutation = useChangePassword()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  const submit = handleSubmit(async (data) => {
    try {
      await mutation.mutateAsync({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      })
      reset()
      addToast({
        title: 'Password updated successfully',
        color: 'success',
      })
    } catch (err) {
      addToast({
        title:
          err instanceof Error ? err.message : 'Failed to update password',
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
          Security
        </p>
        <h2 className="mt-1.5 font-display text-xl font-semibold text-primary">
          Change Password
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Update your password to keep your admin account secure
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
          id="current-password"
          label="Current Password"
          helper="Enter your existing password to confirm this change"
        >
          <input
            id="current-password"
            type="password"
            autoComplete="current-password"
            className={cn(fieldClass, errors.currentPassword && 'border-error')}
            {...register('currentPassword')}
          />
          {errors.currentPassword ? (
            <p className="text-xs text-error">{errors.currentPassword.message}</p>
          ) : null}
        </SettingsField>

        <SettingsField
          id="new-password"
          label="New Password"
          helper="Must be at least 8 characters and different from your current password"
        >
          <input
            id="new-password"
            type="password"
            autoComplete="new-password"
            className={cn(fieldClass, errors.newPassword && 'border-error')}
            {...register('newPassword')}
          />
          {errors.newPassword ? (
            <p className="text-xs text-error">{errors.newPassword.message}</p>
          ) : null}
        </SettingsField>

        <SettingsField
          id="confirm-password"
          label="Confirm New Password"
          helper="Re-enter your new password to confirm"
        >
          <input
            id="confirm-password"
            type="password"
            autoComplete="new-password"
            className={cn(fieldClass, errors.confirmPassword && 'border-error')}
            {...register('confirmPassword')}
          />
          {errors.confirmPassword ? (
            <p className="text-xs text-error">{errors.confirmPassword.message}</p>
          ) : null}
        </SettingsField>

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            color="primary"
            className="rounded-lg font-semibold"
            isLoading={mutation.isPending}
            isDisabled={!isDirty}
            startContent={
              mutation.isPending ? null : <KeyRound className="h-4 w-4" />
            }
          >
            Update Password
          </Button>
        </div>
      </form>
    </motion.section>
  )
}
