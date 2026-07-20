import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AUTH_STORAGE_KEY, MOCK_CREDENTIALS } from '@/lib/constants'
import type { AdminUser, LoginCredentials } from '@/lib/types'
import { login as apiLogin } from '@/lib/api'

interface AuthState {
  user: AdminUser | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  /** Authenticates with mock credentials and persists the session */
  login: (credentials: LoginCredentials) => Promise<boolean>
  /** Clears the authenticated session */
  logout: () => void
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

      logout: () => {
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

/** Re-export mock credentials for the login form hint */
export { MOCK_CREDENTIALS }
