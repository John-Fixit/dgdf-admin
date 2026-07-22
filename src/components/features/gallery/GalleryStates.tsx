import { Button } from '@heroui/react'
import { AlertCircle, Camera, RefreshCw, Upload } from 'lucide-react'

interface GalleryEmptyStateProps {
  onUpload?: () => void
  filtered?: boolean
}

/**
 * Empty gallery state — no assets, or no search/filter matches.
 */
export function GalleryEmptyState({
  onUpload,
  filtered = false,
}: GalleryEmptyStateProps): React.ReactElement {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white px-8 py-16 text-center shadow-ambient">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/5">
        <Camera className="h-6 w-6 text-primary" aria-hidden />
      </div>
      <h3 className="font-display text-lg font-semibold text-primary">
        {filtered ? 'No matching assets' : 'No gallery media yet'}
      </h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-500">
        {filtered
          ? 'Try adjusting your search or status filter.'
          : 'Upload photos and videos that tell your impact story on the public Gallery page.'}
      </p>
      {!filtered && onUpload ? (
        <Button
          className="mt-6 rounded-lg font-semibold"
          color="primary"
          size="sm"
          startContent={<Upload className="h-3.5 w-3.5" />}
          onPress={onUpload}
        >
          Upload media
        </Button>
      ) : null}
    </div>
  )
}

interface GalleryErrorStateProps {
  message?: string
  onRetry: () => void
}

/**
 * Error state when gallery fails to load.
 */
export function GalleryErrorState({
  message,
  onRetry,
}: GalleryErrorStateProps): React.ReactElement {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-error/15 bg-white px-8 py-16 text-center shadow-ambient">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-error/8">
        <AlertCircle className="h-6 w-6 text-error" aria-hidden />
      </div>
      <h3 className="font-display text-lg font-semibold text-primary">
        Couldn’t load gallery
      </h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-500">
        {message ??
          'Something went wrong while fetching your media library. Please try again.'}
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
