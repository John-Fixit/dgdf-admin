import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Button, Pagination, addToast } from '@heroui/react'
import { Trash2 } from 'lucide-react'
import { LoadingSpinner, PageHeader } from '@/components/shared'
import {
  AuditFilterBar,
  type AuditFiltersState,
  AuditTimeline,
} from '@/components/features/audit'
import { useAuditLogs, useAuth, useConfirm } from '@/hooks'
import { useDeleteAuditLogs } from '@/hooks/useAuditLogActions'
import { can, PERMISSION_DENIED_MESSAGE } from '@/lib/permissions'
import type { AuditLogFilters } from '@/lib/types'

const EASE = [0.22, 1, 0.36, 1] as const
const PAGE_SIZE = 15

const EMPTY_FILTERS: AuditFiltersState = {
  search: '',
  adminName: '',
  from: '',
  to: '',
}

/**
 * Admin audit trail with search, date filters, and pagination.
 */
export default function AuditLog(): React.ReactElement {
  const { user } = useAuth()
  const { confirm } = useConfirm()
  const deleteMutation = useDeleteAuditLogs()
  const [page, setPage] = useState(1)
  const [draft, setDraft] = useState<AuditFiltersState>(EMPTY_FILTERS)
  const [applied, setApplied] = useState<AuditFiltersState>(EMPTY_FILTERS)

  // Apply search/admin filters with a light debounce via sync on change for dates,
  // and apply text filters when they change (controlled from bar).
  const filters = useMemo<AuditLogFilters>(
    () => ({
      search: applied.search.trim() || undefined,
      adminName: applied.adminName.trim() || undefined,
      from: dateToIsoStart(applied.from),
      to: dateToIsoEnd(applied.to),
      page,
      limit: PAGE_SIZE,
    }),
    [applied, page],
  )

  const { data, isLoading, isError, error, refetch, isFetching } =
    useAuditLogs(filters)

  const canDelete = can(user?.role, 'deleteAuditLog')
  const total = data?.total ?? 0
  const pageCount = Math.max(1, data?.pageCount ?? Math.ceil(total / PAGE_SIZE))
  const safePage = Math.min(page, pageCount)

  function handleFilterChange(next: AuditFiltersState): void {
    setDraft(next)
    setApplied(next)
    setPage(1)
  }

  function handleClearFilters(): void {
    setDraft(EMPTY_FILTERS)
    setApplied(EMPTY_FILTERS)
    setPage(1)
  }

  async function handleClearLogs(): Promise<void> {
    if (!canDelete) {
      addToast({ title: PERMISSION_DENIED_MESSAGE, color: 'danger' })
      return
    }
    const confirmed = await confirm({
      title: 'Clear all audit logs?',
      description:
        'This permanently deletes every audit log entry. This cannot be undone.',
      confirmLabel: 'Clear logs',
      cancelLabel: 'Cancel',
      variant: 'danger',
    })
    if (!confirmed) return
    await deleteMutation.mutateAsync()
    setPage(1)
  }

  if (isLoading) {
    return <LoadingSpinner label="Loading audit log…" />
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-error/20 bg-error/5 p-8 text-center">
        <p className="mb-3 text-sm text-error">
          {error instanceof Error ? error.message : 'Failed to load audit log'}
        </p>
        <Button variant="bordered" size="sm" onPress={() => void refetch()}>
          Try again
        </Button>
      </div>
    )
  }

  const items = data?.items ?? []

  return (
    <div>
      <PageHeader
        title="Audit Log"
        description="Track actions performed in the management console"
        actions={
          canDelete ? (
            <Button
              variant="bordered"
              className="border-rose-200 text-rose-600"
              startContent={<Trash2 className="h-4 w-4" />}
              onPress={() => {
                void handleClearLogs()
              }}
              isLoading={deleteMutation.isPending}
            >
              Clear logs
            </Button>
          ) : undefined
        }
      />

      <AuditFilterBar
        filters={draft}
        onChange={handleFilterChange}
        onClear={handleClearFilters}
      />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: EASE }}
        className={isFetching ? 'opacity-70 transition-opacity' : undefined}
      >
        <AuditTimeline items={items} />
      </motion.div>

      <div className="mt-5 flex flex-col items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white px-6 py-4 shadow-card sm:flex-row sm:px-8">
        <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400">
          Page {safePage} of {pageCount}
          {total > 0 ? ` · ${total.toLocaleString('en-NG')} entries` : ''}
        </span>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="bordered"
            className="border-slate-200"
            isDisabled={safePage <= 1}
            onPress={() => setPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </Button>
          <Pagination
            page={safePage}
            total={pageCount}
            onChange={setPage}
            showControls={false}
            color="primary"
            classNames={{
              cursor: 'bg-primary text-white font-bold',
              item: 'border border-slate-200 bg-white',
            }}
          />
          <Button
            size="sm"
            variant="bordered"
            className="border-slate-200"
            isDisabled={safePage >= pageCount}
            onPress={() => setPage((p) => Math.min(pageCount, p + 1))}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

/**
 * Converts a date input (YYYY-MM-DD) to start-of-day ISO.
 */
function dateToIsoStart(value: string): string | undefined {
  if (!value.trim()) return undefined
  const date = new Date(`${value}T00:00:00`)
  if (Number.isNaN(date.getTime())) return undefined
  return date.toISOString()
}

/**
 * Converts a date input (YYYY-MM-DD) to end-of-day ISO.
 */
function dateToIsoEnd(value: string): string | undefined {
  if (!value.trim()) return undefined
  const date = new Date(`${value}T23:59:59.999`)
  if (Number.isNaN(date.getTime())) return undefined
  return date.toISOString()
}
