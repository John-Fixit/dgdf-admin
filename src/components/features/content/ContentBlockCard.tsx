import { motion } from 'framer-motion'
import { Button } from '@heroui/react'
import { Pencil } from 'lucide-react'
import type { ContentBlockDef } from './contentBlocks'

const EASE = [0.22, 1, 0.36, 1] as const

interface ContentBlockCardProps {
  block: ContentBlockDef
  preview: string
  index: number
  onEdit: () => void
}

/**
 * Premium overview card for a single editable content section.
 */
export function ContentBlockCard({
  block,
  preview,
  index,
  onEdit,
}: ContentBlockCardProps): React.ReactElement {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: EASE }}
      className="group flex flex-col rounded-3xl border border-slate-100/80 bg-white py-6 pl-6 pr-6 shadow-ambient transition-shadow duration-300 hover:shadow-luxury"
      style={{ borderLeftWidth: 4, borderLeftColor: '#F0A500' }}
    >
      <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-accent">
        {block.label}
      </span>

      <h3 className="mt-2.5 font-display text-xl font-semibold tracking-tight text-primary">
        {block.title}
      </h3>

      <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
        {block.description}
      </p>

      <p className="mt-4 line-clamp-2 flex-1 text-sm leading-relaxed text-slate-400">
        {preview || 'No content yet'}
      </p>

      <div className="mt-6 flex justify-end">
        <Button
          size="sm"
          variant="bordered"
          className="h-9 rounded-full border-primary/25 px-4 font-semibold text-primary transition-colors group-hover:border-primary/50"
          startContent={<Pencil className="h-3.5 w-3.5" />}
          onPress={onEdit}
        >
          Edit
        </Button>
      </div>
    </motion.article>
  )
}
