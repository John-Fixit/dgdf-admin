import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Megaphone, ShieldCheck } from 'lucide-react'
import { Badge, Card, CardContent } from '@/components/ui'
import type { ActivityItem } from '@/lib/types'
import { cn } from '@/lib/utils'

interface ActivityFeedProps {
  items: ActivityItem[]
}

const EASE = [0.22, 1, 0.36, 1] as const

const typeLabel: Record<ActivityItem['type'], string> = {
  donation: 'Donation',
  story: 'Story',
  update: 'Update',
  system: 'System',
}

const typeBadge: Record<ActivityItem['type'], 'success' | 'warning' | 'default' | 'secondary'> = {
  donation: 'success',
  story: 'warning',
  update: 'default',
  system: 'secondary',
}

/**
 * Renders the leading visual for an activity row.
 */
function ActivityAvatar({ item }: { item: ActivityItem }): React.ReactElement {
  if (item.avatarUrl) {
    return (
      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full ring-2 ring-white shadow-ambient">
        <img
          src={item.avatarUrl}
          alt=""
          className="h-full w-full object-cover"
        />
      </div>
    )
  }

  if (item.type === 'story') {
    return (
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-800/15 text-amber-800">
        <Megaphone className="h-4 w-4" aria-hidden />
      </div>
    )
  }

  if (item.type === 'system') {
    return (
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/20 text-accent">
        <ShieldCheck className="h-4 w-4" aria-hidden />
      </div>
    )
  }

  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
      {(item.actorName ?? 'A').charAt(0)}
    </div>
  )
}

/**
 * Latest activity feed panel (static mock until API).
 */
export function ActivityFeed({ items }: ActivityFeedProps): React.ReactElement {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3, ease: EASE }}
      className="h-full"
    >
      <Card className="h-full border-slate-200/60 shadow-luxury">
        <CardContent className="flex h-full flex-col p-6 sm:p-8">
          <div className="mb-6">
            <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.14em] text-accent">
              Operations pulse
            </p>
            <h2 className="font-display text-2xl font-semibold text-primary">
              Latest Activity
            </h2>
          </div>

          <ul className="flex-1 space-y-5">
            {items.map((item, index) => (
              <motion.li
                key={item.id}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.36 + index * 0.05, ease: EASE }}
                className="flex gap-3 border-b border-slate-100 pb-5 last:border-0 last:pb-0"
              >
                <ActivityAvatar item={item} />
                <div className="min-w-0 flex-1">
                  <div className="mb-1.5 flex flex-wrap items-center gap-2">
                    <Badge
                      variant={typeBadge[item.type]}
                      className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
                    >
                      {typeLabel[item.type]}
                    </Badge>
                    <span className="text-[11px] text-slate-400">{item.timeAgo}</span>
                  </div>
                  <p className="text-sm leading-snug text-slate-700">
                    {item.actorName ? (
                      <strong className="font-bold text-slate-900">
                        {item.actorName}{' '}
                      </strong>
                    ) : null}
                    {item.title}{' '}
                    {item.highlight ? (
                      <span
                        className={cn(
                          'font-semibold',
                          item.type === 'donation'
                            ? 'text-accent'
                            : 'font-bold text-slate-900',
                        )}
                      >
                        {item.highlight}
                      </span>
                    ) : null}
                  </p>
                </div>
              </motion.li>
            ))}
          </ul>

          <Link
            to="/messages"
            className="mt-6 border-t border-slate-200/60 pt-4 text-left text-sm font-semibold uppercase tracking-wider text-primary transition-colors hover:text-accent"
          >
            View all activity
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  )
}
