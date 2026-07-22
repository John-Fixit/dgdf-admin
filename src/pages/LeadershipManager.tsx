import { useMemo } from 'react'
import { addToast, Button } from '@heroui/react'
import { UserPlus } from 'lucide-react'
import { PageHeader } from '@/components/shared'
import {
  LeadershipEmptyState,
  LeadershipErrorState,
  LeadershipForm,
  LeadershipGrid,
  LeadershipSkeleton,
} from '@/components/features/leadership'
import {
  useConfirm,
  useDeleteLeadership,
  useDrawer,
  useLeadership,
  useAuth,
} from '@/hooks'
import { can, PERMISSION_DENIED_MESSAGE } from '@/lib/permissions'
import type { LeadershipMember } from '@/lib/types'

/**
 * Leadership Manager — CRUD for board members shown on the public About page.
 */
export default function LeadershipManager(): React.ReactElement {
  const { data, isLoading, isError, error, refetch, isFetching } =
    useLeadership()
  const deleteMutation = useDeleteLeadership()
  const { open } = useDrawer()
  const { confirm } = useConfirm()
  const { user } = useAuth()
  const canManage = can(user?.role, 'manageContent')

  const members = data ?? []
  const nextSortOrder = useMemo(() => {
    if (members.length === 0) return 1
    return Math.max(...members.map((m) => m.sortOrder)) + 1
  }, [members])

  const publishedCount = members.filter((m) => m.status === 'published').length

  function openCreateDrawer(): void {
    if (!canManage) {
      addToast({ title: PERMISSION_DENIED_MESSAGE, color: 'danger' })
      return
    }
    open({
      title: 'Add Leadership Member',
      description:
        'Create a board or executive profile for the public About page.',
      size: 'lg',
      placement: 'right',
      content: <LeadershipForm nextSortOrder={nextSortOrder} />,
    })
  }

  function openEditDrawer(member: LeadershipMember): void {
    if (!canManage) {
      addToast({ title: PERMISSION_DENIED_MESSAGE, color: 'danger' })
      return
    }
    open({
      title: 'Edit Leadership Member',
      description: `Update ${member.name}'s public profile details.`,
      size: 'lg',
      placement: 'right',
      content: (
        <LeadershipForm member={member} nextSortOrder={nextSortOrder} />
      ),
    })
  }

  async function handleDelete(member: LeadershipMember): Promise<void> {
    if (!canManage) {
      addToast({ title: PERMISSION_DENIED_MESSAGE, color: 'danger' })
      return
    }
    const ok = await confirm({
      title: `Remove ${member.name}?`,
      description:
        'This removes the profile from the leadership list. You can add them again later.',
      confirmLabel: 'Remove',
      cancelLabel: 'Keep',
      variant: 'danger',
    })
    if (!ok) return

    try {
      await deleteMutation.mutateAsync(member.id)
      addToast({
        title: 'Member removed',
        description: `${member.name} was removed from leadership.`,
        color: 'success',
      })
    } catch {
      addToast({
        title: 'Failed to remove. Try again.',
        color: 'danger',
      })
    }
  }

  return (
    <div>
      <PageHeader
        title="Leadership"
        description="Manage the people visitors meet on your About page — names, photos, roles, and bios."
        actionsAlign="end"
        actions={
          <div className="flex flex-wrap items-center gap-3">
            {members.length > 0 ? (
              <div className="hidden items-center gap-3 rounded-xl border border-slate-200/80 bg-white px-4 py-2.5 shadow-ambient sm:flex">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-accent">
                    Profiles
                  </p>
                  <p className="font-display text-lg font-semibold leading-none text-primary">
                    {members.length}
                  </p>
                </div>
                <div className="h-8 w-px bg-slate-200" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-accent">
                    Published
                  </p>
                  <p className="font-display text-lg font-semibold leading-none text-primary">
                    {publishedCount}
                  </p>
                </div>
              </div>
            ) : null}
            {canManage ? (
              <Button
                color="primary"
                className="rounded-lg font-semibold tracking-wide"
                startContent={<UserPlus className="h-4 w-4" />}
                onPress={openCreateDrawer}
              >
                Add member
              </Button>
            ) : null}
          </div>
        }
      />

      {isLoading || (isFetching && !data) ? <LeadershipSkeleton /> : null}

      {isError ? (
        <LeadershipErrorState
          message={
            error instanceof Error
              ? error.message
              : 'Failed to load leadership'
          }
          onRetry={() => void refetch()}
        />
      ) : null}

      {!isLoading && !isError && members.length === 0 ? (
        <LeadershipEmptyState onAdd={canManage ? openCreateDrawer : undefined} />
      ) : null}

      {!isError && members.length > 0 ? (
        <LeadershipGrid
          members={members}
          canManage={canManage}
          onEdit={openEditDrawer}
          onDelete={(member) => void handleDelete(member)}
        />
      ) : null}
    </div>
  )
}
