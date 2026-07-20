import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

const EASE = [0.22, 1, 0.36, 1] as const

interface SectionCardProps {
  eyebrow: string
  title: string
  description?: string
  mapsTo?: string
  index?: number
  children: ReactNode
  className?: string
}

/**
 * Premium section container for a public-site content block.
 */
export function SectionCard({
  eyebrow,
  title,
  description,
  mapsTo,
  index = 0,
  children,
  className,
}: SectionCardProps): React.ReactElement {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05, ease: EASE }}
      className={cn(
        'overflow-hidden rounded-xl border border-slate-200/70 bg-white shadow-ambient',
        className,
      )}
    >
      <header className="border-b border-slate-100 px-6 py-5 sm:px-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 space-y-1.5">
            <span className="block text-[11px] font-bold uppercase tracking-[0.14em] text-accent">
              {eyebrow}
            </span>
            <h3 className="font-display text-xl font-semibold tracking-tight text-primary">
              {title}
            </h3>
            {description ? (
              <p className="max-w-2xl text-sm leading-relaxed text-slate-500">
                {description}
              </p>
            ) : null}
          </div>
          {mapsTo ? (
            <span className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Public · {mapsTo}
            </span>
          ) : null}
        </div>
      </header>
      <div className="space-y-5 px-6 py-6 sm:px-8 sm:py-7">{children}</div>
    </motion.section>
  )
}
