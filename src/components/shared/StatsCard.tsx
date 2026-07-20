import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui'
import { cn } from '@/lib/utils'

interface StatsCardProps {
  title: string
  value: string
  subtitle?: string
  trend?: string
  trendPositive?: boolean
  icon: LucideIcon
  iconTone?: 'accent' | 'primary' | 'warm'
  index?: number
  className?: string
}

const iconToneClasses = {
  accent: 'bg-accent/10 text-accent',
  primary: 'bg-primary/5 text-primary',
  warm: 'bg-amber-800/10 text-amber-800',
} as const

/**
 * Premium dashboard metric card with staggered entrance.
 */
export function StatsCard({
  title,
  value,
  subtitle,
  trend,
  trendPositive = true,
  icon: Icon,
  iconTone = 'primary',
  index = 0,
  className,
}: StatsCardProps): React.ReactElement {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.08 }}
    >
      <Card
        className={cn(
          'group overflow-hidden border-slate-200/60 shadow-luxury transition-colors hover:border-accent/50',
          className,
        )}
      >
        <CardContent className="p-8 sm:p-10">
          <div className="mb-4 flex items-start justify-between gap-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-accent">
              {title}
            </p>
            <div
              className={cn(
                'flex h-9 w-9 shrink-0 items-center justify-center rounded-full',
                iconToneClasses[iconTone],
              )}
            >
              <Icon className="h-4 w-4" aria-hidden />
            </div>
          </div>
          <p className="mb-1 font-display text-4xl font-semibold tracking-tight text-primary">
            {value}
          </p>
          {(trend || subtitle) && (
            <p className="flex flex-wrap items-center gap-1 text-sm text-slate-500">
              {trend ? (
                <span
                  className={cn(
                    'font-bold',
                    trendPositive ? 'text-emerald-600' : 'text-primary',
                  )}
                >
                  {trend}
                </span>
              ) : null}
              {subtitle ? <span>{subtitle}</span> : null}
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
