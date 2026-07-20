import { ContentBlockCard } from './ContentBlockCard'
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
}

/**
 * Two-column grid of content block cards for the active page.
 */
export function ContentBlockGrid({
  page,
  content,
  onEdit,
}: ContentBlockGridProps): React.ReactElement {
  const blocks = getBlocksForPage(page)

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      {blocks.map((block, index) => {
        const values = getSectionValues(content, block)
        return (
          <ContentBlockCard
            key={`${block.page}-${block.id}`}
            block={block}
            preview={block.preview(values)}
            index={index}
            onEdit={() => onEdit(block)}
          />
        )
      })}
    </div>
  )
}
