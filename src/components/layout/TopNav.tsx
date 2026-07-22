import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { ChevronRight, Menu, Search } from 'lucide-react'
import { Button } from '@heroui/react'
import { Input } from '@/components/ui'
import { PAGE_TITLES } from '@/lib/constants'
import { useUiStore } from '@/store/uiStore'
import { NotificationBell } from './NotificationBell'

/**
 * Resolves a breadcrumb-friendly title for the current route.
 */
function resolvePageTitle(pathname: string): string {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname]
  const match = Object.keys(PAGE_TITLES).find(
    (path) => path !== '/' && pathname.startsWith(path),
  )
  return match ? PAGE_TITLES[match]! : 'Admin'
}

/**
 * Slim top bar — context, search, and utilities.
 */
export function TopNav(): React.ReactElement {
  const location = useLocation()
  const toggleMobileOpen = useUiStore((s) => s.toggleMobileOpen)
  const pageTitle = useMemo(
    () => resolvePageTitle(location.pathname),
    [location.pathname],
  )

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <Button
          isIconOnly
          variant="light"
          size="sm"
          onPress={toggleMobileOpen}
          aria-label="Open navigation"
          className="h-8 w-8 min-w-8 shrink-0 text-slate-600 data-[hover=true]:bg-slate-100 lg:hidden"
        >
          <Menu className="h-4 w-4" />
        </Button>

        <nav
          aria-label="Breadcrumb"
          className="hidden min-w-0 items-center gap-1.5 text-[13px] sm:flex"
        >
          <span className="text-slate-400">Workspace</span>
          <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-300" aria-hidden />
          <span className="truncate font-medium text-slate-800">{pageTitle}</span>
        </nav>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative hidden md:block">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400"
            aria-hidden
          />
          <Input
            type="search"
            placeholder="Search…"
            className="h-9 w-52 border-slate-200 bg-slate-50/80 pl-9 text-[13px] shadow-none transition-colors placeholder:text-slate-400 focus-visible:border-slate-300 focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-primary/15 lg:w-64"
            aria-label="Search"
          />
        </div>

        <NotificationBell />
      </div>
    </header>
  )
}
