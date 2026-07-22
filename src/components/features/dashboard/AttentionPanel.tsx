import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AlertTriangle, ArrowUpRight, Info, Siren } from 'lucide-react'
import { Card, CardContent } from '@/components/ui'
import type { DashboardAlert } from '@/lib/types'
import { cn } from '@/lib/utils'

const EASE = [0.22, 1, 0.36, 1] as const

const severityStyles = {
  critical: {
    icon: Siren,
    badge: 'bg-error/10 text-error',
    border: 'border-error/15 hover:border-error/30',
  },
  warning: {
    icon: AlertTriangle,
    badge: 'bg-accent/15 text-amber-800',
    border: 'border-accent/20 hover:border-accent/40',
  },
  info: {
    icon: Info,
    badge: 'bg-primary/10 text-primary',
    border: 'border-primary/10 hover:border-primary/25',
  },
} as const

interface AttentionPanelProps {
  alerts: DashboardAlert[]
}

/**
 * Operator attention queue for items needing follow-up.
 */
export function AttentionPanel({
  alerts,
}: AttentionPanelProps): React.ReactElement {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4, ease: EASE }}
      aria-label="Attention required"
    >
      <Card className="h-full border-slate-200/60 shadow-luxury">
        <CardContent className="p-6 sm:p-8">
          <div className="mb-6 flex items-end justify-between gap-3">
            <div>
              <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.14em] text-accent">
                Needs action
              </p>
              <h2 className="font-display text-xl font-semibold text-primary">
                Attention Queue
              </h2>
            </div>
            <span className="rounded-full bg-primary px-2.5 py-1 text-[11px] font-bold text-white">
              {alerts.length}
            </span>
          </div>

          {alerts.length === 0 ? (
            <p className="rounded-xl border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-slate-400">
              Nothing needs attention right now.
            </p>
          ) : (
            <ul className="space-y-3">
              {alerts.map((alert, index) => {
                const style = severityStyles[alert.severity]
                const Icon = style.icon
                return (
                  <motion.li
                    key={alert.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.48 + index * 0.05, ease: EASE }}
                  >
                    <Link
                      to={alert.href}
                      className={cn(
                        'group flex items-start gap-3 rounded-xl border bg-white p-4 transition-all hover:shadow-ambient',
                        style.border,
                      )}
                    >
                      <span
                        className={cn(
                          'flex h-9 w-9 shrink-0 items-center justify-center rounded-full',
                          style.badge,
                        )}
                      >
                        <Icon className="h-4 w-4" aria-hidden />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold text-primary">
                          {alert.title}
                        </span>
                        <span className="mt-0.5 block text-xs leading-relaxed text-slate-500">
                          {alert.detail}
                        </span>
                        <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-accent">
                          {alert.actionLabel}
                          <ArrowUpRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </span>
                      </span>
                    </Link>
                  </motion.li>
                )
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </motion.section>
  )
}
