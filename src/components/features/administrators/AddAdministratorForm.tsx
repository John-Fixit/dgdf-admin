import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Button, Select, SelectItem } from '@heroui/react'
import { useCreateAdministrator } from '@/hooks/useAdministrators'
import { useDrawerStore } from '@/store/drawerStore'
import { Input } from '@/components/ui'

type FormValues = {
  name: string
  email: string
  role: 'admin' | 'viewer'
  password: string
  confirmPassword: string
}

/**
 * Drawer form to create a new administrator.
 */
export function AddAdministratorForm(): React.ReactElement {
  const closeDrawer = useDrawerStore((s) => s.closeDrawer)
  const createMutation = useCreateAdministrator()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: '',
      email: '',
      role: 'admin',
      password: '',
      confirmPassword: '',
    },
  })

  const role = watch('role')
  const password = watch('password')

  useEffect(() => {
    register('role', { required: true })
  }, [register])

  async function onSubmit(values: FormValues): Promise<void> {
    if (values.password !== values.confirmPassword) return

    await createMutation.mutateAsync({
      name: values.name.trim(),
      email: values.email.trim().toLowerCase(),
      role: values.role,
      password: values.password,
    })
    closeDrawer()
  }

  return (
    <form
      className="flex h-full flex-col"
      onSubmit={(e) => {
        void handleSubmit(onSubmit)(e)
      }}
    >
      <div className="flex-1 space-y-5 overflow-y-auto px-1 pb-6">
        <div>
          <label
            htmlFor="admin-name"
            className="mb-1.5 block text-xs font-semibold text-slate-600"
          >
            Full Name
          </label>
          <Input
            id="admin-name"
            placeholder="Jane Doe"
            {...register('name', { required: 'Full name is required' })}
          />
          {errors.name ? (
            <p className="mt-1 text-xs text-rose-600">{errors.name.message}</p>
          ) : null}
        </div>

        <div>
          <label
            htmlFor="admin-email"
            className="mb-1.5 block text-xs font-semibold text-slate-600"
          >
            Email Address
          </label>
          <Input
            id="admin-email"
            type="email"
            placeholder="jane@example.com"
            {...register('email', { required: 'Email is required' })}
          />
          {errors.email ? (
            <p className="mt-1 text-xs text-rose-600">{errors.email.message}</p>
          ) : null}
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-600">
            Role
          </label>
          <Select
            selectedKeys={[role]}
            onSelectionChange={(keys) => {
              const value = Array.from(keys)[0]
              if (value === 'admin' || value === 'viewer') {
                setValue('role', value)
              }
            }}
            classNames={{
              trigger: 'h-11 border border-slate-200 bg-white',
            }}
            aria-label="Role"
          >
            <SelectItem key="admin">Admin</SelectItem>
            <SelectItem key="viewer">Viewer</SelectItem>
          </Select>
          <p className="mt-1.5 text-xs text-slate-400">
            Super Admin accounts cannot be created from this form.
          </p>
        </div>

        <div>
          <label
            htmlFor="admin-password"
            className="mb-1.5 block text-xs font-semibold text-slate-600"
          >
            Temporary Password
          </label>
          <Input
            id="admin-password"
            type="password"
            placeholder="Min. 8 characters"
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 8, message: 'Minimum 8 characters' },
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
            htmlFor="admin-confirm"
            className="mb-1.5 block text-xs font-semibold text-slate-600"
          >
            Confirm Password
          </label>
          <Input
            id="admin-confirm"
            type="password"
            placeholder="Repeat password"
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
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
        <Button
          variant="bordered"
          className="border-slate-200"
          onPress={closeDrawer}
          isDisabled={createMutation.isPending}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-primary font-semibold text-white"
          isLoading={createMutation.isPending}
        >
          Create Administrator
        </Button>
      </div>
    </form>
  )
}
