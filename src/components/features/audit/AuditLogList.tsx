import { motion } from 'framer-motion'
import {
  FileText,
  Image,
  KeyRound,
  LogIn,
  LogOut,
  Trash2,
  Upload,
  UserCog,
  Download,
  Mail,
} from 'lucide-react'
import type { AuditLogEntry } from '@/lib/types'
import { cn } from '@/lib/utils'

interface AuditLogListProps {
  items: AuditLogEntry[]
}

const EASE = [0.22, 1, 0.36, 1] as const

/**
 * Formats a timestamp as "21 Jul 2026, 14:30".
 */
function formatAuditTimestamp(iso: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(iso))
}

/**
 * Colour-coded icon for an audit entry.
 */
function AuditIcon({
  entry,
}: {
  entry: AuditLogEntry
}): React.ReactElement {
  const category = entry.category || mapEntityCategory(entry.entity)
  const isDelete = entry.action === 'delete'

  let tone = 'bg-primary/10 text-primary'
  let Icon = FileText

  if (isDelete || entry.action === 'delete') {
    tone = 'bg-rose-100 text-rose-600'
    Icon = Trash2
  } else if (category === 'gallery') {
    tone = 'bg-emerald-100 text-emerald-700'
    Icon = entry.action === 'create' ? Upload : Image
  } else if (category === 'content') {
    tone = 'bg-accent/20 text-amber-800'
    Icon = FileText
  } else if (category === 'admin') {
    tone = 'bg-primary/10 text-primary'
    Icon = UserCog
  } else if (category === 'auth') {
    tone = 'bg-primary/10 text-primary'
    Icon = entry.changes.includes('logout') ? LogOut : LogIn
  } else if (category === 'donation') {
    tone = 'bg-emerald-100 text-emerald-700'
    Icon = Download
  } else if (category === 'message') {
    tone = 'bg-accent/20 text-amber-800'
    Icon = Mail
  }

  if (entry.changes.includes('password_reset')) {
    Icon = KeyRound
  }

  return (
    <span
      className={cn(
        'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
        tone,
      )}
      aria-hidden
    >
      <Icon className="h-4 w-4" strokeWidth={2.25} />
    </span>
  )
}

/**
 * @param entity
 */
function mapEntityCategory(
  entity: AuditLogEntry['entity'],
): NonNullable<AuditLogEntry['category']> {
  if (entity === 'gallery') return 'gallery'
  if (entity === 'content' || entity === 'leadership' || entity === 'settings') {
    return 'content'
  }
  if (entity === 'donation') return 'donation'
  if (entity === 'message') return 'message'
  if (entity === 'auth') return 'auth'
  return 'admin'
}

/**
 * Builds a human-readable action description for an entry.
 */
function describeEntry(entry: AuditLogEntry): string {
  if (entry.details?.trim()) return entry.details

  const name = entry.actor.name
  if (entry.entity === 'gallery' && entry.action === 'create') {
    return `${name} uploaded ${entry.entityLabel || 'media'} to gallery`
  }
  if (entry.entity === 'gallery' && entry.action === 'delete') {
    return `${name} deleted ${entry.entityLabel || 'media'} from gallery`
  }
  if (entry.entity === 'content') {
    return `${name} updated ${entry.entityLabel || 'content'}`
  }
  if (entry.entity === 'message' && entry.action === 'update') {
    return `${name} read message from ${entry.entityLabel || 'sender'}`
  }

  const verb =
    entry.action === 'create'
      ? 'created'
      : entry.action === 'delete'
        ? 'deleted'
        : 'updated'
  return `${name} ${verb} ${entry.entityTypeLabel.toLowerCase()}${
    entry.entityLabel ? ` “${entry.entityLabel}”` : ''
  }`
}

/**
 * Paginated audit log list with colour-coded icons.
 */
export function AuditLogList({ items }: AuditLogListProps): React.ReactElement {
  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
        <p className="text-sm font-medium text-slate-600">No audit events found</p>
        <p className="mt-1 text-sm text-slate-400">
          Try adjusting filters or clearing the search.
        </p>
      </div>
    )
  }

  return (
    <ul className="divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card">
      {items.map((entry, index) => {
        const roleLabel = entry.adminRole || entry.actor.role
        return (
          <motion.li
            key={entry.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: index * 0.03, ease: EASE }}
            className={cn(
              'flex gap-4 px-5 py-4 sm:px-6',
              index % 2 === 1 && 'bg-slate-50/40',
            )}
          >
            <AuditIcon entry={entry} />
            <div className="min-w-0 flex-1">
              <p className="text-sm leading-snug text-slate-800">
                <span className="font-bold text-primary">
                  {entry.adminName || entry.actor.name}
                  {roleLabel ? (
                    <span className="font-semibold text-slate-500">
                      {' '}
                      · {roleLabel}
                    </span>
                  ) : null}
                </span>
              </p>
              <p className="mt-0.5 text-sm text-slate-600">
                {describeEntry(entry)}
              </p>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
                <time dateTime={entry.createdAt}>
                  {formatAuditTimestamp(entry.createdAt)}
                </time>
                {entry.ipAddress ? (
                  <span className="text-slate-400">IP {entry.ipAddress}</span>
                ) : null}
              </div>
            </div>
          </motion.li>
        )
      })}
    </ul>
  )
}
