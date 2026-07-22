import { cn } from '@/lib/utils'
import type { AdminRole } from '@/lib/types'

interface RoleBadgeProps {
  role: AdminRole
  className?: string
}

const ROLE_STYLES: Record<AdminRole, string> = {
  super_admin: 'bg-primary text-white',
  admin: 'bg-accent text-primary',
  viewer: 'bg-slate-200 text-slate-700',
}

const ROLE_LABELS: Record<AdminRole, string> = {
  super_admin: 'SUPER_ADMIN',
  admin: 'ADMIN',
  viewer: 'VIEWER',
}

/**
 * Visual role badge for administrators.
 */
export function RoleBadge({
  role,
  className,
}: RoleBadgeProps): React.ReactElement {
  return (
    <span
      className={cn(
        'inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide',
        ROLE_STYLES[role],
        className,
      )}
    >
      {ROLE_LABELS[role]}
    </span>
  )
}
