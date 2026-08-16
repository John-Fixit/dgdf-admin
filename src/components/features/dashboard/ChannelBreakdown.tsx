import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui'
import type { FundChannel } from '@/lib/types'
import { cn } from '@/lib/utils'

const EASE = [0.22, 1, 0.36, 1] as const

const toneBar: Record<FundChannel['tone'], string> = {
  success: 'bg-success',
  warning: 'bg-accent',
  error: 'bg-error',
}

type BreakdownMode = 'count' | 'amount'

const MODE_OPTIONS: { value: BreakdownMode; label: string }[] = [
  { value: 'count', label: 'Count' },
  { value: 'amount', label: 'Amount' },
]

interface ChannelBreakdownProps {
  channels: FundChannel[]
}

/**
 * Donation status breakdown (successful / pending / failed). Toggle between
 * share of donation count (default) and share of donation value — a status
 * that's rare by count can otherwise round to 0% when weighted by amount.
 */
export function ChannelBreakdown({
  channels,
}: ChannelBreakdownProps): React.ReactElement {
  const [mode, setMode] = useState<BreakdownMode>('count')
  const percentKey = mode === 'count' ? 'percentByCount' : 'percentByAmount'

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.36, ease: EASE }}
      aria-label="Donation status"
    >
      <Card className="h-full border-slate-200/60 shadow-luxury">
        <CardContent className="p-6 sm:p-8">
          <div className="mb-2 flex items-start justify-between gap-3">
            <div>
              <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.14em] text-accent">
                Stewardship
              </p>
              <h2 className="font-display text-xl font-semibold text-primary">
                Donation Status
              </h2>
            </div>

            {channels.length > 0 && (
              <div
                role="tablist"
                aria-label="Breakdown by"
                className="flex shrink-0 rounded-full bg-slate-100 p-1"
              >
                {MODE_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    role="tab"
                    aria-selected={mode === option.value}
                    onClick={() => setMode(option.value)}
                    className={cn(
                      'rounded-full px-3 py-1 text-xs font-semibold cursor-pointer transition-colors',
                      mode === option.value
                        ? 'bg-primary text-white shadow-sm'
                        : 'text-slate-500 hover:text-primary',
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <p className="mb-6 text-sm text-slate-500">
            How gifts are distributed across payment outcomes.
          </p>

          {channels.length === 0 ? (
            <p className="text-sm text-slate-400">No donation activity yet.</p>
          ) : (
            <>
              <div
                className="mb-6 flex h-3 overflow-hidden rounded-full bg-slate-100"
                role="img"
                aria-label="Donation status stacked bar"
              >
                {channels.map((channel, index) => (
                  <motion.div
                    key={channel.id}
                    initial={{ width: 0 }}
                    animate={{ width: `${channel[percentKey]}%` }}
                    transition={{
                      duration: 0.6,
                      delay: 0.45 + index * 0.08,
                      ease: EASE,
                    }}
                    className={cn('h-full', toneBar[channel.tone])}
                    title={`${channel.label}: ${channel[percentKey].toFixed(1)}%`}
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
                        <p className="text-xs text-slate-400">
                          {channel.amountLabel}
                        </p>
                      </div>
                    </div>
                    <span className="shrink-0 font-display text-lg font-semibold text-primary">
                      {channel[percentKey].toFixed(1)}%
                    </span>
                  </motion.li>
                ))}
              </ul>
            </>
          )}
        </CardContent>
      </Card>
    </motion.section>
  )
}
