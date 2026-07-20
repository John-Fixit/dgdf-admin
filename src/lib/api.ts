import axios from 'axios'
import { AUTH_STORAGE_KEY, MOCK_DELAY_MS } from '@/lib/constants'
import type {
  AdminUser,
  DashboardStats,
  Donation,
  GalleryItem,
  GalleryUploadPayload,
  LoginCredentials,
  Message,
  SiteContentDocument,
  UpdateContentSectionPayload,
} from '@/lib/types'
import { delay } from '@/lib/utils'
import {
  computeDashboardStats,
  mockContent,
  mockDonations,
  mockGallery,
  mockMessages,
} from '@/mock-data'
import { useSessionStore } from '@/store/sessionStore'

/** Axios instance pointed at the API base URL */
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:5002',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

apiClient.interceptors.request.use((config) => {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as { state?: { user?: { token?: string } } }
      const token = parsed.state?.user?.token
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
  } catch {
    // ignore malformed auth storage
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      const url = error.config?.url ?? ''
      const isAuthRequest =
        url.includes('/auth/login') || url.includes('/auth/logout')

      if (!isAuthRequest && !window.location.pathname.startsWith('/login')) {
        useSessionStore.getState().openExpired()
      }
    }
    return Promise.reject(error)
  },
)

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

/** In-memory mutable stores backing mock API responses */
let galleryStore: GalleryItem[] = [...mockGallery]
let donationsStore: Donation[] = [...mockDonations]
let messagesStore: Message[] = [...mockMessages]
let contentStore: SiteContentDocument = structuredClone(mockContent)

/**
 * Authenticates an admin user against the API.
 */
export async function login(credentials: LoginCredentials): Promise<AdminUser> {
  try {
    const response = await apiClient.post<{
      success: boolean
      data: { id: string; email: string; role: 'admin'; token: string }
    }>('/auth/login', credentials)

    const user = response.data.data
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      token: user.token,
      name: user.email.split('@')[0] || 'Admin',
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      throw new Error(
        (err.response?.data as { message?: string } | undefined)?.message ||
          'Login failed',
      )
    }
    throw err
  }
}

/**
 * Ends the admin session on the API.
 */
export async function logout(): Promise<void> {
  try {
    await apiClient.post('/auth/logout')
  } catch {
    // Clear local session even if the API call fails
  }
}

/**
 * Fetches dashboard summary statistics.
 */
export async function fetchDashboardStats(): Promise<DashboardStats> {
  await delay(MOCK_DELAY_MS)
  return computeDashboardStats(
    galleryStore,
    donationsStore,
    messagesStore,
    contentStore,
  )
}

/**
 * Fetches all gallery items.
 */
export async function fetchGallery(): Promise<GalleryItem[]> {
  await delay(MOCK_DELAY_MS)
  return [...galleryStore]
}

/**
 * Uploads (creates) a new gallery item.
 */
export async function uploadGalleryItem(
  payload: GalleryUploadPayload,
): Promise<GalleryItem> {
  await delay(MOCK_DELAY_MS)
  const format =
    payload.imageUrl.split('.').pop()?.toUpperCase().slice(0, 4) ?? 'JPG'
  const item: GalleryItem = {
    id: `gal-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    title: payload.title,
    description: payload.description,
    category: payload.category,
    imageUrl: payload.imageUrl,
    fileSize: '—',
    format: ['JPG', 'JPEG', 'PNG', 'WEBP', 'MP4', 'WEBM'].includes(format)
      ? format === 'JPEG'
        ? 'JPG'
        : format
      : 'JPG',
    createdAt: new Date().toISOString(),
  }
  galleryStore = [item, ...galleryStore]
  return item
}

/**
 * Deletes a gallery item by id.
 */
export async function deleteGalleryItem(id: string): Promise<void> {
  await delay(MOCK_DELAY_MS)
  galleryStore = galleryStore.filter((item) => item.id !== id)
}

/**
 * Fetches all donations.
 */
export async function fetchDonations(): Promise<Donation[]> {
  try {
    const response = await apiClient.get<{
      success: boolean
      data: ApiDonation[]
    }>('/donations')
    return (response.data.data ?? []).map(mapDonation)
  } catch (err) {
    if (axios.isAxiosError(err)) {
      throw new Error(
        (err.response?.data as { message?: string } | undefined)?.message ||
          'Failed to load donations',
      )
    }
    throw err
  }
}

/**
 * Fetches all contact messages.
 */
export async function fetchMessages(): Promise<Message[]> {
  await delay(MOCK_DELAY_MS)
  return [...messagesStore]
}

/**
 * Marks a message as read.
 */
export async function markMessageRead(id: string): Promise<Message> {
  await delay(MOCK_DELAY_MS)
  const index = messagesStore.findIndex((m) => m.id === id)
  if (index === -1) {
    throw new Error('Message not found')
  }
  const existing = messagesStore[index]
  if (!existing) {
    throw new Error('Message not found')
  }
  const updated: Message = { ...existing, read: true }
  messagesStore = [
    ...messagesStore.slice(0, index),
    updated,
    ...messagesStore.slice(index + 1),
  ]
  return updated
}

/**
 * Deletes a message by id.
 */
export async function deleteMessage(id: string): Promise<void> {
  await delay(MOCK_DELAY_MS)
  messagesStore = messagesStore.filter((m) => m.id !== id)
}

/**
 * Fetches editable site content.
 */
export async function fetchContent(): Promise<SiteContentDocument> {
  await delay(MOCK_DELAY_MS)
  return structuredClone(contentStore)
}

/**
 * Updates the full site content document.
 */
export async function updateContent(
  payload: SiteContentDocument,
): Promise<SiteContentDocument> {
  await delay(MOCK_DELAY_MS)
  contentStore = {
    ...structuredClone(payload),
    lastUpdatedAt: new Date().toISOString(),
  }
  return structuredClone(contentStore)
}

/**
 * Updates a single content section within a page.
 */
export async function updateContentSection(
  payload: UpdateContentSectionPayload,
): Promise<SiteContentDocument> {
  await delay(MOCK_DELAY_MS)
  const { page, section, data } = payload
  const next = structuredClone(contentStore)
  const pageContent = next[page] as unknown as Record<string, Record<string, string | number>>
  pageContent[section] = { ...data }
  next.lastUpdatedAt = new Date().toISOString()
  contentStore = next
  return structuredClone(contentStore)
}
