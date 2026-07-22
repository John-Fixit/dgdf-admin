import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AUTH_STORAGE_KEY } from '@/lib/constants'
import type { AdminUser, LoginCredentials } from '@/lib/types'
import {
  fetchCurrentUser,
  login as apiLogin,
  logout as apiLogout,
} from '@/lib/api'

interface AuthState {
  user: AdminUser | null
  isAuthenticated: boolean
  /** False until the first /auth/me cookie check finishes */
  isHydrated: boolean
  isLoading: boolean
  error: string | null
  /** Authenticates against the API; JWT is stored as an httpOnly cookie */
  login: (credentials: LoginCredentials) => Promise<boolean>
  /** Ends the API session and clears local auth state */
  logout: () => Promise<void>
  /** Validates the httpOnly session cookie via GET /auth/me */
  hydrateSession: () => Promise<void>
  /** Updates the cached profile after a successful profile save */
  setUser: (user: AdminUser) => void
  /** Clears local auth without calling the API (e.g. expired session) */
  clearSession: () => void
  /** Clears any auth error message */
  clearError: () => void
}

/**
 * Zustand store for authentication state.
 * Profile may be cached in localStorage; the JWT never is (httpOnly cookie only).
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isHydrated: false,
      isLoading: false,
      error: null,

      login: async (credentials) => {
        set({ isLoading: true, error: null })
        try {
          const user = await apiLogin(credentials)
          set({
            user,
            isAuthenticated: true,
            isHydrated: true,
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
          isHydrated: true,
          isLoading: false,
          error: null,
        })
      },

      hydrateSession: async () => {
        try {
          const user = await fetchCurrentUser()
          if (user) {
            set({
              user,
              isAuthenticated: true,
              isHydrated: true,
              error: null,
            })
            return
          }
          set({
            user: null,
            isAuthenticated: false,
            isHydrated: true,
            error: null,
          })
        } catch {
          // Network blips: keep any cached profile but mark hydration done
          // so the UI can proceed; API 401s will still clear the session.
          set({ isHydrated: true })
        }
      },

      setUser: (user) => {
        set({ user, isAuthenticated: true, error: null })
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
        user: state.user
          ? {
              id: state.user.id,
              email: state.user.email,
              name: state.user.name,
              role: state.user.role,
              ...(state.user.title ? { title: state.user.title } : {}),
            }
          : null,
        isAuthenticated: state.isAuthenticated,
      }),
      // Drop any legacy JWT that may still be in older persisted payloads.
      merge: (persisted, current) => {
        const stored = persisted as Partial<AuthState> | undefined
        const rawUser = stored?.user as (AdminUser & { token?: string }) | null
        let user: AdminUser | null = null
        if (rawUser) {
          user = {
            id: rawUser.id,
            email: rawUser.email,
            name: rawUser.name,
            role: rawUser.role,
            ...(rawUser.title ? { title: rawUser.title } : {}),
          }
        }
        return {
          ...current,
          ...stored,
          user,
          // Always re-validate the cookie before trusting auth.
          isAuthenticated: false,
          isHydrated: false,
        }
      },
    },
  ),
)
