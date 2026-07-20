import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ContentBlockGrid,
  ContentEditForm,
  ContentErrorState,
  ContentSkeleton,
  ContentTabs,
  getSectionValues,
  type ContentBlockDef,
} from '@/components/features/content'
import { useContent, useDrawer } from '@/hooks'
import { formatDateTime } from '@/lib/utils'
import type { ContentPageKey } from '@/lib/types'

const EASE = [0.22, 1, 0.36, 1] as const

/**
 * Content Manager — card-based CMS for public website sections.
 */
export default function ContentEditor(): React.ReactElement {
  const { data, isLoading, isError, error, refetch, isFetching } = useContent()
  const { open } = useDrawer()
  const [activePage, setActivePage] = useState<ContentPageKey>('home')

  function handleEdit(block: ContentBlockDef): void {
    if (!data) return

    open({
      title: block.title,
      description: block.description,
      size: 'lg',
      placement: 'right',
      content: (
        <ContentEditForm
          block={block}
          initialValues={getSectionValues(data, block)}
        />
      ),
    })
  }

  return (
    <div>
      <motion.header
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: EASE }}
        className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
      >
        <div className="max-w-xl space-y-1.5">
          <h1 className="font-display text-3xl font-bold tracking-tight text-primary sm:text-4xl">
            Content Manager
          </h1>
          <p className="text-base leading-relaxed text-slate-500">
            Edit the sections that appear on your public website
          </p>
        </div>

        <div className="inline-flex items-center gap-2.5 self-start rounded-full border border-slate-200/80 bg-white px-4 py-2 shadow-ambient sm:self-auto">
          <span
            className="h-2 w-2 rounded-full bg-success shadow-[0_0_0_3px_rgba(22,163,74,0.15)]"
            aria-hidden
          />
          <span className="text-xs font-medium text-slate-400">
            Last saved
            {data?.lastUpdatedAt ? (
              <span className="ml-1.5 text-slate-500">
                {formatDateTime(data.lastUpdatedAt)}
              </span>
            ) : (
              <span className="ml-1.5 text-slate-400">—</span>
            )}
          </span>
        </div>
      </motion.header>

      <ContentTabs active={activePage} onChange={setActivePage} />

      {isLoading || (isFetching && !data) ? <ContentSkeleton /> : null}

      {isError ? (
        <ContentErrorState
          message={
            error instanceof Error ? error.message : 'Failed to load content'
          }
          onRetry={() => void refetch()}
        />
      ) : null}

      {data && !isError ? (
        <AnimatePresence mode="wait">
          <motion.div
            key={activePage}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: EASE }}
          >
            <ContentBlockGrid
              page={activePage}
              content={data}
              onEdit={handleEdit}
            />
          </motion.div>
        </AnimatePresence>
      ) : null}
    </div>
  )
}
