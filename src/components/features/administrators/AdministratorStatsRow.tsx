import { motion } from 'framer-motion'
import { Users, UserCheck, Eye } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { AdministratorStats } from '@/lib/types'

interface AdministratorStatsRowProps {
  stats: AdministratorStats
  isLoading?: boolean
}

const EASE = [0.22, 1, 0.36, 1] as const

const CARDS = [
  {
    key: 'total' as const,
    label: 'Total Administrators',
    icon: Users,
    tone: 'bg-primary/10 text-primary',
  },
  {
    key: 'active' as const,
    label: 'Active Administrators',
    icon: UserCheck,
    tone: 'bg-emerald-100 text-emerald-700',
  },
  {
    key: 'viewers' as const,
    label: 'Viewers',
    icon: Eye,
    tone: 'bg-slate-100 text-slate-600',
  },
]

/**
 * Three-card stats row for the administrators page.
 */
export function AdministratorStatsRow({
  stats,
  isLoading,
}: AdministratorStatsRowProps): React.ReactElement {
  return (
    <div className="mb-8 grid gap-4 sm:grid-cols-3">
      {CARDS.map((card, index) => {
        const Icon = card.icon
        return (
          <motion.div
            key={card.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05, ease: EASE }}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-card"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400">
                  {card.label}
                </p>
                <p className="mt-2 font-display text-3xl font-semibold text-primary">
                  {isLoading ? '—' : stats[card.key]}
                </p>
              </div>
              <span
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-full',
                  card.tone,
                )}
              >
                <Icon className="h-4.5 w-4.5" aria-hidden />
              </span>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
