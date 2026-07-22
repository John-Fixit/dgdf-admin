import { Suspense } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Sidebar } from './Sidebar'
import { TopNav } from './TopNav'
import { AppDrawer, ConfirmModal, LoadingSpinner } from '@/components/shared'
import { useUiStore } from '@/store/uiStore'
import { cn } from '@/lib/utils'

/**
 * Shell layout for authenticated admin pages.
 * Sidebar stays mounted; only the main pane suspends on lazy page loads.
 */
export function AdminLayout(): React.ReactElement {
  const location = useLocation()
  const sidebarCollapsed = useUiStore((s) => s.sidebarCollapsed)

  return (
    <div className="min-h-svh bg-surface">
      <Sidebar />

      <div
        className={cn(
          'flex min-h-svh min-w-0 flex-col transition-[margin] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
          sidebarCollapsed ? 'lg:ml-[68px]' : 'lg:ml-[260px]',
        )}
      >
        <TopNav />
        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-9">
          <div className="mx-auto w-full max-w-[1280px]">
            <Suspense
              fallback={
                <LoadingSpinner
                  label="Loading…"
                  className="min-h-[40vh]"
                  size="md"
                />
              }
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={location.pathname}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Outlet />
                </motion.div>
              </AnimatePresence>
            </Suspense>
          </div>
        </main>
      </div>

      <AppDrawer />
      <ConfirmModal />
    </div>
  )
}
