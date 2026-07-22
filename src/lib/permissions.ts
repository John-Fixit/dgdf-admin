import type { AdminRole } from '@/lib/types'

/** Permission actions checked across the admin portal */
export type Action =
  | 'manageGallery'
  | 'manageContent'
  | 'manageAdmins'
  | 'viewAdmins'
  | 'deleteAuditLog'
  | 'exportData'

const ROLE_PERMISSIONS: Record<AdminRole, ReadonlySet<Action>> = {
  super_admin: new Set([
    'manageGallery',
    'manageContent',
    'manageAdmins',
    'viewAdmins',
    'deleteAuditLog',
    'exportData',
  ]),
  admin: new Set([
    'manageGallery',
    'manageContent',
    'viewAdmins',
    'exportData',
  ]),
  viewer: new Set([]),
}

/**
 * Returns whether a role is allowed to perform an action.
 */
export function can(role: AdminRole | undefined | null, action: Action): boolean {
  if (!role) return false
  return ROLE_PERMISSIONS[role]?.has(action) ?? false
}

/**
 * Toast copy used when a restricted action is triggered.
 */
export const PERMISSION_DENIED_MESSAGE =
  "You don't have permission to perform this action"
