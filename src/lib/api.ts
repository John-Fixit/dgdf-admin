import axios from 'axios'
import { MOCK_CREDENTIALS, MOCK_DELAY_MS } from '@/lib/constants'
import type {
  AdminUser,
  DashboardStats,
  Donation,
  GalleryItem,
  GalleryUploadPayload,
  LoginCredentials,
  Message,
  SiteContentDocument,
} from '@/lib/types'
import { delay } from '@/lib/utils'
import {
  computeDashboardStats,
  mockContent,
  mockDonations,
  mockGallery,
  mockMessages,
  mockUser,
} from '@/mock-data'

/** Axios instance pointed at the API base URL */
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

/** In-memory mutable stores backing mock API responses */
let galleryStore: GalleryItem[] = [...mockGallery]
let donationsStore: Donation[] = [...mockDonations]
let messagesStore: Message[] = [...mockMessages]
let contentStore: SiteContentDocument = structuredClone(mockContent)

/**
 * Authenticates an admin user with mock credentials.
 * Falls back to mock when the real API is unavailable.
 */
export async function login(credentials: LoginCredentials): Promise<AdminUser> {
  await delay(MOCK_DELAY_MS)

  const { email, password } = credentials
  if (
    email === MOCK_CREDENTIALS.email &&
    password === MOCK_CREDENTIALS.password
  ) {
    return { ...mockUser }
  }

  throw new Error('Invalid email or password')
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
  await delay(MOCK_DELAY_MS)
  return [...donationsStore]
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
