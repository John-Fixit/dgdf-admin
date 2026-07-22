import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Button, Select, SelectItem, Textarea } from '@heroui/react'
import { useUpdateAdministratorRole } from '@/hooks/useAdministrators'
import { useDrawerStore } from '@/store/drawerStore'
import type { Administrator } from '@/lib/types'

interface EditRoleFormProps {
  administrator: Administrator
}

type FormValues = {
  role: 'admin' | 'viewer'
  reason: string
}

/**
 * Drawer form to change an administrator's role.
 */
export function EditRoleForm({
  administrator,
}: EditRoleFormProps): React.ReactElement {
  const closeDrawer = useDrawerStore((s) => s.closeDrawer)
  const updateMutation = useUpdateAdministratorRole()

  const initialRole: 'admin' | 'viewer' =
    administrator.role === 'viewer' ? 'viewer' : 'admin'

  const { register, handleSubmit, watch, setValue } = useForm<FormValues>({
    defaultValues: {
      role: initialRole,
      reason: '',
    },
  })

  const role = watch('role')

  useEffect(() => {
    register('role', { required: true })
  }, [register])

  async function onSubmit(values: FormValues): Promise<void> {
    await updateMutation.mutateAsync({
      id: administrator.id,
      payload: {
        role: values.role,
        reason: values.reason.trim() || undefined,
      },
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
        <div className="rounded-lg border border-slate-100 bg-slate-50 px-4 py-3">
          <p className="text-sm font-semibold text-primary">
            {administrator.name}
          </p>
          <p className="text-xs text-slate-500">{administrator.email}</p>
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
        </div>

        <div>
          <label
            htmlFor="role-reason"
            className="mb-1.5 block text-xs font-semibold text-slate-600"
          >
            Reason for change{' '}
            <span className="font-normal text-slate-400">(optional)</span>
          </label>
          <Textarea
            id="role-reason"
            minRows={3}
            placeholder="Why is this role changing?"
            classNames={{
              inputWrapper: 'border border-slate-200 bg-white',
            }}
            {...register('reason')}
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
        <Button
          variant="bordered"
          className="border-slate-200"
          onPress={closeDrawer}
          isDisabled={updateMutation.isPending}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-primary font-semibold text-white"
          isLoading={updateMutation.isPending}
        >
          Save Role
        </Button>
      </div>
    </form>
  )
}
