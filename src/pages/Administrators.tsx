import { useState } from 'react'
import { Button } from '@heroui/react'
import { UserPlus } from 'lucide-react'
import { Navigate } from 'react-router-dom'
import { LoadingSpinner, PageHeader } from '@/components/shared'
import {
  AddAdministratorForm,
  AdministratorStatsRow,
  AdministratorsTable,
  EditRoleForm,
  ResetPasswordModal,
} from '@/components/features/administrators'
import {
  useAdministrators,
  useUpdateAdministratorStatus,
} from '@/hooks/useAdministrators'
import { useAuth, useConfirm, useDrawer } from '@/hooks'
import { can, PERMISSION_DENIED_MESSAGE } from '@/lib/permissions'
import { addToast } from '@heroui/react'
import type { Administrator } from '@/lib/types'

/**
 * Administrators management page.
 */
export default function Administrators(): React.ReactElement {
  const { user } = useAuth()
  const { open } = useDrawer()
  const { confirm } = useConfirm()
  const { data, isLoading, isError, error, refetch } = useAdministrators()
  const statusMutation = useUpdateAdministratorStatus()
  const [resetTarget, setResetTarget] = useState<Administrator | null>(null)

  const canView = can(user?.role, 'viewAdmins')
  const canManage = can(user?.role, 'manageAdmins')

  if (!canView) {
    return <Navigate to="/dashboard" replace />
  }

  function openAddDrawer(): void {
    if (!canManage) {
      addToast({ title: PERMISSION_DENIED_MESSAGE, color: 'danger' })
      return
    }
    open({
      title: 'Add Administrator',
      description: 'Create a new account for the management console',
      size: 'lg',
      placement: 'right',
      content: <AddAdministratorForm />,
    })
  }

  function openEditRole(admin: Administrator): void {
    if (!canManage) {
      addToast({ title: PERMISSION_DENIED_MESSAGE, color: 'danger' })
      return
    }
    open({
      title: 'Edit Role',
      description: `Update access for ${admin.name}`,
      size: 'md',
      placement: 'right',
      content: <EditRoleForm administrator={admin} />,
    })
  }

  async function handleToggleStatus(admin: Administrator): Promise<void> {
    if (!canManage) {
      addToast({ title: PERMISSION_DENIED_MESSAGE, color: 'danger' })
      return
    }

    const nextStatus = admin.status === 'active' ? 'inactive' : 'active'
    const confirmed = await confirm({
      title: nextStatus === 'inactive' ? 'Deactivate administrator?' : 'Reactivate administrator?',
      description:
        nextStatus === 'inactive'
          ? `${admin.name} will no longer be able to sign in.`
          : `${admin.name} will regain access to the management console.`,
      confirmLabel: nextStatus === 'inactive' ? 'Deactivate' : 'Reactivate',
      cancelLabel: 'Cancel',
      variant: nextStatus === 'inactive' ? 'danger' : 'primary',
    })
    if (!confirmed) return

    await statusMutation.mutateAsync({
      id: admin.id,
      payload: { status: nextStatus },
    })
  }

  if (isLoading) {
    return <LoadingSpinner label="Loading administrators…" />
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-error/20 bg-error/5 p-8 text-center">
        <p className="mb-3 text-sm text-error">
          {error instanceof Error
            ? error.message
            : 'Failed to load administrators'}
        </p>
        <Button variant="bordered" size="sm" onPress={() => void refetch()}>
          Try again
        </Button>
      </div>
    )
  }

  const items = data?.items ?? []
  const stats = data?.stats ?? { total: 0, active: 0, viewers: 0 }

  return (
    <div>
      <PageHeader
        title="Administrators"
        description="Manage who has access to this management console"
        actions={
          canManage ? (
            <Button
              className="bg-primary font-semibold text-white"
              startContent={<UserPlus className="h-4 w-4" />}
              onPress={openAddDrawer}
            >
              Add Administrator
            </Button>
          ) : undefined
        }
      />

      <AdministratorStatsRow stats={stats} />

      <AdministratorsTable
        items={items}
        canManage={canManage}
        onEditRole={openEditRole}
        onResetPassword={(admin) => {
          if (!canManage) {
            addToast({ title: PERMISSION_DENIED_MESSAGE, color: 'danger' })
            return
          }
          setResetTarget(admin)
        }}
        onToggleStatus={(admin) => {
          void handleToggleStatus(admin)
        }}
      />

      <ResetPasswordModal
        administrator={resetTarget}
        isOpen={resetTarget !== null}
        onClose={() => setResetTarget(null)}
      />
    </div>
  )
}
