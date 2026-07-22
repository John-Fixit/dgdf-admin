/** Application-wide constants */

export const APP_NAME = 'DGD'
export const APP_TAGLINE = 'Foundation Admin'

/** Local storage key for persisted auth session */
export const AUTH_STORAGE_KEY = 'dgd-admin-auth'

/** Query keys for TanStack Query */
export const QUERY_KEYS = {
  gallery: ['gallery'] as const,
  donations: ['donations'] as const,
  messages: ['messages'] as const,
  content: ['content'] as const,
  leadership: ['leadership'] as const,
  settings: ['settings'] as const,
  dashboard: ['dashboard'] as const,
  auditLogs: ['audit-logs'] as const,
  administrators: ['administrators'] as const,
} as const

export type NavIconName =
  | 'LayoutDashboard'
  | 'FileText'
  | 'Users'
  | 'Images'
  | 'Settings'
  | 'SlidersHorizontal'
  | 'HeartHandshake'
  | 'Mail'
  | 'ScrollText'

export interface NavItem {
  label: string
  path: string
  icon: NavIconName
}

export interface NavGroup {
  id: string
  label: string
  items: NavItem[]
}

/**
 * Grouped sidebar navigation — Overview / Content / Operations.
 */
export const NAV_GROUPS: NavGroup[] = [
  {
    id: 'overview',
    label: 'Overview',
    items: [
      { label: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard' },
    ],
  },
  {
    id: 'content',
    label: 'Content',
    items: [
      { label: 'Content Manager', path: '/content', icon: 'FileText' },
      { label: 'Leadership', path: '/leadership', icon: 'Users' },
      { label: 'Gallery', path: '/gallery', icon: 'Images' },
      { label: 'Site Settings', path: '/site-settings', icon: 'SlidersHorizontal' },
    ],
  },
  {
    id: 'operations',
    label: 'Operations',
    items: [
      { label: 'Donations', path: '/donations', icon: 'HeartHandshake' },
      { label: 'Messages', path: '/messages', icon: 'Mail' },
      { label: 'Settings', path: '/settings', icon: 'Settings' },
      { label: 'Administrators', path: '/administrators', icon: 'Users' },
      { label: 'Audit Log', path: '/audit-log', icon: 'ScrollText' },
    ],
  },
]

/** Flat list kept for route lookups / breadcrumbs */
export const NAV_ITEMS: NavItem[] = NAV_GROUPS.flatMap((group) => group.items)

/** Human-readable page titles keyed by path */
export const PAGE_TITLES: Record<string, string> = Object.fromEntries(
  NAV_ITEMS.map((item) => [item.path, item.label]),
)
