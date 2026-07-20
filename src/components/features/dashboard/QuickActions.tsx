import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Camera,
  FileText,
  HandHeart,
  Mail,
  type LucideIcon,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui'

const EASE = [0.22, 1, 0.36, 1] as const

const ACTIONS: {
  label: string
  description: string
  href: string
  icon: LucideIcon
}[] = [
  {
    label: 'Add gallery media',
    description: 'Upload photos & videos',
    href: '/gallery',
    icon: Camera,
  },
  {
    label: 'Review inbox',
    description: 'Partnership & inquiries',
    href: '/messages',
    icon: Mail,
  },
  {
    label: 'Update site content',
    description: 'Editorial control center',
    href: '/content',
    icon: FileText,
  },
  {
    label: 'Donation ledger',
    description: 'Funds & transaction status',
    href: '/donations',
    icon: HandHeart,
  },
]

/**
 * Shortcut grid into high-value admin workflows.
 */
export function QuickActions(): React.ReactElement {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.32, ease: EASE }}
      aria-label="Quick actions"
    >
      <Card className="h-full border-slate-200/60 shadow-luxury">
        <CardContent className="p-6 sm:p-8">
          <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.14em] text-accent">
            Command shortcuts
          </p>
          <h2 className="mb-6 font-display text-xl font-semibold text-primary">
            Quick Actions
          </h2>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {ACTIONS.map((action, index) => {
              const Icon = action.icon
              return (
                <motion.li
                  key={action.href}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.38 + index * 0.05, ease: EASE }}
                >
                  <Link
                    to={action.href}
                    className="group flex items-start gap-3 rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 transition-all hover:border-primary/30 hover:bg-white hover:shadow-ambient"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                      <Icon className="h-4 w-4" aria-hidden />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-primary">
                        {action.label}
                      </span>
                      <span className="mt-0.5 block text-xs text-slate-400">
                        {action.description}
                      </span>
                    </span>
                  </Link>
                </motion.li>
              )
            })}
          </ul>
        </CardContent>
      </Card>
    </motion.section>
  )
}
