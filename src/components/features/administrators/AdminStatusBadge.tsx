import { cn } from '@/lib/utils'

interface AdminStatusBadgeProps {
  status: 'active' | 'inactive'
  className?: string
}

/**
 * Active / Inactive status badge.
 */
export function AdminStatusBadge({
  status,
  className,
}: AdminStatusBadgeProps): React.ReactElement {
  const isActive = status === 'active'
  return (
    <span
      className={cn(
        'inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide',
        isActive
          ? 'bg-emerald-100 text-emerald-700'
          : 'bg-rose-100 text-rose-700',
        className,
      )}
    >
      {isActive ? 'Active' : 'Inactive'}
    </span>
  )
}
