import { flexRender, type Table as TanstackTable } from '@tanstack/react-table'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface DataTableProps<TData> {
  table: TanstackTable<TData>
  className?: string
}

/**
 * Animated data table built on TanStack Table.
 */
export function DataTable<TData>({
  table,
  className,
}: DataTableProps<TData>): React.ReactElement {
  const rows = table.getRowModel().rows

  return (
    <div
      className={cn(
        'w-full overflow-x-auto rounded-xl border border-slate-100 bg-white shadow-card',
        className,
      )}
    >
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="border-b border-slate-100 bg-slate-50/80">
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={table.getAllColumns().length}
                className="px-4 py-10 text-center text-slate-400"
              >
                No records found.
              </td>
            </tr>
          ) : (
            rows.map((row, index) => (
              <motion.tr
                key={row.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: index * 0.04 }}
                className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3 text-slate-700">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </motion.tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
