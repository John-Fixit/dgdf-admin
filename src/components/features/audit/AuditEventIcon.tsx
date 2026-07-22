import { Image, Pencil, Plus, Trash2 } from 'lucide-react'
import type { AuditLogEntry } from '@/lib/types'
import { cn } from '@/lib/utils'

interface AuditEventIconProps {
  entry: AuditLogEntry
  className?: string
}

/**
 * Circular action icon for an audit timeline row.
 */
export function AuditEventIcon({
  entry,
  className,
}: AuditEventIconProps): React.ReactElement {
  const tone = getTone(entry)
  const Icon = getIcon(entry)

  return (
    <span
      className={cn(
        'relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ring-4 ring-white',
        tone,
        className,
      )}
      aria-hidden
    >
      <Icon className="h-3.5 w-3.5" strokeWidth={2.25} />
    </span>
  )
}

/**
 * @param entry
 */
function getTone(entry: AuditLogEntry): string {
  if (entry.action === 'delete') {
    return 'bg-rose-100 text-rose-600'
  }
  if (entry.action === 'create') {
    return 'bg-violet-100 text-violet-600'
  }
  if (entry.entity === 'gallery') {
    return 'bg-orange-100 text-orange-500'
  }
  return 'bg-accent/20 text-accent'
}

/**
 * @param entry
 */
function getIcon(entry: AuditLogEntry) {
  if (entry.action === 'delete') return Trash2
  if (entry.action === 'create') return Plus
  if (entry.entity === 'gallery' || entry.changes.includes('photo')) {
    return Image
  }
  return Pencil
}
