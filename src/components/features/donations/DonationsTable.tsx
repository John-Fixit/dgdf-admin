import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Download, Filter, MoreVertical, Search } from 'lucide-react'
import { Button, Pagination } from '@heroui/react'
import * as XLSX from 'xlsx'
import { Badge, Input } from '@/components/ui'
import { LoadingSpinner } from '@/components/shared'
import { useDonations } from '@/hooks'
import { cn, formatCurrency, formatDate } from '@/lib/utils'
import type { Donation } from '@/lib/types'

const EASE = [0.22, 1, 0.36, 1] as const
const PAGE_SIZE = 5

type StatusFilter = 'all' | Donation['status']

const AVATAR_TONES = [
  'bg-accent/15 text-amber-800',
  'bg-amber-900/10 text-amber-900',
  'bg-primary/10 text-primary',
] as const

/**
 * Maps donation status to a badge variant.
 */
function statusVariant(
  status: Donation['status'],
): 'success' | 'warning' | 'error' {
  if (status === 'completed') return 'success'
  if (status === 'pending') return 'warning'
  return 'error'
}

/**
 * Builds two-letter initials from a donor name.
 */
function donorInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  const first = parts[0] ?? ''
  if (parts.length === 1) return first.slice(0, 2).toUpperCase()
  const last = parts[parts.length - 1] ?? ''
  return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase()
}

/**
 * Downloads filtered donation rows as an Excel (.xlsx) workbook.
 */
function exportExcel(rows: Donation[]): void {
  const sheetData = rows.map((d) => ({
    'Donor Name': d.donorName,
    Email: d.email,
    'Transaction ID': d.transactionId,
    Amount: d.amount,
    Currency: d.currency,
    Status: d.status,
    Date: formatDate(d.createdAt),
  }))

  const worksheet = XLSX.utils.json_to_sheet(sheetData)
  worksheet['!cols'] = [
    { wch: 22 },
    { wch: 28 },
    { wch: 16 },
    { wch: 12 },
    { wch: 10 },
    { wch: 12 },
    { wch: 14 },
  ]

  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Donation Records')
  XLSX.writeFile(
    workbook,
    `donation-records-${new Date().toISOString().slice(0, 10)}.xlsx`,
  )
}

/**
 * Donation records table with search, status filter, pagination, and Excel export.
 */
export function DonationsTable(): React.ReactElement {
  const { data, isLoading, isError, error, refetch } = useDonations()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [filterOpen, setFilterOpen] = useState(false)
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const items = data ?? []
    const q = search.trim().toLowerCase()

    return items.filter((donation) => {
      if (statusFilter !== 'all' && donation.status !== statusFilter) {
        return false
      }
      if (!q) return true
      return (
        donation.donorName.toLowerCase().includes(q) ||
        donation.transactionId.toLowerCase().includes(q) ||
        donation.email.toLowerCase().includes(q)
      )
    })
  }, [data, search, statusFilter])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, pageCount)
  const pageItems = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  )

  const showingFrom =
    filtered.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1
  const showingTo = Math.min(safePage * PAGE_SIZE, filtered.length)

  if (isLoading) {
    return <LoadingSpinner label="Loading donations…" />
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-error/20 bg-error/5 p-8 text-center">
        <p className="mb-3 text-sm text-error">
          {error instanceof Error ? error.message : 'Failed to load donations'}
        </p>
        <Button variant="bordered" size="sm" onPress={() => void refetch()}>
          Try again
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search & filter bar */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.05, ease: EASE }}
        aria-label="Search and filter donations"
        className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50/80 p-5"
      >
        <div className="relative min-w-[240px] flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden
          />
          <Input
            type="search"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value)
              setPage(1)
            }}
            placeholder="Search donor name or transaction ID…"
            className="h-11 border-slate-200 bg-white pl-10 shadow-none"
            aria-label="Search donations"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <Button
              variant="bordered"
              className="h-11 border-slate-200 bg-white"
              onPress={() => setFilterOpen((open) => !open)}
              aria-expanded={filterOpen}
              aria-haspopup="listbox"
              startContent={<Filter className="h-4 w-4" />}
            >
              Filter
              {statusFilter !== 'all' ? (
                <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold uppercase text-primary">
                  {statusFilter}
                </span>
              ) : null}
            </Button>
            {filterOpen ? (
              <ul
                role="listbox"
                className="absolute right-0 z-20 mt-2 min-w-[160px] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-luxury"
              >
                {(
                  [
                    ['all', 'All statuses'],
                    ['completed', 'Completed'],
                    ['pending', 'Pending'],
                    ['failed', 'Failed'],
                  ] as const
                ).map(([value, label]) => (
                  <li key={value}>
                    <Button
                      variant="light"
                      role="option"
                      aria-selected={statusFilter === value}
                      className={cn(
                        'h-auto w-full justify-start rounded-none px-4 py-2.5 text-xs font-medium',
                        statusFilter === value
                          ? 'text-primary'
                          : 'text-slate-600',
                      )}
                      onPress={() => {
                        setStatusFilter(value)
                        setPage(1)
                        setFilterOpen(false)
                      }}
                    >
                      {label}
                    </Button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <Button
            variant="bordered"
            className="h-11 border-slate-200 bg-white"
            onPress={() => exportExcel(filtered)}
            isDisabled={filtered.length === 0}
            startContent={<Download className="h-4 w-4" />}
          >
            Export Excel
          </Button>
        </div>
      </motion.section>

      {/* Records table */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.12, ease: EASE }}
        className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card"
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead>
              <tr className="bg-primary text-primary-foreground">
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider sm:px-8">
                  Donor Name
                </th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider sm:px-8">
                  Amount
                </th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider sm:px-8">
                  Date
                </th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider sm:px-8">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-[11px] font-bold uppercase tracking-wider sm:px-8">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pageItems.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-slate-400 sm:px-8"
                  >
                    No donation records match your search.
                  </td>
                </tr>
              ) : (
                pageItems.map((donation, index) => (
                  <motion.tr
                    key={donation.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.25,
                      delay: index * 0.04,
                      ease: EASE,
                    }}
                    className={cn(
                      'transition-colors hover:bg-slate-50/80',
                      index % 2 === 1 && 'bg-slate-50/50',
                    )}
                  >
                    <td className="px-6 py-5 sm:px-8">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            'flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold',
                            AVATAR_TONES[index % AVATAR_TONES.length],
                          )}
                          aria-hidden
                        >
                          {donorInitials(donation.donorName)}
                        </div>
                        <div>
                          <p className="font-semibold text-primary">
                            {donation.donorName}
                          </p>
                          <p className="text-xs text-slate-400">
                            Transaction: #{donation.transactionId}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 font-semibold text-primary sm:px-8">
                      {formatCurrency(donation.amount, donation.currency)}
                    </td>
                    <td className="px-6 py-5 text-slate-500 sm:px-8">
                      {formatDate(donation.createdAt)}
                    </td>
                    <td className="px-6 py-5 sm:px-8">
                      <Badge
                        variant={statusVariant(donation.status)}
                        className="rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-tight"
                      >
                        {donation.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-5 text-right sm:px-8">
                      <Button
                        isIconOnly
                        variant="light"
                        className="text-slate-400 data-[hover=true]:text-primary"
                        aria-label={`Actions for ${donation.donorName}`}
                      >
                        <MoreVertical className="h-5 w-5" />
                      </Button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2, ease: EASE }}
          className="flex flex-col items-center justify-between gap-4 border-t border-slate-100 px-6 py-5 sm:flex-row sm:px-8"
        >
          <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400">
            Showing {showingFrom} to {showingTo} of{' '}
            {filtered.length.toLocaleString('en-NG')} entries
          </span>

          <Pagination
            page={safePage}
            total={pageCount}
            onChange={setPage}
            showControls
            color="primary"
            classNames={{
              cursor: 'bg-primary text-white font-bold',
              item: 'border border-slate-200 bg-white',
            }}
          />
        </motion.div>
      </motion.div>
    </div>
  )
}
