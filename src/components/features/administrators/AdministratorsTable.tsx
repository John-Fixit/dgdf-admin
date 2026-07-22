import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Pagination,
} from '@heroui/react'
import { MoreVertical } from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'
import type { Administrator } from '@/lib/types'
import { RoleBadge } from './RoleBadge'
import { AdminStatusBadge } from './AdminStatusBadge'

const EASE = [0.22, 1, 0.36, 1] as const
const PAGE_SIZE = 10

const AVATAR_TONES = [
  'bg-accent/15 text-amber-800',
  'bg-primary/10 text-primary',
  'bg-emerald-100 text-emerald-800',
  'bg-slate-200 text-slate-700',
] as const

interface AdministratorsTableProps {
  items: Administrator[]
  canManage: boolean
  onEditRole: (admin: Administrator) => void
  onResetPassword: (admin: Administrator) => void
  onToggleStatus: (admin: Administrator) => void
}

/**
 * Builds two-letter initials from a name.
 */
function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  const first = parts[0] ?? ''
  if (parts.length === 1) return first.slice(0, 2).toUpperCase()
  const last = parts[parts.length - 1] ?? ''
  return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase()
}

/**
 * Administrators table with navy header, alternating rows, and pagination.
 */
export function AdministratorsTable({
  items,
  canManage,
  onEditRole,
  onResetPassword,
  onToggleStatus,
}: AdministratorsTableProps): React.ReactElement {
  const [page, setPage] = useState(1)

  const pageCount = Math.max(1, Math.ceil(items.length / PAGE_SIZE))
  const safePage = Math.min(page, pageCount)
  const pageItems = useMemo(
    () =>
      items.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE),
    [items, safePage],
  )

  const showingFrom =
    items.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1
  const showingTo = Math.min(safePage * PAGE_SIZE, items.length)

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.08, ease: EASE }}
      className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card"
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <thead>
            <tr className="bg-primary text-primary-foreground">
              <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider sm:px-8">
                Administrator
              </th>
              <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider sm:px-8">
                Role
              </th>
              <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider sm:px-8">
                Status
              </th>
              <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider sm:px-8">
                Last Login
              </th>
              {canManage ? (
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider sm:px-8">
                  Actions
                </th>
              ) : null}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {pageItems.length === 0 ? (
              <tr>
                <td
                  colSpan={canManage ? 5 : 4}
                  className="px-6 py-12 text-center text-slate-400 sm:px-8"
                >
                  No administrators found.
                </td>
              </tr>
            ) : (
              pageItems.map((admin, index) => (
                <motion.tr
                  key={admin.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.25,
                    delay: index * 0.04,
                    ease: EASE,
                  }}
                  className={cn(
                    'transition-colors',
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
                        {initials(admin.name)}
                      </div>
                      <div>
                        <p className="font-semibold text-primary">
                          {admin.name}
                        </p>
                        <p className="text-xs text-slate-400">{admin.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 sm:px-8">
                    <RoleBadge role={admin.role} />
                  </td>
                  <td className="px-6 py-5 sm:px-8">
                    <AdminStatusBadge status={admin.status} />
                  </td>
                  <td className="px-6 py-5 text-slate-500 sm:px-8">
                    {admin.lastLogin ? formatDate(admin.lastLogin) : 'Never'}
                  </td>
                  {canManage ? (
                    <td className="px-6 py-5 sm:px-8">
                      {admin.role === 'super_admin' ? (
                        <span className="text-xs text-slate-400">—</span>
                      ) : (
                        <Dropdown>
                          <DropdownTrigger>
                            <Button
                              isIconOnly
                              variant="light"
                              size="sm"
                              aria-label={`Actions for ${admin.name}`}
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownTrigger>
                          <DropdownMenu aria-label="Administrator actions">
                            <DropdownItem
                              key="edit-role"
                              onPress={() => onEditRole(admin)}
                            >
                              Edit Role
                            </DropdownItem>
                            <DropdownItem
                              key="reset-password"
                              onPress={() => onResetPassword(admin)}
                            >
                              Reset Password
                            </DropdownItem>
                            <DropdownItem
                              key="toggle-status"
                              className={
                                admin.status === 'active'
                                  ? 'text-rose-600'
                                  : 'text-emerald-700'
                              }
                              color={
                                admin.status === 'active' ? 'danger' : 'success'
                              }
                              onPress={() => onToggleStatus(admin)}
                            >
                              {admin.status === 'active'
                                ? 'Deactivate'
                                : 'Reactivate'}
                            </DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      )}
                    </td>
                  ) : null}
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-100 px-6 py-5 sm:flex-row sm:px-8">
        <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400">
          Showing {showingFrom} to {showingTo} of{' '}
          {items.length.toLocaleString('en-NG')} entries
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
      </div>
    </motion.div>
  )
}
