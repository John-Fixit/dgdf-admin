import { Button } from '@heroui/react'
import { AlertCircle, RefreshCw } from 'lucide-react'

interface ContentErrorStateProps {
  message?: string
  onRetry: () => void
}

/**
 * Error card with retry when content fails to load.
 */
export function ContentErrorState({
  message,
  onRetry,
}: ContentErrorStateProps): React.ReactElement {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-error/15 bg-white px-8 py-16 text-center shadow-ambient">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-error/8">
        <AlertCircle className="h-6 w-6 text-error" aria-hidden />
      </div>
      <h3 className="font-display text-lg font-semibold text-primary">
        Couldn’t load content
      </h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-500">
        {message ??
          'Something went wrong while fetching your website content. Please try again.'}
      </p>
      <Button
        className="mt-6 font-semibold"
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
