import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, Search } from 'lucide-react'
import { Button, type Selection } from '@heroui/react'
import { Input } from '@/components/ui'
import { LoadingSpinner, PageHeader } from '@/components/shared'
import { MessageDetail, MessagesList } from '@/components/features/messages'
import {
  useConfirm,
  useDeleteMessage,
  useMarkMessageRead,
  useMessages,
} from '@/hooks'
import { cn } from '@/lib/utils'

const EASE = [0.22, 1, 0.36, 1] as const

type StatusFilter = 'all' | 'read' | 'unread'

/**
 * Messages inbox — search/filter toolbar with table list + detail split view.
 */
export default function Messages(): React.ReactElement {
  const { data, isLoading, isError, error, refetch } = useMessages()
  const { mutate: markAsRead } = useMarkMessageRead()
  const deleteMessage = useDeleteMessage()
  const { confirm } = useConfirm()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [checkedKeys, setCheckedKeys] = useState<Selection>(new Set())
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [filterOpen, setFilterOpen] = useState(false)
  const didInitSelect = useRef(false)

  const messages = data ?? []

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return messages.filter((message) => {
      if (statusFilter === 'read' && !message.read) return false
      if (statusFilter === 'unread' && message.read) return false
      if (!q) return true
      return (
        message.name.toLowerCase().includes(q) ||
        message.email.toLowerCase().includes(q) ||
        message.subject.toLowerCase().includes(q)
      )
    })
  }, [messages, search, statusFilter])

  const selected =
    filtered.find((m) => m.id === selectedId) ??
    messages.find((m) => m.id === selectedId) ??
    filtered[0] ??
    null

  useEffect(() => {
    if (didInitSelect.current || messages.length === 0) return
    const first = messages[0]
    if (!first) return
    didInitSelect.current = true
    setSelectedId(first.id)
    if (!first.read) {
      markAsRead(first.id)
    }
  }, [messages, markAsRead])

  /**
   * Selects a message and marks it as read when unread.
   */
  function handleSelect(id: string): void {
    setSelectedId(id)
    const message = messages.find((m) => m.id === id)
    if (message && !message.read) {
      markAsRead(id)
    }
  }

  /**
   * Confirms deletion, then removes the message and clears selection if needed.
   */
  async function handleDelete(id: string): Promise<void> {
    const message = messages.find((m) => m.id === id)
    const confirmed = await confirm({
      title: 'Delete message?',
      description: message
        ? `Delete the message from ${message.name}? This cannot be undone.`
        : 'This message will be permanently removed.',
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
      variant: 'danger',
    })
    if (!confirmed) return

    deleteMessage.mutate(id, {
      onSuccess: () => {
        setCheckedKeys((prev) => {
          if (prev === 'all') return prev
          const next = new Set(prev)
          next.delete(id)
          return next
        })
        if (selectedId === id) {
          setSelectedId(null)
        }
      },
    })
  }

  if (isLoading) {
    return <LoadingSpinner label="Loading messages…" />
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-error/20 bg-error/5 p-8 text-center">
        <p className="mb-3 text-sm text-error">
          {error instanceof Error ? error.message : 'Failed to load messages'}
        </p>
        <Button variant="bordered" size="sm" onPress={() => void refetch()}>
          Try again
        </Button>
      </div>
    )
  }

  const filterLabel =
    statusFilter === 'all'
      ? 'All'
      : statusFilter === 'read'
        ? 'Read'
        : 'Unread'

  return (
    <div>
      <PageHeader
        title="Messages"
        description="Contact form inquiries from the public website."
      />

      <div className="space-y-5">
        {/* Search & filter */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: EASE }}
          aria-label="Search and filter messages"
          className="rounded-xl border border-slate-100 bg-white p-4 shadow-card sm:p-5"
        >
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              aria-hidden
            />
            <Input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name, email, subject..."
              className="h-11 border-slate-200 bg-white pl-10 shadow-none"
              aria-label="Search messages"
            />
          </div>

          <div className="relative mt-3 inline-block">
            <Button
              variant="bordered"
              size="sm"
              onPress={() => setFilterOpen((open) => !open)}
              aria-expanded={filterOpen}
              aria-haspopup="listbox"
              className="border-slate-200 bg-white text-slate-600"
              endContent={
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" aria-hidden />
              }
            >
              {filterLabel}
            </Button>
            {filterOpen ? (
              <ul
                role="listbox"
                className="absolute left-0 z-20 mt-1.5 min-w-[140px] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-luxury"
              >
                {(
                  [
                    ['all', 'All'],
                    ['unread', 'Unread'],
                    ['read', 'Read'],
                  ] as const
                ).map(([value, label]) => (
                  <li key={value}>
                    <Button
                      variant="light"
                      role="option"
                      aria-selected={statusFilter === value}
                      className={cn(
                        'h-auto w-full justify-start rounded-none px-3 py-2 text-sm',
                        statusFilter === value
                          ? 'font-medium text-primary'
                          : 'text-slate-600',
                      )}
                      onPress={() => {
                        setStatusFilter(value)
                        setFilterOpen(false)
                      }}
                    >
                      {label}
                    </Button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </motion.section>

        {/* List + detail */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.06, ease: EASE }}
          className="grid gap-5 lg:grid-cols-12 lg:items-start"
        >
          <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-card lg:col-span-7 xl:col-span-8">
            <MessagesList
              messages={filtered}
              selectedId={selected?.id ?? null}
              checkedKeys={checkedKeys}
              onSelect={handleSelect}
              onCheckedChange={setCheckedKeys}
            />
          </div>

          <div className="lg:col-span-5 xl:col-span-4">
            <MessageDetail
              message={selected}
              onDelete={(id) => void handleDelete(id)}
              isDeleting={deleteMessage.isPending}
            />
          </div>
        </motion.div>
      </div>
    </div>
  )
}
