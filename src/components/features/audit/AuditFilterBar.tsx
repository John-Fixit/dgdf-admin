import { Search, X } from 'lucide-react'
import { Button } from '@heroui/react'
import { Input } from '@/components/ui'

export interface AuditFiltersState {
  search: string
  adminName: string
  from: string
  to: string
}

interface AuditFilterBarProps {
  filters: AuditFiltersState
  onChange: (next: AuditFiltersState) => void
  onClear: () => void
}

/**
 * Search and filter bar for the audit log page.
 */
export function AuditFilterBar({
  filters,
  onChange,
  onClear,
}: AuditFilterBarProps): React.ReactElement {
  const hasFilters =
    Boolean(filters.search.trim()) ||
    Boolean(filters.adminName.trim()) ||
    Boolean(filters.from) ||
    Boolean(filters.to)

  return (
    <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-card sm:p-5">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden
          />
          <Input
            value={filters.search}
            onChange={(e) =>
              onChange({ ...filters, search: e.target.value })
            }
            placeholder="Search by action keyword"
            className="pl-9"
            aria-label="Search audit log"
          />
        </div>

        <Input
          value={filters.adminName}
          onChange={(e) =>
            onChange({ ...filters, adminName: e.target.value })
          }
          placeholder="Filter by admin name"
          aria-label="Filter by admin name"
        />

        <Input
          type="date"
          value={filters.from}
          onChange={(e) => onChange({ ...filters, from: e.target.value })}
          aria-label="From date"
        />

        <Input
          type="date"
          value={filters.to}
          onChange={(e) => onChange({ ...filters, to: e.target.value })}
          aria-label="To date"
        />
      </div>

      {hasFilters ? (
        <div className="mt-3 flex justify-end">
          <Button
            size="sm"
            variant="light"
            className="text-slate-500"
            startContent={<X className="h-3.5 w-3.5" />}
            onPress={onClear}
          >
            Clear filters
          </Button>
        </div>
      ) : null}
    </div>
  )
}
