import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { PageHeader } from '@/components/shared'
import { DonationsTable } from '@/components/features/donations'
import { useDonations } from '@/hooks'
import { formatCurrency } from '@/lib/utils'

const EASE = [0.22, 1, 0.36, 1] as const

/**
 * Compact metric chip for the Donation Records header.
 */
function MetricChip({
  label,
  value,
  delay = 0,
}: {
  label: string
  value: string
  delay?: number
}): React.ReactElement {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: EASE }}
      className="flex flex-col rounded-lg border border-slate-200 bg-white px-6 py-4 shadow-ambient"
    >
      <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-accent">
        {label}
      </span>
      <span className="mt-1 font-display text-[32px] font-semibold leading-none tracking-tight text-primary">
        {value}
      </span>
    </motion.div>
  )
}

/**
 * Donation Records — ledger of Paystack contributions.
 */
export default function Donations(): React.ReactElement {
  const { data = [] } = useDonations()

  const { totalFundsLabel, activeDonors } = useMemo(() => {
    const successful = data.filter((donation) => donation.status === 'success')
    const total = successful.reduce((sum, donation) => sum + donation.amount, 0)
    const donors = new Set(successful.map((donation) => donation.email)).size

    return {
      totalFundsLabel: formatCurrency(total, 'NGN'),
      activeDonors: donors,
    }
  }, [data])

  return (
    <div>
      <PageHeader
        eyebrow="Financial Overview"
        title="Donation Records"
        description="Maintain a transparent ledger of all humanitarian contributions. Every donation recorded here directly fuels our ongoing initiatives in Nigeria."
        actionsAlign="end"
        actions={
          <div className="flex flex-wrap gap-3">
            <MetricChip
              label="Total Funds"
              value={totalFundsLabel}
              delay={0.08}
            />
            <MetricChip
              label="Active Donors"
              value={activeDonors.toLocaleString('en-NG')}
              delay={0.14}
            />
          </div>
        }
      />

      <DonationsTable />

      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35, delay: 0.35, ease: EASE }}
        className="mt-12 border-t border-slate-200/60 pt-6 text-center"
      >
        <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400">
          © {new Date().getFullYear()} Divine Gospel Delight Foundation. Secure
          Management Console
        </p>
      </motion.footer>
    </div>
  )
}
