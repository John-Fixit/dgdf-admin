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
  dashboard: ['dashboard'] as const,
} as const

/** Navigation items for the admin sidebar */
export const NAV_ITEMS = [
  { label: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard' },
  { label: 'Gallery', path: '/gallery', icon: 'Images' },
  { label: 'Content', path: '/content', icon: 'FileText' },
  { label: 'Donations', path: '/donations', icon: 'HeartHandshake' },
  { label: 'Messages', path: '/messages', icon: 'Mail' },
] as const

/** Simulated API latency in milliseconds */
export const MOCK_DELAY_MS = 400
