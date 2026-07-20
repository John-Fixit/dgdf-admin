import { AnimatePresence, motion } from 'framer-motion'
import { Button } from '@heroui/react'
import { Mail, Trash2 } from 'lucide-react'
import { formatDateTime } from '@/lib/utils'
import type { Message } from '@/lib/types'

const EASE = [0.22, 1, 0.36, 1] as const

interface MessageDetailProps {
  message: Message | null
  onDelete: (id: string) => void
  isDeleting?: boolean
}

/**
 * Detail pane for a selected contact message.
 */
export function MessageDetail({
  message,
  onDelete,
  isDeleting = false,
}: MessageDetailProps): React.ReactElement {
  if (!message) {
    return (
      <div className="flex h-full min-h-[280px] items-center justify-center rounded-xl border border-slate-100 bg-white p-8 shadow-card">
        <p className="text-sm text-slate-400">Select a message to read</p>
      </div>
    )
  }

  return (
    <AnimatePresence mode="wait">
      <motion.article
        key={message.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.28, ease: EASE }}
        className="flex h-full flex-col rounded-xl border border-slate-100 bg-white p-6 shadow-card sm:p-7"
      >
        <header className="mb-5 flex items-start justify-between gap-4">
          <h2 className="font-display text-xl font-semibold leading-snug tracking-tight text-primary sm:text-2xl">
            {message.subject}
          </h2>
          <Button
            isIconOnly
            variant="light"
            color="danger"
            onPress={() => onDelete(message.id)}
            isDisabled={isDeleting}
            className="shrink-0"
            aria-label={`Delete message from ${message.name}`}
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        </header>

        <div className="mb-5 space-y-1 text-sm text-slate-600">
          <p>
            <span className="font-medium text-slate-800">{message.name}</span>
            <span className="text-slate-400"> · </span>
            <a
              href={`mailto:${message.email}`}
              className="text-primary hover:underline"
            >
              {message.email}
            </a>
          </p>
          {message.phone ? (
            <p>
              <a
                href={`tel:${message.phone.replace(/\s+/g, '')}`}
                className="text-slate-600 hover:text-primary hover:underline"
              >
                {message.phone}
              </a>
            </p>
          ) : null}
          <p className="pt-1 text-xs text-slate-400">
            {formatDateTime(message.createdAt)}
          </p>
        </div>

        <div className="mb-6 flex-1 rounded-lg bg-slate-50 px-5 py-4">
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
            {message.body}
          </p>
        </div>

        <footer className="mt-auto border-t border-slate-100 pt-4">
          <a
            href={`mailto:${message.email}?subject=${encodeURIComponent(`Re: ${message.subject}`)}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary/80"
          >
            <Mail className="h-4 w-4" aria-hidden />
            Reply via email
          </a>
        </footer>
      </motion.article>
    </AnimatePresence>
  )
}
