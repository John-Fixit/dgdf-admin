import { useForm } from 'react-hook-form'
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/react'
import { AlertTriangle } from 'lucide-react'
import { Input } from '@/components/ui'
import { useResetAdministratorPassword } from '@/hooks/useAdministrators'
import type { Administrator } from '@/lib/types'

interface ResetPasswordModalProps {
  administrator: Administrator | null
  isOpen: boolean
  onClose: () => void
}

type FormValues = {
  password: string
  confirmPassword: string
}

/**
 * Modal to reset an administrator's password.
 */
export function ResetPasswordModal({
  administrator,
  isOpen,
  onClose,
}: ResetPasswordModalProps): React.ReactElement {
  const resetMutation = useResetAdministratorPassword()
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { password: '', confirmPassword: '' },
  })

  const password = watch('password')

  function handleClose(): void {
    reset()
    onClose()
  }

  async function onSubmit(values: FormValues): Promise<void> {
    if (!administrator) return
    await resetMutation.mutateAsync({
      id: administrator.id,
      payload: { password: values.password },
    })
    handleClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose()
      }}
      placement="center"
      backdrop="blur"
      classNames={{
        base: 'bg-white',
        header: 'border-b border-slate-100',
        footer: 'border-t border-slate-100',
      }}
    >
      <ModalContent>
        {() => (
          <form
            onSubmit={(e) => {
              void handleSubmit(onSubmit)(e)
            }}
          >
            <ModalHeader className="flex flex-col gap-1">
              <span className="font-display text-lg font-semibold text-primary">
                Reset Password
              </span>
              {administrator ? (
                <span className="text-sm font-normal text-slate-500">
                  {administrator.name} · {administrator.email}
                </span>
              ) : null}
            </ModalHeader>
            <ModalBody className="space-y-4 py-5">
              <div className="flex gap-3 rounded-lg border border-amber-200 bg-amber-50 px-3.5 py-3 text-sm text-amber-900">
                <AlertTriangle
                  className="mt-0.5 h-4 w-4 shrink-0"
                  aria-hidden
                />
                <p>
                  This will immediately log out the administrator and require
                  them to login with the new password
                </p>
              </div>

              <div>
                <label
                  htmlFor="reset-password"
                  className="mb-1.5 block text-xs font-semibold text-slate-600"
                >
                  New Password
                </label>
                <Input
                  id="reset-password"
                  type="password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 8,
                      message: 'Minimum 8 characters',
                    },
                  })}
                />
                {errors.password ? (
                  <p className="mt-1 text-xs text-rose-600">
                    {errors.password.message}
                  </p>
                ) : null}
              </div>

              <div>
                <label
                  htmlFor="reset-confirm"
                  className="mb-1.5 block text-xs font-semibold text-slate-600"
                >
                  Confirm Password
                </label>
                <Input
                  id="reset-confirm"
                  type="password"
                  {...register('confirmPassword', {
                    required: 'Please confirm the password',
                    validate: (value) =>
                      value === password || 'Passwords do not match',
                  })}
                />
                {errors.confirmPassword ? (
                  <p className="mt-1 text-xs text-rose-600">
                    {errors.confirmPassword.message}
                  </p>
                ) : null}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                variant="bordered"
                className="border-slate-200"
                onPress={handleClose}
                isDisabled={resetMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-rose-600 font-semibold text-white"
                isLoading={resetMutation.isPending}
              >
                Reset Password
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  )
}
