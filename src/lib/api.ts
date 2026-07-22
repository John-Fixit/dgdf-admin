import axios from 'axios'
import type {
  AdminRole,
  AdminUser,
  Administrator,
  AdministratorsResponse,
  AuditLogFilters,
  AuditLogResponse,
  CreateAdministratorPayload,
  DashboardData,
  Donation,
  GalleryItem,
  GalleryUpdatePayload,
  GalleryUploadPayload,
  LeadershipMember,
  LeadershipMemberPayload,
  LoginCredentials,
  Message,
  ResetAdministratorPasswordPayload,
  SiteContentDocument,
  SiteSettings,
  UpdateAdministratorRolePayload,
  UpdateAdministratorStatusPayload,
  UpdateContentSectionPayload,
  UpdateSiteSettingsSectionPayload,
} from '@/lib/types'
import { useSessionStore } from '@/store/sessionStore'

/** Axios instance pointed at the API base URL (auth via httpOnly cookie) */
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:5002',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      const url = error.config?.url ?? ''
      const isAuthProbe =
        url.includes('/auth/login') ||
        url.includes('/auth/logout') ||
        url.includes('/auth/me')

      if (!isAuthProbe && !window.location.pathname.startsWith('/login')) {
        useSessionStore.getState().openExpired()
      }
    }
    return Promise.reject(error)
  },
)

type AuthUserPayload = {
  id: string
  email: string
  role: AdminRole
  name?: string
  status?: 'active' | 'inactive'
}

/**
 * Maps an API auth user payload to the admin UI shape.
 */
function mapAdminUser(user: AuthUserPayload): AdminUser {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name?.trim() || user.email.split('@')[0] || 'Admin',
    ...(user.status ? { status: user.status } : {}),
  }
}

type ApiEnvelope<T> = {
  success: boolean
  message?: string
  data: T
}

/**
 * Extracts a useful error message from an Axios failure.
 */
function apiErrorMessage(err: unknown, fallback: string): string {
  if (axios.isAxiosError(err)) {
    return (
      (err.response?.data as { message?: string } | undefined)?.message ||
      fallback
    )
  }
  if (err instanceof Error) return err.message
  return fallback
}

type ApiDonation = {
  _id: string
  donorName: string
  email: string
  amount: number
  currency?: string
  status: 'success' | 'pending' | 'failed'
  paystackRef?: string | null
  isAnonymous?: boolean
  createdAt: string
}

/**
 * Maps a backend donation document to the admin UI shape.
 */
function mapDonation(donation: ApiDonation): Donation {
  return {
    id: donation._id,
    donorName: donation.isAnonymous ? 'Anonymous' : donation.donorName,
    email: donation.email,
    amount: donation.amount,
    currency: donation.currency ?? 'NGN',
    status: donation.status,
    transactionId: donation.paystackRef ?? donation._id,
    isAnonymous: Boolean(donation.isAnonymous),
    createdAt: donation.createdAt,
  }
}

/**
 * Authenticates an admin user against the API.
 * Session JWT is set as an httpOnly cookie by the server.
 */
export async function login(credentials: LoginCredentials): Promise<AdminUser> {
  try {
    const response = await apiClient.post<ApiEnvelope<AuthUserPayload>>(
      '/auth/login',
      credentials,
    )
    return mapAdminUser(response.data.data)
  } catch (err) {
    throw new Error(apiErrorMessage(err, 'Login failed'))
  }
}

/**
 * Ends the admin session on the API (clears the httpOnly cookie).
 */
export async function logout(): Promise<void> {
  try {
    await apiClient.post('/auth/logout')
  } catch {
    // Clear local session even if the API call fails
  }
}

/**
 * Validates the current httpOnly session cookie and returns the user.
 * Returns null when there is no valid session.
 */
export async function fetchCurrentUser(): Promise<AdminUser | null> {
  try {
    const response =
      await apiClient.get<ApiEnvelope<AuthUserPayload>>('/auth/me')
    return mapAdminUser(response.data.data)
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 401) {
      return null
    }
    throw new Error(apiErrorMessage(err, 'Failed to validate session'))
  }
}

/**
 * Changes the authenticated admin's password.
 */
export async function changePassword(payload: {
  currentPassword: string
  newPassword: string
}): Promise<AdminUser> {
  try {
    const response = await apiClient.patch<ApiEnvelope<AuthUserPayload>>(
      '/auth/change-password',
      payload,
    )
    return mapAdminUser(response.data.data)
  } catch (err) {
    throw new Error(apiErrorMessage(err, 'Failed to update password'))
  }
}

/**
 * Updates the authenticated admin's profile display name.
 */
export async function updateProfile(payload: {
  name: string
}): Promise<AdminUser> {
  try {
    const response = await apiClient.patch<ApiEnvelope<AuthUserPayload>>(
      '/auth/update-profile',
      payload,
    )
    return mapAdminUser(response.data.data)
  } catch (err) {
    throw new Error(apiErrorMessage(err, 'Failed to update profile'))
  }
}

/**
 * Uploads an image for CMS fields (content / settings logos).
 */
export async function uploadMedia(
  file: File,
  folder = 'dgdf/cms',
): Promise<{ imageUrl: string; publicId: string }> {
  const form = new FormData()
  form.append('image', file)
  form.append('folder', folder)
  try {
    const response = await apiClient.post<
      ApiEnvelope<{ imageUrl: string; publicId: string }>
    >('/media/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data.data
  } catch (err) {
    throw new Error(apiErrorMessage(err, 'Upload failed'))
  }
}

/**
 * Fetches the aggregated admin dashboard payload.
 */
export async function fetchDashboard(): Promise<DashboardData> {
  try {
    const response =
      await apiClient.get<ApiEnvelope<DashboardData>>('/dashboard')
    return response.data.data
  } catch (err) {
    throw new Error(apiErrorMessage(err, 'Failed to load dashboard'))
  }
}

/**
 * Fetches all gallery items (admin: every status).
 */
export async function fetchGallery(): Promise<GalleryItem[]> {
  try {
    const response = await apiClient.get<ApiEnvelope<GalleryItem[]>>(
      '/gallery',
      { params: { all: true } },
    )
    return response.data.data ?? []
  } catch (err) {
    throw new Error(apiErrorMessage(err, 'Failed to load gallery'))
  }
}

/**
 * Uploads (creates) a new gallery item via multipart form.
 */
export async function uploadGalleryItem(
  payload: GalleryUploadPayload,
): Promise<GalleryItem> {
  if (!payload.file) {
    throw new Error('An image file is required')
  }
  const form = new FormData()
  form.append('image', payload.file)
  form.append('title', payload.title)
  form.append('description', payload.description)
  form.append('category', payload.category)
  form.append('status', payload.status)
  form.append('sortOrder', String(payload.sortOrder))
  form.append('mediaType', payload.mediaType)
  if (payload.location) form.append('location', payload.location)

  try {
    const response = await apiClient.post<ApiEnvelope<GalleryItem>>(
      '/gallery',
      form,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    )
    return response.data.data
  } catch (err) {
    throw new Error(apiErrorMessage(err, 'Failed to upload gallery item'))
  }
}

/**
 * Updates an existing gallery item.
 */
export async function updateGalleryItem(
  id: string,
  payload: GalleryUpdatePayload,
): Promise<GalleryItem> {
  const form = new FormData()
  form.append('title', payload.title)
  form.append('description', payload.description)
  form.append('category', payload.category)
  form.append('status', payload.status)
  form.append('sortOrder', String(payload.sortOrder))
  if (payload.location) form.append('location', payload.location)
  if (payload.file) form.append('image', payload.file)

  try {
    const response = await apiClient.patch<ApiEnvelope<GalleryItem>>(
      `/gallery/${id}`,
      form,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    )
    return response.data.data
  } catch (err) {
    throw new Error(apiErrorMessage(err, 'Failed to update gallery item'))
  }
}

/**
 * Deletes a gallery item by id.
 */
export async function deleteGalleryItem(id: string): Promise<void> {
  try {
    await apiClient.delete(`/gallery/${id}`)
  } catch (err) {
    throw new Error(apiErrorMessage(err, 'Failed to delete gallery item'))
  }
}

/**
 * Fetches all donations.
 */
export async function fetchDonations(): Promise<Donation[]> {
  try {
    const response = await apiClient.get<ApiEnvelope<ApiDonation[]>>(
      '/donations',
    )
    return (response.data.data ?? []).map(mapDonation)
  } catch (err) {
    throw new Error(apiErrorMessage(err, 'Failed to load donations'))
  }
}

/**
 * Fetches all contact messages.
 */
export async function fetchMessages(): Promise<Message[]> {
  try {
    const response = await apiClient.get<ApiEnvelope<Message[]>>('/messages')
    return response.data.data ?? []
  } catch (err) {
    throw new Error(apiErrorMessage(err, 'Failed to load messages'))
  }
}

/**
 * Marks a message as read.
 */
export async function markMessageRead(id: string): Promise<Message> {
  try {
    const response = await apiClient.patch<ApiEnvelope<Message>>(
      `/messages/${id}/read`,
    )
    return response.data.data
  } catch (err) {
    throw new Error(apiErrorMessage(err, 'Failed to mark message as read'))
  }
}

/**
 * Deletes a message by id.
 */
export async function deleteMessage(id: string): Promise<void> {
  try {
    await apiClient.delete(`/messages/${id}`)
  } catch (err) {
    throw new Error(apiErrorMessage(err, 'Failed to delete message'))
  }
}

/**
 * Fetches editable site content.
 */
export async function fetchContent(): Promise<SiteContentDocument> {
  try {
    const response =
      await apiClient.get<ApiEnvelope<SiteContentDocument>>('/content')
    return response.data.data
  } catch (err) {
    throw new Error(apiErrorMessage(err, 'Failed to load content'))
  }
}

/**
 * Updates the full site content document.
 */
export async function updateContent(
  payload: SiteContentDocument,
): Promise<SiteContentDocument> {
  try {
    const response = await apiClient.put<ApiEnvelope<SiteContentDocument>>(
      '/content',
      payload,
    )
    return response.data.data
  } catch (err) {
    throw new Error(apiErrorMessage(err, 'Failed to save content'))
  }
}

/**
 * Updates a single content section within a page.
 */
export async function updateContentSection(
  payload: UpdateContentSectionPayload,
): Promise<SiteContentDocument> {
  try {
    const response = await apiClient.patch<ApiEnvelope<SiteContentDocument>>(
      `/content/${payload.page}/${payload.section}`,
      { data: payload.data },
    )
    return response.data.data
  } catch (err) {
    throw new Error(apiErrorMessage(err, 'Failed to save content section'))
  }
}

/**
 * Fetches leadership members (admin: every status).
 */
export async function fetchLeadership(): Promise<LeadershipMember[]> {
  try {
    const response = await apiClient.get<ApiEnvelope<LeadershipMember[]>>(
      '/leadership',
      { params: { all: true } },
    )
    return response.data.data ?? []
  } catch (err) {
    throw new Error(apiErrorMessage(err, 'Failed to load leadership'))
  }
}

/**
 * Creates a leadership member.
 */
export async function createLeadershipMember(
  payload: LeadershipMemberPayload,
): Promise<LeadershipMember> {
  const form = new FormData()
  form.append('name', payload.name)
  form.append('role', payload.role)
  form.append('bio', payload.bio)
  form.append('sortOrder', String(payload.sortOrder))
  form.append('status', payload.status)
  form.append('isFounder', String(payload.isFounder))
  if (payload.file) {
    form.append('image', payload.file)
  } else if (payload.photoUrl) {
    form.append('photoUrl', payload.photoUrl)
  }

  try {
    const response = await apiClient.post<ApiEnvelope<LeadershipMember>>(
      '/leadership',
      form,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    )
    return response.data.data
  } catch (err) {
    throw new Error(apiErrorMessage(err, 'Failed to create leadership member'))
  }
}

/**
 * Updates a leadership member by id.
 */
export async function updateLeadershipMember(
  id: string,
  payload: LeadershipMemberPayload,
): Promise<LeadershipMember> {
  const form = new FormData()
  form.append('name', payload.name)
  form.append('role', payload.role)
  form.append('bio', payload.bio)
  form.append('sortOrder', String(payload.sortOrder))
  form.append('status', payload.status)
  form.append('isFounder', String(payload.isFounder))
  if (payload.file) {
    form.append('image', payload.file)
  } else if (payload.photoUrl) {
    form.append('photoUrl', payload.photoUrl)
  }

  try {
    const response = await apiClient.patch<ApiEnvelope<LeadershipMember>>(
      `/leadership/${id}`,
      form,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    )
    return response.data.data
  } catch (err) {
    throw new Error(apiErrorMessage(err, 'Failed to update leadership member'))
  }
}

/**
 * Deletes a leadership member by id.
 */
export async function deleteLeadershipMember(id: string): Promise<void> {
  try {
    await apiClient.delete(`/leadership/${id}`)
  } catch (err) {
    throw new Error(apiErrorMessage(err, 'Failed to delete leadership member'))
  }
}

/**
 * Fetches global site settings.
 */
export async function fetchSiteSettings(): Promise<SiteSettings> {
  try {
    const response =
      await apiClient.get<ApiEnvelope<SiteSettings>>('/settings')
    return response.data.data
  } catch (err) {
    throw new Error(apiErrorMessage(err, 'Failed to load site settings'))
  }
}

/**
 * Updates a single site-settings section.
 */
export async function updateSiteSettingsSection(
  payload: UpdateSiteSettingsSectionPayload,
): Promise<SiteSettings> {
  try {
    const response = await apiClient.patch<ApiEnvelope<SiteSettings>>(
      `/settings/${payload.section}`,
      { data: payload.data },
    )
    return response.data.data
  } catch (err) {
    throw new Error(apiErrorMessage(err, 'Failed to save site settings'))
  }
}

/**
 * Fetches audit trail records with optional filters.
 */
export async function fetchAuditLogs(
  filters: AuditLogFilters = {},
): Promise<AuditLogResponse> {
  const params: Record<string, string | number> = {}
  if (filters.from) params.from = filters.from
  if (filters.to) params.to = filters.to
  if (filters.actorId) params.actorId = filters.actorId
  if (filters.adminName) params.adminName = filters.adminName
  if (filters.search) params.search = filters.search
  if (filters.eventType) params.eventType = filters.eventType
  if (filters.page) params.page = filters.page
  if (filters.limit) params.limit = filters.limit

  try {
    const response = await apiClient.get<ApiEnvelope<AuditLogResponse>>(
      '/audit-logs',
      { params },
    )
    return (
      response.data.data ?? {
        items: [],
        users: [],
        eventTypes: [],
        page: 1,
        limit: 15,
        total: 0,
      }
    )
  } catch (err) {
    throw new Error(apiErrorMessage(err, 'Failed to load audit logs'))
  }
}

/**
 * Clears all audit log entries (super admin only).
 */
export async function deleteAuditLogs(): Promise<{ deletedCount: number }> {
  try {
    const response = await apiClient.delete<
      ApiEnvelope<{ deletedCount: number }>
    >('/audit-logs')
    return response.data.data ?? { deletedCount: 0 }
  } catch (err) {
    throw new Error(apiErrorMessage(err, 'Failed to clear audit logs'))
  }
}

/**
 * Records a donation Excel export in the audit log.
 */
export async function recordDonationExport(): Promise<void> {
  try {
    await apiClient.post('/donations/export-log')
  } catch (err) {
    throw new Error(apiErrorMessage(err, 'Failed to log donation export'))
  }
}

/**
 * Maps an administrator API payload.
 */
function mapAdministrator(admin: Administrator): Administrator {
  return {
    id: admin.id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
    status: admin.status,
    lastLogin: admin.lastLogin,
    createdAt: admin.createdAt,
    createdBy: admin.createdBy,
  }
}

/**
 * Fetches all administrators with stats.
 */
export async function fetchAdministrators(): Promise<AdministratorsResponse> {
  try {
    const response = await apiClient.get<ApiEnvelope<AdministratorsResponse>>(
      '/administrators',
    )
    const data = response.data.data
    return {
      items: (data?.items ?? []).map(mapAdministrator),
      stats: data?.stats ?? { total: 0, active: 0, viewers: 0 },
    }
  } catch (err) {
    throw new Error(apiErrorMessage(err, 'Failed to load administrators'))
  }
}

/**
 * Creates a new administrator.
 */
export async function createAdministrator(
  payload: CreateAdministratorPayload,
): Promise<Administrator> {
  try {
    const response = await apiClient.post<ApiEnvelope<Administrator>>(
      '/administrators',
      payload,
    )
    return mapAdministrator(response.data.data)
  } catch (err) {
    throw new Error(apiErrorMessage(err, 'Failed to create administrator'))
  }
}

/**
 * Updates an administrator's role.
 */
export async function updateAdministratorRole(
  id: string,
  payload: UpdateAdministratorRolePayload,
): Promise<Administrator> {
  try {
    const response = await apiClient.patch<ApiEnvelope<Administrator>>(
      `/administrators/${id}/role`,
      payload,
    )
    return mapAdministrator(response.data.data)
  } catch (err) {
    throw new Error(apiErrorMessage(err, 'Failed to update role'))
  }
}

/**
 * Updates an administrator's active/inactive status.
 */
export async function updateAdministratorStatus(
  id: string,
  payload: UpdateAdministratorStatusPayload,
): Promise<Administrator> {
  try {
    const response = await apiClient.patch<ApiEnvelope<Administrator>>(
      `/administrators/${id}/status`,
      payload,
    )
    return mapAdministrator(response.data.data)
  } catch (err) {
    throw new Error(apiErrorMessage(err, 'Failed to update status'))
  }
}

/**
 * Resets an administrator's password.
 */
export async function resetAdministratorPassword(
  id: string,
  payload: ResetAdministratorPasswordPayload,
): Promise<Administrator> {
  try {
    const response = await apiClient.patch<ApiEnvelope<Administrator>>(
      `/administrators/${id}/reset-password`,
      payload,
    )
    return mapAdministrator(response.data.data)
  } catch (err) {
    throw new Error(apiErrorMessage(err, 'Failed to reset password'))
  }
}
