import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Button } from '@heroui/react'
import {
  ChevronLeft,
  Church,
  FileText,
  HeartHandshake,
  Images,
  LayoutDashboard,
  LogOut,
  Mail,
  X,
} from 'lucide-react'
import { APP_NAME, APP_TAGLINE, NAV_ITEMS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { useAuth, useConfirm, useMessages } from '@/hooks'
import { useUiStore } from '@/store/uiStore'

const iconMap = {
  LayoutDashboard,
  Images,
  FileText,
  HeartHandshake,
  Mail,
} as const

/**
 * Returns initials from a display name for the avatar fallback.
 */
function getUserInitials(name?: string | null): string {
  if (!name?.trim()) return 'DG'
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return 'DG'
  const first = parts[0] ?? ''
  if (parts.length === 1) return first.slice(0, 2).toUpperCase()
  const last = parts[parts.length - 1] ?? ''
  return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase()
}

/**
 * Fixed admin sidebar with desktop collapse and mobile drawer.
 */
export function Sidebar(): React.ReactElement {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { confirm } = useConfirm()
  const messagesQuery = useMessages()
  const unreadCount =
    messagesQuery.data?.filter((message) => !message.read).length ?? 0

  const sidebarCollapsed = useUiStore((s) => s.sidebarCollapsed)
  const mobileOpen = useUiStore((s) => s.mobileOpen)
  const toggleCollapsed = useUiStore((s) => s.toggleCollapsed)
  const setMobileOpen = useUiStore((s) => s.setMobileOpen)

  const userInitials = getUserInitials(user?.name)

  /**
   * Closes the mobile drawer after navigation.
   */
  function handleNavigate(): void {
    setMobileOpen(false)
  }

  /**
   * Confirms sign-out, clears session, and returns to login.
   */
  async function handleSignOut(): Promise<void> {
    const confirmed = await confirm({
      title: 'Sign out?',
      description:
        'You will need to sign in again to access the admin portal.',
      confirmLabel: 'Sign out',
      cancelLabel: 'Cancel',
      variant: 'danger',
    })
    if (!confirmed) return

    logout()
    navigate('/login', { replace: true })
  }

  return (
    <>
      <Button
        aria-hidden={!mobileOpen}
        tabIndex={mobileOpen ? 0 : -1}
        onPress={() => setMobileOpen(false)}
        variant="light"
        disableAnimation
        className={cn(
          'fixed inset-0 z-40 h-auto min-h-0 w-auto min-w-0 rounded-none bg-black/45 p-0 backdrop-blur-[2px] transition-opacity duration-200 data-[hover=true]:bg-black/45 lg:hidden',
          mobileOpen
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none opacity-0',
        )}
        aria-label="Close sidebar"
      />

      <aside
        aria-label="Admin navigation"
        className={cn(
          'fixed left-0 top-0 z-50 flex h-svh flex-col bg-sidebar py-5 shadow-2xl',
          'w-[280px] transition-[transform,width] duration-300 ease-out',
          sidebarCollapsed ? 'lg:w-[76px]' : 'lg:w-[280px]',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
      >
        <div
          className={cn(
            'mb-2 flex items-center gap-3 px-5 transition-[padding] duration-200',
            sidebarCollapsed && 'lg:justify-center lg:px-3',
          )}
        >
          <Link
            to="/dashboard"
            onClick={handleNavigate}
            className="flex shrink-0 items-center gap-2"
            aria-label={`${APP_NAME} home`}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-accent/80 bg-primary text-accent shadow-inner">
              <Church className="h-5 w-5" aria-hidden />
            </span>
          </Link>

          <div
            className={cn(
              'min-w-0 transition-[opacity,transform] duration-200',
              sidebarCollapsed &&
                'lg:pointer-events-none lg:-translate-x-2 lg:opacity-0 lg:w-0 lg:overflow-hidden',
            )}
          >
            <h1 className="truncate font-display text-base font-bold text-white">
              {APP_NAME}
            </h1>
            <p className="truncate text-[11px] uppercase tracking-wider text-white/50">
              {APP_TAGLINE}
            </p>
          </div>

          <Button
            isIconOnly
            variant="light"
            onPress={() => setMobileOpen(false)}
            className="ml-auto text-white/70 data-[hover=true]:bg-white/10 data-[hover=true]:text-white lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav
          className="sidebar-scroll mt-6 min-h-0 flex-1 space-y-0.5 overflow-y-auto overflow-x-hidden px-3"
          aria-label="Primary"
        >
          {NAV_ITEMS.map((item) => {
            const badge =
              item.path === '/messages' && unreadCount > 0
                ? unreadCount
                : undefined

            return (
              <SidebarLink
                key={item.path}
                path={item.path}
                label={item.label}
                icon={item.icon}
                badge={badge}
                collapsed={sidebarCollapsed}
                onNavigate={handleNavigate}
              />
            )
          })}
        </nav>

        <div className="mt-3 px-3">
          <div
            className={cn(
              'flex items-center gap-3 rounded-xl bg-white/[0.06] p-2.5 ring-1 ring-white/10 transition-all',
              sidebarCollapsed && 'lg:justify-center lg:p-2',
            )}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-bold text-accent-foreground shadow-inner">
              {userInitials}
            </div>

            <div
              className={cn(
                'min-w-0 flex-1 transition-[opacity,width] duration-200',
                sidebarCollapsed &&
                  'lg:pointer-events-none lg:w-0 lg:overflow-hidden lg:opacity-0',
              )}
            >
              <p className="truncate text-sm font-medium text-white">
                {user?.name ?? 'Admin User'}
              </p>
              <p className="truncate text-[11px] text-white/50">
                {user?.title ?? 'Administrator'}
              </p>
            </div>

            <Button
              isIconOnly
              variant="light"
              size="sm"
              className={cn(
                'text-white/60 data-[hover=true]:bg-white/10 data-[hover=true]:text-white',
                sidebarCollapsed && 'lg:hidden',
              )}
              aria-label="Sign out"
              onPress={() => void handleSignOut()}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Button
          variant="light"
          onPress={toggleCollapsed}
          className="mx-3 mt-3 hidden h-8 min-h-8 items-center justify-center gap-2 rounded-lg bg-white/[0.04] text-xs font-medium text-white/60 ring-1 ring-white/10 data-[hover=true]:bg-white/10 data-[hover=true]:text-white lg:flex"
          aria-label={
            sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'
          }
          aria-pressed={sidebarCollapsed}
          startContent={
            <ChevronLeft
              className={cn(
                'h-3.5 w-3.5 transition-transform duration-200',
                sidebarCollapsed && 'rotate-180',
              )}
            />
          }
        >
          {!sidebarCollapsed ? 'Collapse' : null}
        </Button>
      </aside>
    </>
  )
}

function SidebarLink({
  path,
  label,
  icon,
  badge,
  collapsed,
  onNavigate,
}: {
  path: string
  label: string
  icon: keyof typeof iconMap
  badge?: number
  collapsed: boolean
  onNavigate?: () => void
}): React.ReactElement {
  const Icon = iconMap[icon]

  return (
    <NavLink
      to={path}
      onClick={onNavigate}
      title={collapsed ? label : undefined}
      className={({ isActive }) =>
        cn(
          'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium outline-none transition-all duration-200',
          collapsed && 'lg:justify-center lg:gap-0 lg:px-2',
          isActive
            ? 'bg-white/[0.08] text-white'
            : 'text-white/65 hover:bg-white/[0.05] hover:text-white',
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            className={cn(
              'h-[19px] w-[19px] shrink-0 transition-colors',
              isActive
                ? 'text-accent'
                : 'text-white/65 group-hover:text-white',
            )}
            aria-hidden
          />
          <span
            className={cn(
              'flex-1 truncate transition-[opacity,width] duration-200',
              collapsed &&
                'lg:pointer-events-none lg:w-0 lg:overflow-hidden lg:opacity-0',
            )}
          >
            {label}
          </span>
          {badge != null && badge > 0 && !collapsed ? (
            <span className="ml-auto rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-bold text-accent">
              {badge > 99 ? '99+' : badge}
            </span>
          ) : null}
          {badge != null && badge > 0 && collapsed ? (
            <span
              className="absolute right-2 top-2 hidden h-2 w-2 rounded-full bg-accent lg:block"
              aria-label={`${badge} pending`}
            />
          ) : null}
          {isActive ? (
            <span
              className="absolute right-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-l-full bg-accent"
              aria-hidden
            />
          ) : null}
        </>
      )}
    </NavLink>
  )
}
