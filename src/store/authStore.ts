import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AUTH_STORAGE_KEY } from '@/lib/constants'
import type { AdminUser, LoginCredentials } from '@/lib/types'
import { login as apiLogin, logout as apiLogout } from '@/lib/api'

interface AuthState {
  user: AdminUser | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  /** Authenticates against the API and persists the session */
  login: (credentials: LoginCredentials) => Promise<boolean>
  /** Ends the API session and clears local auth state */
  logout: () => Promise<void>
  /** Clears local auth without calling the API (e.g. expired session) */
  clearSession: () => void
  /** Clears any auth error message */
  clearError: () => void
}

/**
 * Zustand store for authentication state.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials) => {
        set({ isLoading: true, error: null })
        try {
          const user = await apiLogin(credentials)
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })
          return true
        } catch (err) {
          const message =
            err instanceof Error ? err.message : 'Login failed'
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: message,
          })
          return false
        }
      },

      logout: async () => {
        await apiLogout()
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        })
      },

      clearSession: () => {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        })
      },

      clearError: () => {
        set({ error: null })
      },
    }),
    {
      name: AUTH_STORAGE_KEY,
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)
