import { Image } from '@heroui/react'
import type { GalleryItem } from '@/lib/types'
import { formatDate } from '@/lib/utils'

interface GalleryViewPanelProps {
  item: GalleryItem
}

/**
 * Read-only gallery asset preview for the shared drawer.
 */
export function GalleryViewPanel({
  item,
}: GalleryViewPanelProps): React.ReactElement {
  const meta = [item.fileSize, item.format].filter(Boolean).join(' • ')

  return (
    <div className="space-y-5">
      <Image
        src={item.imageUrl}
        alt={item.title}
        className="w-full rounded-lg object-cover"
        classNames={{
          wrapper: 'w-full !max-w-none',
          img: 'aspect-[4/3] w-full object-cover',
        }}
      />
      <div className="space-y-2">
        <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-accent">
          {[item.category, item.location].filter(Boolean).join(' • ')}
        </p>
        <p className="text-sm leading-relaxed text-slate-600">
          {item.description}
        </p>
      </div>
      <dl className="grid grid-cols-2 gap-3 rounded-lg border border-slate-200/60 bg-surface p-4 text-sm">
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Added
          </dt>
          <dd className="mt-1 font-medium text-primary">
            {formatDate(item.createdAt)}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
            File
          </dt>
          <dd className="mt-1 font-medium text-primary">{meta || '—'}</dd>
        </div>
      </dl>
    </div>
  )
}
