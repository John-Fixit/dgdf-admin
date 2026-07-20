import { motion } from 'framer-motion'
import {
  BookOpen,
  Camera,
  HandHeart,
  Home,
  Mail,
  UserRound,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ContentPageKey } from '@/lib/types'
import { CONTENT_PAGES } from './contentConstants'

const EASE = [0.22, 1, 0.36, 1] as const

const ICONS: Record<ContentPageKey, LucideIcon> = {
  home: Home,
  about: BookOpen,
  founder: UserRound,
  donate: HandHeart,
  contact: Mail,
  gallery: Camera,
}

interface ContentPageNavProps {
  active: ContentPageKey
  onChange: (key: ContentPageKey) => void
}

/**
 * Page rail for the Content Control Center.
 */
export function ContentPageNav({
  active,
  onChange,
}: ContentPageNavProps): React.ReactElement {
  return (
    <motion.nav
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, ease: EASE }}
      aria-label="Public site pages"
      className="rounded-xl border border-slate-200/70 bg-white p-3 shadow-ambient"
    >
      <p className="mb-3 px-2 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
        Site Pages
      </p>
      <ul className="space-y-1">
        {CONTENT_PAGES.map((page) => {
          const Icon = ICONS[page.key]
          const isActive = page.key === active
          return (
            <li key={page.key}>
              <button
                type="button"
                onClick={() => onChange(page.key)}
                className={cn(
                  'flex w-full items-start gap-3 rounded-lg px-3 py-3 text-left transition-colors',
                  isActive
                    ? 'bg-primary text-white shadow-luxury'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-primary',
                )}
              >
                <Icon
                  className={cn(
                    'mt-0.5 h-4 w-4 shrink-0',
                    isActive ? 'text-accent' : 'text-slate-400',
                  )}
                  aria-hidden
                />
                <span className="min-w-0">
                  <span className="block text-sm font-semibold tracking-wide">
                    {page.label}
                  </span>
                  <span
                    className={cn(
                      'mt-0.5 block text-[11px] leading-snug',
                      isActive ? 'text-white/70' : 'text-slate-400',
                    )}
                  >
                    {page.sections} sections · {page.publicPath}
                  </span>
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </motion.nav>
  )
}
