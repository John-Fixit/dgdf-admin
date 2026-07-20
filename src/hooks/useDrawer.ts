import { useDrawerStore } from '@/store/drawerStore'
import type { OpenDrawerOptions } from '@/store/drawerStore'

/**
 * Convenience hook for opening/closing the shared app drawer.
 */
export function useDrawer() {
  const openDrawer = useDrawerStore((s) => s.openDrawer)
  const closeDrawer = useDrawerStore((s) => s.closeDrawer)
  const isOpen = useDrawerStore((s) => s.isOpen)

  return {
    isOpen,
    open: (options: OpenDrawerOptions) => openDrawer(options),
    close: () => closeDrawer(),
  }
}
