import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui'
import type { FundChannel } from '@/lib/types'
import { cn } from '@/lib/utils'

const EASE = [0.22, 1, 0.36, 1] as const

const toneBar: Record<FundChannel['tone'], string> = {
  primary: 'bg-primary',
  accent: 'bg-accent',
  warm: 'bg-amber-800',
  slate: 'bg-slate-300',
}

interface ChannelBreakdownProps {
  channels: FundChannel[]
}

/**
 * Fund allocation breakdown across impact channels.
 */
export function ChannelBreakdown({
  channels,
}: ChannelBreakdownProps): React.ReactElement {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.36, ease: EASE }}
      aria-label="Fund allocation"
    >
      <Card className="h-full border-slate-200/60 shadow-luxury">
        <CardContent className="p-6 sm:p-8">
          <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.14em] text-accent">
            Stewardship
          </p>
          <h2 className="mb-2 font-display text-xl font-semibold text-primary">
            Fund Allocation
          </h2>
          <p className="mb-6 text-sm text-slate-500">
            Where raised funds are directed across active mandates.
          </p>

          <div
            className="mb-6 flex h-3 overflow-hidden rounded-full bg-slate-100"
            role="img"
            aria-label="Fund allocation stacked bar"
          >
            {channels.map((channel, index) => (
              <motion.div
                key={channel.id}
                initial={{ width: 0 }}
                animate={{ width: `${channel.percent}%` }}
                transition={{
                  duration: 0.6,
                  delay: 0.45 + index * 0.08,
                  ease: EASE,
                }}
                className={cn('h-full', toneBar[channel.tone])}
                title={`${channel.label}: ${channel.percent}%`}
              />
            ))}
          </div>

          <ul className="space-y-4">
            {channels.map((channel, index) => (
              <motion.li
                key={channel.id}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.05, ease: EASE }}
                className="flex items-center justify-between gap-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    className={cn(
                      'h-2.5 w-2.5 shrink-0 rounded-full',
                      toneBar[channel.tone],
                    )}
                    aria-hidden
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-primary">
                      {channel.label}
                    </p>
                    <p className="text-xs text-slate-400">{channel.amountLabel}</p>
                  </div>
                </div>
                <span className="shrink-0 font-display text-lg font-semibold text-primary">
                  {channel.percent}%
                </span>
              </motion.li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </motion.section>
  )
}
