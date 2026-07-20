import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { AnimatePresence, motion } from 'framer-motion'
import { addToast, Button } from '@heroui/react'
import {
  CheckCircle2,
  ExternalLink,
  RotateCcw,
  Save,
} from 'lucide-react'
import { LoadingSpinner, PageHeader } from '@/components/shared'
import {
  CONTENT_PAGES,
  ContentPageNav,
  ContentPagePanels,
} from '@/components/features/content'
import { useConfirm, useContent, useUpdateContent } from '@/hooks'
import { formatDateTime } from '@/lib/utils'
import type { ContentPageKey, SiteContentDocument } from '@/lib/types'
import { mockContent } from '@/mock-data'

const EASE = [0.22, 1, 0.36, 1] as const
const PUBLIC_SITE_URL =
  import.meta.env.VITE_PUBLIC_SITE_URL ?? 'http://localhost:3000'

/**
 * Content Control Center — section-based editorial CMS for the public site.
 */
export default function ContentEditor(): React.ReactElement {
  const { data, isLoading, isError, error, refetch } = useContent()
  const saveMutation = useUpdateContent()
  const { confirm } = useConfirm()
  const [activePage, setActivePage] = useState<ContentPageKey>('home')

  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty, isSubmitting },
  } = useForm<SiteContentDocument>({
    defaultValues: mockContent,
  })

  useEffect(() => {
    if (data) reset(data)
  }, [data, reset])

  const activeMeta = useMemo(
    () => CONTENT_PAGES.find((page) => page.key === activePage),
    [activePage],
  )

  const sectionCount = CONTENT_PAGES.reduce(
    (sum, page) => sum + page.sections,
    0,
  )

  async function handlePageChange(next: ContentPageKey): Promise<void> {
    if (next === activePage) return
    if (isDirty) {
      const leave = await confirm({
        title: 'Switch page with unsaved changes?',
        description:
          'Your edits are still in the form. Save before leaving if you want to keep them.',
        confirmLabel: 'Switch anyway',
        cancelLabel: 'Stay',
        variant: 'danger',
      })
      if (!leave) return
    }
    setActivePage(next)
  }

  async function handleReset(): Promise<void> {
    if (!data) return
    const confirmed = await confirm({
      title: 'Discard unsaved changes?',
      description: 'This restores the last saved content document.',
      confirmLabel: 'Discard',
      cancelLabel: 'Keep editing',
      variant: 'danger',
    })
    if (!confirmed) return
    reset(data)
  }

  const onSubmit = handleSubmit(async (values) => {
    try {
      const saved = await saveMutation.mutateAsync(values)
      reset(saved)
      addToast({
        title: 'Content published to control center',
        description: 'Public site copy will use these values once API routes are connected.',
        color: 'success',
      })
    } catch (err) {
      addToast({
        title: 'Could not save content',
        description: err instanceof Error ? err.message : 'Please try again.',
        color: 'danger',
      })
    }
  })

  if (isLoading) {
    return <LoadingSpinner label="Loading content control center…" />
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-error/20 bg-error/5 p-8 text-center">
        <p className="mb-3 text-sm text-error">
          {error instanceof Error ? error.message : 'Failed to load content'}
        </p>
        <Button variant="bordered" size="sm" onPress={() => void refetch()}>
          Try again
        </Button>
      </div>
    )
  }

  return (
    <div className="pb-24">
      <PageHeader
        eyebrow="Website Content"
        title="Content Control Center"
        description="Manage the editorial narrative shown across the public Divine Gospel Delight Foundation website — page by page, section by section."
        actionsAlign="end"
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              as="a"
              href={`${PUBLIC_SITE_URL}${activeMeta?.publicPath ?? '/'}`}
              target="_blank"
              rel="noreferrer"
              variant="bordered"
              className="border-slate-200 font-semibold"
              startContent={<ExternalLink className="h-4 w-4" />}
            >
              Preview {activeMeta?.label ?? 'site'}
            </Button>
            <Button
              variant="bordered"
              className="border-slate-200 font-semibold"
              isDisabled={!isDirty || saveMutation.isPending}
              onPress={() => void handleReset()}
              startContent={<RotateCcw className="h-4 w-4" />}
            >
              Discard
            </Button>
            <Button
              color="primary"
              className="font-semibold tracking-wide"
              isLoading={saveMutation.isPending || isSubmitting}
              isDisabled={!isDirty}
              onPress={() => void onSubmit()}
              startContent={
                saveMutation.isPending ? null : <Save className="h-4 w-4" />
              }
            >
              Save changes
            </Button>
          </div>
        }
      />

      {/* Overview strip */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: EASE }}
        className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3"
        aria-label="Content overview"
      >
        <div className="rounded-xl border border-slate-200/70 bg-white px-5 py-4 shadow-ambient">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-accent">
            Public pages
          </p>
          <p className="mt-1 font-display text-2xl font-semibold text-primary">
            {CONTENT_PAGES.length}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200/70 bg-white px-5 py-4 shadow-ambient">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-accent">
            Editable sections
          </p>
          <p className="mt-1 font-display text-2xl font-semibold text-primary">
            {sectionCount}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200/70 bg-white px-5 py-4 shadow-ambient">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-accent">
            Last saved
          </p>
          <p className="mt-1 text-sm font-semibold text-primary">
            {data?.lastUpdatedAt
              ? formatDateTime(data.lastUpdatedAt)
              : 'Not saved yet'}
          </p>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
            {isDirty ? (
              <span className="font-medium text-amber-700">Unsaved changes</span>
            ) : (
              <>
                <CheckCircle2 className="h-3.5 w-3.5 text-success" aria-hidden />
                In sync with control center
              </>
            )}
          </p>
        </div>
      </motion.section>

      <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-12">
        <aside className="lg:col-span-3 xl:col-span-3">
          <div className="lg:sticky lg:top-24">
            <ContentPageNav
              active={activePage}
              onChange={(key) => void handlePageChange(key)}
            />
          </div>
        </aside>

        <div className="min-w-0 space-y-5 lg:col-span-9 xl:col-span-9">
          <motion.div
            key={activePage}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="rounded-xl border border-slate-200/70 bg-gradient-to-br from-primary/[0.04] to-transparent px-6 py-5 sm:px-8"
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-accent">
              Editing · {activeMeta?.publicPath}
            </p>
            <h2 className="mt-1 font-display text-2xl font-semibold text-primary">
              {activeMeta?.label} page
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-slate-500">
              {activeMeta?.description}
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.28, ease: EASE }}
            >
              <ContentPagePanels page={activePage} register={register} />
            </motion.div>
          </AnimatePresence>
        </div>
      </form>

      {/* Sticky save bar */}
      <AnimatePresence>
        {isDirty ? (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200/80 bg-white/95 px-4 py-3 shadow-luxury backdrop-blur sm:px-8"
          >
            <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-slate-600">
                You have unsaved edits on the{' '}
                <span className="font-semibold text-primary">
                  {activeMeta?.label}
                </span>{' '}
                page.
              </p>
              <div className="flex gap-2">
                <Button
                  variant="bordered"
                  size="sm"
                  className="border-slate-200"
                  onPress={() => void handleReset()}
                >
                  Discard
                </Button>
                <Button
                  color="primary"
                  size="sm"
                  className="font-semibold"
                  isLoading={saveMutation.isPending}
                  onPress={() => void onSubmit()}
                  startContent={<Save className="h-3.5 w-3.5" />}
                >
                  Save all changes
                </Button>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
