import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { addToast } from '@heroui/react'
import {
  createAdministrator,
  fetchAdministrators,
  resetAdministratorPassword,
  updateAdministratorRole,
  updateAdministratorStatus,
} from '@/lib/api'
import { QUERY_KEYS } from '@/lib/constants'
import type {
  CreateAdministratorPayload,
  ResetAdministratorPasswordPayload,
  UpdateAdministratorRolePayload,
  UpdateAdministratorStatusPayload,
} from '@/lib/types'

/**
 * Fetches administrators list + stats.
 */
export function useAdministrators() {
  return useQuery({
    queryKey: QUERY_KEYS.administrators,
    queryFn: fetchAdministrators,
  })
}

/**
 * Creates a new administrator and invalidates the list.
 */
export function useCreateAdministrator() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateAdministratorPayload) =>
      createAdministrator(payload),
    onSuccess: (admin) => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.administrators })
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.auditLogs })
      addToast({
        title: 'Administrator created',
        description: `${admin.name} was added as ${admin.role}`,
        color: 'success',
      })
    },
    onError: (err: Error) => {
      addToast({
        title: err.message || 'Failed to create administrator',
        color: 'danger',
      })
    },
  })
}

/**
 * Updates an administrator's role.
 */
export function useUpdateAdministratorRole() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: UpdateAdministratorRolePayload
    }) => updateAdministratorRole(id, payload),
    onSuccess: (admin) => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.administrators })
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.auditLogs })
      addToast({
        title: 'Role updated',
        description: `${admin.name} is now ${admin.role}`,
        color: 'success',
      })
    },
    onError: (err: Error) => {
      addToast({
        title: err.message || 'Failed to update role',
        color: 'danger',
      })
    },
  })
}

/**
 * Activates or deactivates an administrator.
 */
export function useUpdateAdministratorStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: UpdateAdministratorStatusPayload
    }) => updateAdministratorStatus(id, payload),
    onSuccess: (admin) => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.administrators })
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.auditLogs })
      addToast({
        title:
          admin.status === 'active'
            ? 'Administrator reactivated'
            : 'Administrator deactivated',
        color: 'success',
      })
    },
    onError: (err: Error) => {
      addToast({
        title: err.message || 'Failed to update status',
        color: 'danger',
      })
    },
  })
}

/**
 * Resets an administrator's password.
 */
export function useResetAdministratorPassword() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: ResetAdministratorPasswordPayload
    }) => resetAdministratorPassword(id, payload),
    onSuccess: (admin) => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.auditLogs })
      addToast({
        title: 'Password reset',
        description: `${admin.name} must sign in with the new password`,
        color: 'success',
      })
    },
    onError: (err: Error) => {
      addToast({
        title: err.message || 'Failed to reset password',
        color: 'danger',
      })
    },
  })
}
