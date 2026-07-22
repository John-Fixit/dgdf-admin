import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface PageHeaderProps {
  title: string
  description?: string
  /** Small uppercase label above the title */
  eyebrow?: string
  /** Optional class override for the eyebrow */
  eyebrowClassName?: string
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
  eyebrowClassName,
  actions,
  actionsAlign = 'start',
}: PageHeaderProps): React.ReactElement {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'mb-7 flex flex-col gap-4 sm:flex-row sm:justify-between',
        actionsAlign === 'end' ? 'sm:items-end' : 'sm:items-start',
      )}
    >
      <div className="max-w-2xl space-y-1">
        {eyebrow ? (
          <span
            className={cn(
              'mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400',
              eyebrowClassName,
            )}
          >
            {eyebrow}
          </span>
        ) : null}
        <h1 className="font-display text-2xl font-semibold tracking-tight text-primary sm:text-[1.75rem]">
          {title}
        </h1>
        {description ? (
          <p className="max-w-xl text-sm leading-relaxed text-slate-500">
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
