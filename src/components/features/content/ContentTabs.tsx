import { motion } from 'framer-motion'
import { CONTENT_TABS } from './contentBlocks'
import type { ContentPageKey } from '@/lib/types'
import { cn } from '@/lib/utils'

interface ContentTabsProps {
  active: ContentPageKey
  onChange: (page: ContentPageKey) => void
}

/**
 * Horizontal page tabs for Content Manager.
 */
export function ContentTabs({
  active,
  onChange,
}: ContentTabsProps): React.ReactElement {
  return (
    <nav
      aria-label="Content pages"
      className="relative mb-8 border-b border-slate-200/80"
    >
      <ul className="flex gap-1 overflow-x-auto scrollbar-thin">
        {CONTENT_TABS.map((tab) => {
          const isActive = tab.key === active
          return (
            <li key={tab.key} className="relative">
              <button
                type="button"
                onClick={() => onChange(tab.key)}
                className={cn(
                  'relative px-5 py-3.5 text-sm font-semibold tracking-wide transition-colors',
                  isActive
                    ? 'text-primary'
                    : 'text-slate-400 hover:text-slate-600',
                )}
              >
                {tab.label}
                {isActive ? (
                  <motion.span
                    layoutId="content-tab-indicator"
                    className="absolute inset-x-3 -bottom-px h-[3px] rounded-full bg-accent"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                ) : null}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
