import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface PageHeaderProps {
  title: string
  description?: string
  /** Small uppercase label above the title */
  eyebrow?: string
  actions?: ReactNode
  /** Align actions with the bottom of the title block (e.g. metric chips) */
  actionsAlign?: 'start' | 'end'
}

/**
 * Consistent page title row with optional actions.
 */
export function PageHeader({
  title,
  description,
  eyebrow,
  actions,
  actionsAlign = 'start',
}: PageHeaderProps): React.ReactElement {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={cn(
        'mb-8 flex flex-col gap-4 sm:flex-row sm:justify-between',
        actionsAlign === 'end' ? 'sm:items-end' : 'sm:items-start',
      )}
    >
      <div className="max-w-2xl space-y-1.5">
        {eyebrow ? (
          <span className="mb-3 block text-[11px] font-bold uppercase tracking-[0.1em] text-amber-800">
            {eyebrow}
          </span>
        ) : null}
        <h1 className="font-display text-3xl font-semibold tracking-tight text-primary sm:text-4xl">
          {title}
        </h1>
        {description ? (
          <p className="max-w-xl text-base leading-relaxed text-slate-500">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex shrink-0 items-center gap-2">{actions}</div>
      ) : null}
    </motion.div>
  )
}
