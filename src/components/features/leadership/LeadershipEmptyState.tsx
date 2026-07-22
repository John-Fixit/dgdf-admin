import { Button } from '@heroui/react'
import { AlertCircle, RefreshCw, UserPlus, Users } from 'lucide-react'

interface LeadershipEmptyStateProps {
  onAdd?: () => void
}

/**
 * Empty state when no leadership members exist.
 */
export function LeadershipEmptyState({
  onAdd,
}: LeadershipEmptyStateProps): React.ReactElement {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white px-8 py-16 text-center shadow-ambient">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/5">
        <Users className="h-6 w-6 text-primary" aria-hidden />
      </div>
      <h3 className="font-display text-lg font-semibold text-primary">
        No leadership profiles yet
      </h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-500">
        Add board members and executives so visitors can meet the people behind
        the foundation.
      </p>
      {onAdd ? (
        <Button
          className="mt-6 rounded-lg font-semibold"
          color="primary"
          size="sm"
          startContent={<UserPlus className="h-3.5 w-3.5" />}
          onPress={onAdd}
        >
          Add member
        </Button>
      ) : null}
    </div>
  )
}

interface LeadershipErrorStateProps {
  message?: string
  onRetry: () => void
}

/**
 * Error state when leadership fails to load.
 */
export function LeadershipErrorState({
  message,
  onRetry,
}: LeadershipErrorStateProps): React.ReactElement {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-error/15 bg-white px-8 py-16 text-center shadow-ambient">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-error/8">
        <AlertCircle className="h-6 w-6 text-error" aria-hidden />
      </div>
      <h3 className="font-display text-lg font-semibold text-primary">
        Couldn’t load leadership
      </h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-500">
        {message ??
          'Something went wrong while fetching leadership profiles. Please try again.'}
      </p>
      <Button
        className="mt-6 rounded-lg font-semibold"
        color="primary"
        size="sm"
        startContent={<RefreshCw className="h-3.5 w-3.5" />}
        onPress={onRetry}
      >
        Retry
      </Button>
    </div>
  )
}
