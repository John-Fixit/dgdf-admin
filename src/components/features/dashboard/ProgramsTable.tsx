import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, MoreVertical } from 'lucide-react'
import { Button } from '@heroui/react'
import { Badge, Card } from '@/components/ui'
import type { OutreachProgram } from '@/lib/types'
import { cn } from '@/lib/utils'

interface ProgramsTableProps {
  programs: OutreachProgram[]
}

const REGIONS = [
  'All Regions',
  'South West',
  'North Central',
  'South East',
] as const

/**
 * Maps program status to badge presentation.
 */
function statusBadge(status: OutreachProgram['status']): React.ReactElement {
  if (status === 'active') {
    return (
      <Badge className="rounded bg-emerald-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-800">
        Active
      </Badge>
    )
  }
  if (status === 'in_review') {
    return (
      <Badge className="rounded bg-accent/20 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-accent">
        In Review
      </Badge>
    )
  }
  return (
    <Badge variant="secondary" className="text-[10px] font-bold uppercase">
      Paused
    </Badge>
  )
}

/**
 * Active outreach programs table (static mock until API).
 */
export function ProgramsTable({
  programs,
}: ProgramsTableProps): React.ReactElement {
  const [regionFilter, setRegionFilter] = useState<string>('All Regions')
  const [filterOpen, setFilterOpen] = useState(false)

  const filtered =
    regionFilter === 'All Regions'
      ? programs
      : programs.filter((p) => p.region === regionFilter)

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.44 }}
    >
      <Card className="overflow-hidden border-slate-200/60 shadow-luxury">
          <div className="flex flex-wrap items-end justify-between gap-3 border-b border-slate-200/60 px-8 py-6 sm:px-10">
          <div>
            <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.14em] text-accent">
              Field operations
            </p>
            <h2 className="font-display text-2xl font-semibold text-primary">
              Active Outreach Programs
            </h2>
          </div>
          <div className="relative">
            <Button
              variant="light"
              size="sm"
              onPress={() => setFilterOpen((open) => !open)}
              className="h-auto min-w-0 px-1 text-[11px] font-bold uppercase tracking-widest text-accent data-[hover=true]:bg-transparent data-[hover=true]:text-accent/80"
              endContent={<ChevronDown className="h-4 w-4" aria-hidden />}
            >
              Filter By Region
            </Button>
            {filterOpen ? (
              <div className="absolute right-0 z-10 mt-2 min-w-[160px] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-luxury">
                {REGIONS.map((region) => (
                  <Button
                    key={region}
                    variant="light"
                    className={cn(
                      'h-auto w-full justify-start rounded-none px-4 py-2.5 text-xs font-medium',
                      regionFilter === region
                        ? 'text-primary'
                        : 'text-slate-600',
                    )}
                    onPress={() => {
                      setRegionFilter(region)
                      setFilterOpen(false)
                    }}
                  >
                    {region}
                  </Button>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
                <th className="px-8 py-4 sm:px-10">Program Name</th>
                <th className="px-8 py-4 sm:px-10">Region</th>
                <th className="px-8 py-4 sm:px-10">Status</th>
                <th className="px-8 py-4 sm:px-10">Funds Utilized</th>
                <th className="px-8 py-4 text-right sm:px-10">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((program, index) => (
                <motion.tr
                  key={program.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                  className="group transition-colors hover:bg-slate-50/80"
                >
                  <td className="px-8 py-6 font-semibold text-primary sm:px-10">
                    {program.name}
                  </td>
                  <td className="px-8 py-6 text-slate-600 sm:px-10">
                    {program.region}
                  </td>
                  <td className="px-8 py-6 sm:px-10">
                    {statusBadge(program.status)}
                  </td>
                  <td className="px-8 py-6 sm:px-10">
                    <div className="h-1.5 w-full max-w-[180px] overflow-hidden rounded-full bg-slate-100">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${program.budgetUsedPercent}%` }}
                        transition={{
                          duration: 0.6,
                          delay: 0.55 + index * 0.08,
                        }}
                        className="h-full rounded-full bg-accent"
                      />
                    </div>
                    <span className="mt-1 block text-[10px] text-slate-500">
                      {program.budgetUsedPercent}% of Budget Used
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right sm:px-10">
                    <Button
                      isIconOnly
                      variant="light"
                      className="text-primary data-[hover=true]:text-accent"
                      aria-label={`Actions for ${program.name}`}
                    >
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </motion.section>
  )
}
