import { useMutation } from '@tanstack/react-query'
import { changePassword, updateProfile } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'

/**
 * Changes the authenticated admin password.
 */
export function useChangePassword() {
  return useMutation({
    mutationFn: (payload: { currentPassword: string; newPassword: string }) =>
      changePassword(payload),
  })
}

/**
 * Updates the authenticated admin profile name and refreshes local auth state.
 */
export function useUpdateProfile() {
  const setUser = useAuthStore((s) => s.setUser)

  return useMutation({
    mutationFn: (payload: { name: string }) => updateProfile(payload),
    onSuccess: (user) => {
      setUser(user)
    },
  })
}
