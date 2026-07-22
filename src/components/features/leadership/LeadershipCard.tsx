import { motion } from 'framer-motion'
import { Button } from '@heroui/react'
import { Pencil, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn, truncate } from '@/lib/utils'
import type { LeadershipMember } from '@/lib/types'

const EASE = [0.22, 1, 0.36, 1] as const

interface LeadershipCardProps {
  member: LeadershipMember
  index: number
  onEdit: () => void
  onDelete: () => void
  canManage?: boolean
}

/**
 * Premium card for a single leadership / board member.
 */
export function LeadershipCard({
  member,
  index,
  onEdit,
  onDelete,
  canManage = true,
}: LeadershipCardProps): React.ReactElement {
  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05, ease: EASE }}
      className={cn(
        'group flex flex-col overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-ambient',
        'transition-shadow duration-300 hover:shadow-luxury',
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <img
          src={member.photoUrl}
          alt={member.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <Badge
            variant={member.status === 'published' ? 'success' : 'secondary'}
          >
            {member.status === 'published' ? 'Published' : 'Draft'}
          </Badge>
          {member.isFounder ? (
            <Badge variant="warning">Founder</Badge>
          ) : null}
        </div>
        <div className="absolute bottom-3 right-3 rounded-md bg-white/90 px-2 py-0.5 text-[11px] font-semibold tabular-nums text-slate-500 backdrop-blur-sm">
          #{member.sortOrder}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-accent">
          {member.role}
        </p>
        <h3 className="mt-1.5 font-display text-lg font-semibold tracking-tight text-primary">
          {member.name}
        </h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-slate-500">
          {truncate(member.bio, 120)}
        </p>

        {canManage ? (
          <div className="mt-5 flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
            <Button
              size="sm"
              variant="light"
              className="min-w-0 rounded-lg px-2 text-slate-400 hover:text-error"
              isIconOnly
              aria-label={`Delete ${member.name}`}
              onPress={onDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="bordered"
              className="h-9 rounded-lg border-primary/20 px-3.5 font-semibold text-primary"
              startContent={<Pencil className="h-3.5 w-3.5" />}
              onPress={onEdit}
            >
              Edit
            </Button>
          </div>
        ) : null}
      </div>
    </motion.article>
  )
}
