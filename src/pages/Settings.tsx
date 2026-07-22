import { motion } from 'framer-motion'
import {
  AdminProfileCard,
  ChangePasswordCard,
} from '@/components/features/account'

const EASE = [0.22, 1, 0.36, 1] as const

/**
 * Account Settings — password and admin profile.
 */
export default function SettingsPage(): React.ReactElement {
  return (
    <div>
      <motion.header
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: EASE }}
        className="mb-8 max-w-xl space-y-1.5"
      >
        <h1 className="font-display text-3xl font-bold tracking-tight text-primary sm:text-4xl">
          Settings
        </h1>
        <p className="text-base leading-relaxed text-slate-500">
          Manage your password and admin profile details
        </p>
      </motion.header>

      <div className="mx-auto grid max-w-2xl gap-6">
        <ChangePasswordCard index={0} />
        <AdminProfileCard index={1} />
      </div>
    </div>
  )
}
