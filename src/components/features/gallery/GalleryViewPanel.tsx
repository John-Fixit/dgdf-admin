import { Badge } from '@/components/ui/badge'
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
  const meta = [item.fileSize, item.format].filter(Boolean).join(' · ')
  const statusLabel =
    item.status === 'active'
      ? 'Published'
      : item.status === 'draft'
        ? 'Draft'
        : 'Archived'

  return (
    <div className="space-y-5">
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
        {item.mediaType === 'video' ? (
          <video
            src={item.imageUrl}
            controls
            className="aspect-[4/3] w-full object-cover"
          />
        ) : (
          <img
            src={item.imageUrl}
            alt={item.title}
            className="aspect-[4/3] w-full object-cover"
          />
        )}
      </div>

      <div className="flex flex-wrap gap-1.5">
        <Badge
          variant={
            item.status === 'active'
              ? 'success'
              : item.status === 'draft'
                ? 'secondary'
                : 'warning'
          }
        >
          {statusLabel}
        </Badge>
        <Badge variant="outline">{item.category}</Badge>
        {item.location ? <Badge variant="outline">{item.location}</Badge> : null}
      </div>

      <p className="text-sm leading-relaxed text-slate-600">
        {item.description || 'No description provided.'}
      </p>

      <dl className="grid grid-cols-2 gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-4 text-sm">
        <div>
          <dt className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
            Added
          </dt>
          <dd className="mt-1 font-medium text-primary">
            {formatDate(item.createdAt)}
          </dd>
        </div>
        <div>
          <dt className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
            Updated
          </dt>
          <dd className="mt-1 font-medium text-primary">
            {formatDate(item.updatedAt)}
          </dd>
        </div>
        <div>
          <dt className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
            File
          </dt>
          <dd className="mt-1 font-medium text-primary">{meta || '—'}</dd>
        </div>
        <div>
          <dt className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
            Order
          </dt>
          <dd className="mt-1 font-medium text-primary">#{item.sortOrder}</dd>
        </div>
      </dl>
    </div>
  )
}
