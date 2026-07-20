import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@heroui/react'
import { Card, CardContent } from '@/components/ui'
import { cn } from '@/lib/utils'
import type { ImpactChartPoint } from '@/lib/types'

interface ImpactChartProps {
  monthly: ImpactChartPoint[]
  yearly: ImpactChartPoint[]
}

type ChartRange = 'monthly' | 'yearly'

const EASE = [0.22, 1, 0.36, 1] as const

/**
 * Impact projection bar chart with monthly/yearly range toggle.
 */
export function ImpactChart({
  monthly,
  yearly,
}: ImpactChartProps): React.ReactElement {
  const [range, setRange] = useState<ChartRange>('monthly')
  const data = range === 'monthly' ? monthly : yearly

  const summary = useMemo(() => {
    const peak = data.reduce(
      (best, point) => (point.value > best.value ? point : best),
      data[0] ?? { label: '—', value: 0 },
    )
    const average = data.length
      ? Math.round(data.reduce((sum, point) => sum + point.value, 0) / data.length)
      : 0
    return { peak, average }
  }, [data])

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.24, ease: EASE }}
      className="h-full"
    >
      <Card className="flex h-full min-h-[420px] flex-col overflow-hidden border-slate-200/60 shadow-luxury">
        <CardContent className="flex flex-1 flex-col p-6 sm:p-8 lg:p-10">
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.14em] text-accent">
                Performance
              </p>
              <h2 className="font-display text-2xl font-semibold text-primary">
                Impact Projection
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Outreach intensity across the selected reporting window.
              </p>
            </div>
            <div className="flex gap-2" role="group" aria-label="Chart range">
              {(['monthly', 'yearly'] as const).map((option) => (
                <Button
                  key={option}
                  size="sm"
                  onPress={() => setRange(option)}
                  className={cn(
                    'h-auto min-w-0 rounded-lg px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.1em]',
                    range === option
                      ? 'bg-primary text-white data-[hover=true]:bg-primary'
                      : 'bg-slate-100 text-slate-500 data-[hover=true]:bg-slate-200',
                  )}
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>

          <div className="mb-8 grid grid-cols-2 gap-3 sm:max-w-sm">
            <div className="rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Peak period
              </p>
              <p className="mt-1 font-display text-lg font-semibold text-primary">
                {summary.peak.label}
              </p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Avg intensity
              </p>
              <p className="mt-1 font-display text-lg font-semibold text-primary">
                {summary.average}%
              </p>
            </div>
          </div>

          <div className="mt-auto flex h-[240px] items-end justify-between gap-2 pt-4 sm:h-[280px] sm:gap-3">
            {data.map((point, index) => (
              <div
                key={`${range}-${point.label}`}
                className="group relative flex h-full w-full flex-col items-center justify-end"
              >
                <span className="pointer-events-none absolute -top-9 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-md bg-primary px-2 py-1 text-[10px] font-semibold text-white opacity-0 shadow-luxury transition-opacity group-hover:opacity-100">
                  {point.isPeak ? 'Peak · ' : ''}
                  {point.value}%
                </span>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${point.value}%` }}
                  transition={{
                    duration: 0.55,
                    delay: 0.2 + index * 0.05,
                    ease: EASE,
                  }}
                  className={cn(
                    'w-full max-w-[48px] rounded-t-lg transition-colors',
                    point.isPeak
                      ? 'bg-primary shadow-ambient'
                      : 'bg-slate-200/90 group-hover:bg-primary/35',
                  )}
                />
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-between gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 sm:text-[11px]">
            {data.map((point) => (
              <span key={`${range}-label-${point.label}`} className="w-full text-center">
                {point.label}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
