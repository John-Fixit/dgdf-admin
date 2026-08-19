import { ContentBlockCard } from './ContentBlockCard'
import { TimelineBlockCard } from './TimelineBlockCard'
import {
  getBlocksForPage,
  getSectionValues,
  type ContentBlockDef,
} from './contentBlocks'
import type { ContentPageKey, SiteContentDocument } from '@/lib/types'

interface ContentBlockGridProps {
  page: ContentPageKey
  content: SiteContentDocument
  onEdit: (block: ContentBlockDef) => void
  onEditTimeline?: () => void
  canEdit?: boolean
}

/**
 * Responsive grid of content block cards for the active page.
 * The About page's Story block is followed by a bespoke Timeline
 * card — milestones live in their own collection, not this block's
 * scalar fields.
 */
export function ContentBlockGrid({
  page,
  content,
  onEdit,
  onEditTimeline,
  canEdit = true,
}: ContentBlockGridProps): React.ReactElement {
  const blocks = getBlocksForPage(page)

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {blocks.flatMap((block, index) => {
        const values = getSectionValues(content, block)
        const nodes = [
          <ContentBlockCard
            key={`${block.page}-${block.id}`}
            block={block}
            values={values}
            index={index}
            canEdit={canEdit}
            onEdit={() => onEdit(block)}
          />,
        ]
        if (page === 'about' && block.id === 'story' && onEditTimeline) {
          nodes.push(
            <TimelineBlockCard
              key="about-timeline"
              index={index + 1}
              canEdit={canEdit}
              onEdit={onEditTimeline}
            />,
          )
        }
        return nodes
      })}
    </div>
  )
}
