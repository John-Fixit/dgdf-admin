import { create } from 'zustand'

interface UiState {
  /** Desktop sidebar collapsed (icon rail) */
  sidebarCollapsed: boolean
  /** Mobile drawer open */
  mobileOpen: boolean
  /** Toggles desktop collapse */
  toggleCollapsed: () => void
  /** Sets desktop collapse explicitly */
  setSidebarCollapsed: (collapsed: boolean) => void
  /** Toggles mobile drawer */
  toggleMobileOpen: () => void
  /** Sets mobile drawer open state */
  setMobileOpen: (open: boolean) => void
}

/**
 * Zustand store for UI chrome state (sidebar, etc.).
 */
export const useUiStore = create<UiState>((set) => ({
  sidebarCollapsed: false,
  mobileOpen: false,

  toggleCollapsed: () => {
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed }))
  },

  setSidebarCollapsed: (collapsed) => {
    set({ sidebarCollapsed: collapsed })
  },

  toggleMobileOpen: () => {
    set((state) => ({ mobileOpen: !state.mobileOpen }))
  },

  setMobileOpen: (open) => {
    set({ mobileOpen: open })
  },
}))
