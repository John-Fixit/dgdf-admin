import { create } from 'zustand'
import { pathToFromParam } from '@/lib/authRedirect'

interface SessionState {
  isExpiredOpen: boolean
  from: string
  /** Opens the session-expired modal for the current (or given) page */
  openExpired: (pathname?: string) => void
  closeExpired: () => void
}

/**
 * Global session-expired modal state (triggered by API 401 responses).
 */
export const useSessionStore = create<SessionState>((set, get) => ({
  isExpiredOpen: false,
  from: 'dashboard',

  openExpired: (pathname) => {
    if (get().isExpiredOpen) return
    set({
      isExpiredOpen: true,
      from: pathToFromParam(pathname ?? window.location.pathname),
    })
  },

  closeExpired: () => {
    set({ isExpiredOpen: false })
  },
}))
