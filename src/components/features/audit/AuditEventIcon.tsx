import { Image, LogIn, LogOut, Pencil, Plus, Trash2 } from 'lucide-react'
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
        'relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white ring-4 ring-white',
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
 * Solid fill tone matching the timeline visual language.
 */
function getTone(entry: AuditLogEntry): string {
  if (entry.action === 'delete') return 'bg-rose-500'
  if (entry.entity === 'auth') return 'bg-primary'
  if (entry.action === 'create') return 'bg-violet-500'
  if (entry.entity === 'gallery') return 'bg-orange-400'
  return 'bg-accent'
}

/**
 * Icon chosen by action / entity.
 */
function getIcon(entry: AuditLogEntry) {
  if (entry.entity === 'auth') {
    return entry.changes.includes('logout') || entry.action === 'delete'
      ? LogOut
      : LogIn
  }
  if (entry.action === 'delete') return Trash2
  if (entry.entity === 'gallery' || entry.changes.includes('photo')) {
    return Image
  }
  if (entry.action === 'create') return Plus
  return Pencil
}
