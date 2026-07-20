import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  label?: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeMap = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
} as const

/**
 * Centered loading spinner with optional label.
 */
export function LoadingSpinner({
  label = 'Loading…',
  className,
  size = 'md',
}: LoadingSpinnerProps): React.ReactElement {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 py-16 text-slate-500',
        className,
      )}
      role="status"
      aria-live="polite"
    >
      <Loader2
        className={cn('animate-spin text-primary', sizeMap[size])}
        aria-hidden
      />
      {label ? <p className="text-sm">{label}</p> : null}
    </div>
  )
}
