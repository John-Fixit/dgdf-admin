import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Input, Pagination, addToast } from '@heroui/react'
import { Search } from 'lucide-react'
import {
  useConfirm,
  useDeleteGallery,
  useDrawer,
  useGallery,
} from '@/hooks'
import { PERMISSION_DENIED_MESSAGE } from '@/lib/permissions'
import type { GalleryItem } from '@/lib/types'
import { GalleryCard } from './GalleryCard'
import { GalleryEditForm } from './GalleryEditForm'
import { GallerySkeleton } from './GallerySkeleton'
import { GalleryEmptyState, GalleryErrorState } from './GalleryStates'
import { GalleryUploadForm } from './GalleryUploadForm'
import { GalleryViewPanel } from './GalleryViewPanel'

const PAGE_SIZE = 9
const EASE = [0.22, 1, 0.36, 1] as const

type StatusFilter = 'all' | GalleryItem['status']

interface GalleryGridProps {
  canManage?: boolean
}

/**
 * Gallery manager grid with search, status filter, and pagination.
 */
export function GalleryGrid({
  canManage = true,
}: GalleryGridProps): React.ReactElement {
  const { data, isLoading, isError, error, refetch, isFetching } = useGallery()
  const deleteMutation = useDeleteGallery()
  const { open } = useDrawer()
  const { confirm } = useConfirm()

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [page, setPage] = useState(1)

  const items = data ?? []

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return items
      .filter((item) => {
        if (statusFilter !== 'all' && item.status !== statusFilter) return false
        if (!q) return true
        return (
          item.title.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.location?.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q)
        )
      })
      .sort((a, b) => a.sortOrder - b.sortOrder)
  }, [items, search, statusFilter])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, pageCount)
  const pageItems = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  )

  function openUploadDrawer(): void {
    if (!canManage) {
      addToast({ title: PERMISSION_DENIED_MESSAGE, color: 'danger' })
      return
    }
    open({
      title: 'Add Gallery Media',
      description:
        'Upload photos or videos, set defaults, then review before saving.',
      size: '2xl',
      content: <GalleryUploadForm />,
    })
  }

  function openViewDrawer(item: GalleryItem): void {
    open({
      title: item.title,
      description: [item.category, item.location].filter(Boolean).join(' · '),
      size: 'lg',
      content: <GalleryViewPanel item={item} />,
    })
  }

  function openEditDrawer(item: GalleryItem): void {
    if (!canManage) {
      addToast({ title: PERMISSION_DENIED_MESSAGE, color: 'danger' })
      return
    }
    open({
      title: 'Edit Gallery Asset',
      description: 'Update media details, status, and display order.',
      size: 'lg',
      content: <GalleryEditForm item={item} />,
    })
  }

  async function handleDelete(item: GalleryItem): Promise<void> {
    if (!canManage) {
      addToast({ title: PERMISSION_DENIED_MESSAGE, color: 'danger' })
      return
    }
    const confirmed = await confirm({
      title: 'Remove media?',
      description: `Remove “${item.title}” from the gallery? This cannot be undone.`,
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
      variant: 'danger',
    })
    if (!confirmed) return

    try {
      await deleteMutation.mutateAsync(item.id)
      addToast({
        title: 'Media removed',
        description: 'The gallery has been updated.',
        color: 'success',
      })
    } catch (err) {
      addToast({
        title: 'Failed to remove. Try again.',
        description: err instanceof Error ? err.message : undefined,
        color: 'danger',
      })
    }
  }

  if (isLoading || (isFetching && !data)) {
    return <GallerySkeleton />
  }

  if (isError) {
    return (
      <GalleryErrorState
        message={
          error instanceof Error ? error.message : 'Failed to load gallery'
        }
        onRetry={() => void refetch()}
      />
    )
  }

  const showingFrom =
    filtered.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1
  const showingTo = Math.min(safePage * PAGE_SIZE, filtered.length)
  const hasFilters = Boolean(search.trim()) || statusFilter !== 'all'

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: EASE }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex flex-wrap gap-2">
          {(
            [
              { key: 'all', label: 'All' },
              { key: 'active', label: 'Published' },
              { key: 'draft', label: 'Draft' },
              { key: 'archived', label: 'Archived' },
            ] as const
          ).map((option) => {
            const active = statusFilter === option.key
            return (
              <button
                key={option.key}
                type="button"
                onClick={() => {
                  setStatusFilter(option.key)
                  setPage(1)
                }}
                className={
                  active
                    ? 'rounded-lg bg-primary px-3.5 py-2 text-xs font-semibold text-white'
                    : 'rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-500 transition-colors hover:border-primary/30 hover:text-primary'
                }
              >
                {option.label}
              </button>
            )
          })}
        </div>

        <Input
          value={search}
          onValueChange={(value) => {
            setSearch(value)
            setPage(1)
          }}
          placeholder="Search title, category, location…"
          startContent={<Search className="h-4 w-4 text-slate-400" />}
          classNames={{
            base: 'w-full sm:w-72',
            inputWrapper:
              'h-11 rounded-lg border border-slate-200 bg-white shadow-none',
          }}
          variant="bordered"
          size="sm"
        />
      </motion.div>

      {filtered.length === 0 ? (
        <GalleryEmptyState
          onUpload={canManage ? openUploadDrawer : undefined}
          filtered={hasFilters || items.length > 0}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {pageItems.map((item, index) => (
                <GalleryCard
                  key={item.id}
                  item={item}
                  index={index}
                  canManage={canManage}
                  onView={() => openViewDrawer(item)}
                  onEdit={() => openEditDrawer(item)}
                  onDelete={() => void handleDelete(item)}
                  isDeleting={deleteMutation.isPending}
                />
              ))}
            </AnimatePresence>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-5 sm:flex-row"
          >
            <span className="text-sm text-slate-500">
              Showing {showingFrom}–{showingTo} of {filtered.length} assets
            </span>
            {pageCount > 1 ? (
              <Pagination
                page={safePage}
                total={pageCount}
                onChange={setPage}
                showControls
                color="primary"
                classNames={{
                  cursor: 'rounded-lg bg-primary text-white',
                  item: 'rounded-lg',
                }}
              />
            ) : null}
          </motion.div>
        </>
      )}
    </div>
  )
}
