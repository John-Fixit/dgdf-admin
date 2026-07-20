import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  type Selection,
} from '@heroui/react'
import { Badge } from '@/components/ui'
import { formatDate, truncate, cn } from '@/lib/utils'
import type { Message } from '@/lib/types'

interface MessagesListProps {
  messages: Message[]
  selectedId: string | null
  checkedKeys: Selection
  onSelect: (id: string) => void
  onCheckedChange: (keys: Selection) => void
}

const columns = [
  { key: 'from', label: 'From' },
  { key: 'subject', label: 'Subject' },
  { key: 'received', label: 'Received' },
  { key: 'status', label: 'Status' },
] as const

/**
 * HeroUI inbox table with checkbox selection and row activation for detail view.
 */
export function MessagesList({
  messages,
  selectedId,
  checkedKeys,
  onSelect,
  onCheckedChange,
}: MessagesListProps): React.ReactElement {
  return (
    <Table
      aria-label="Contact messages"
      removeWrapper
      selectionMode="multiple"
      selectionBehavior="toggle"
      selectedKeys={checkedKeys}
      onSelectionChange={onCheckedChange}
      onRowAction={(key) => onSelect(String(key))}
      checkboxesProps={{
        classNames: {
          wrapper: 'after:bg-primary after:text-primary-foreground text-primary',
        },
      }}
      classNames={{
        base: 'min-h-[280px]',
        table: 'min-w-[560px]',
        thead: '[&>tr]:first:shadow-none',
        th: 'bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-400 first:rounded-none last:rounded-none',
        td: 'py-4',
        tr: 'cursor-pointer border-b border-slate-100 data-[hover=true]:bg-slate-50/80',
      }}
    >
      <TableHeader columns={[...columns]}>
        {(column) => (
          <TableColumn
            key={column.key}
            align={column.key === 'status' ? 'center' : 'start'}
          >
            {column.label}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        items={messages}
        emptyContent={
          <span className="text-sm text-slate-400">
            No messages match your search.
          </span>
        }
      >
        {(message) => (
          <TableRow
            key={message.id}
            className={cn(
              message.id === selectedId && 'bg-slate-100/80 data-[hover=true]:bg-slate-100/80',
            )}
          >
            <TableCell>
              <div className="max-w-[180px]">
                <p
                  className={cn(
                    'truncate text-sm text-primary',
                    message.read ? 'font-medium' : 'font-semibold',
                  )}
                >
                  {message.name}
                </p>
                <p className="truncate text-xs text-slate-400">{message.email}</p>
              </div>
            </TableCell>
            <TableCell>
              <span className="line-clamp-1 max-w-[220px] text-slate-600">
                {truncate(message.subject, 48)}
              </span>
            </TableCell>
            <TableCell>
              <span className="whitespace-nowrap text-slate-500">
                {formatDate(message.createdAt)}
              </span>
            </TableCell>
            <TableCell>
              <Badge
                variant={message.read ? 'success' : 'warning'}
                className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize"
              >
                {message.read ? 'Read' : 'Unread'}
              </Badge>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
