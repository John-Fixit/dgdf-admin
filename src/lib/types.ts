/** Authenticated admin user roles */
export type AdminRole = 'super_admin' | 'admin' | 'viewer'

/** Authenticated admin user (JWT stays in httpOnly cookie only) */
export interface AdminUser {
  id: string
  email: string
  name: string
  role: AdminRole
  status?: 'active' | 'inactive'
  /** Display title shown in the sidebar profile */
  title?: string
}

/** Dashboard activity feed item */
export interface ActivityItem {
  id: string
  type: 'donation' | 'story' | 'update' | 'system'
  title: string
  highlight?: string
  timeAgo: string
  avatarUrl?: string
  actorName?: string
}

/** Recent donation row for dashboard table */
export interface DashboardRecentDonation {
  id: string
  donorName: string
  email: string
  amount: number
  currency: string
  status: 'success' | 'pending' | 'failed'
  createdAt: string
}

/** @deprecated Legacy mock shape — unused by live dashboard */
export interface OutreachProgram {
  id: string
  name: string
  region: string
  status: 'active' | 'in_review' | 'paused'
  budgetUsedPercent: number
}

/** Impact chart bar point (value is a raw amount; UI normalizes bar height) */
export interface ImpactChartPoint {
  label: string
  value: number
  isPeak?: boolean
}

/** Single metric card on the dashboard */
export interface DashboardMetricCard {
  label: string
  value: string
  trend?: string
  trendPositive?: boolean
  subtitle: string
}

/** Donation / fund channel share for dashboard breakdown */
export interface FundChannel {
  id: string
  label: string
  percent: number
  amountLabel: string
  tone: 'primary' | 'accent' | 'warm' | 'slate'
}

/** Dashboard attention / alert item */
export interface DashboardAlert {
  id: string
  severity: 'critical' | 'warning' | 'info'
  title: string
  detail: string
  href: string
  actionLabel: string
}

/** Gallery image item */
export interface GalleryItem {
  id: string
  title: string
  description: string
  imageUrl: string
  category: string
  status: 'active' | 'draft' | 'archived'
  sortOrder: number
  mediaType: 'image' | 'video'
  createdAt: string
  updatedAt: string
  /** Optional location label shown in card meta (e.g. Lagos) */
  location?: string
  /** Display file size (e.g. "1.2 MB") */
  fileSize?: string
  /** File format label (e.g. "JPG") */
  format?: string
}

/** Payload for uploading a gallery item */
export interface GalleryUploadPayload {
  title: string
  description: string
  category: string
  imageUrl: string
  status: 'active' | 'draft' | 'archived'
  sortOrder: number
  mediaType: 'image' | 'video'
  location?: string
  /** Local file for multipart upload */
  file?: File
}

/** Payload for updating an existing gallery item */
export interface GalleryUpdatePayload {
  title: string
  description: string
  category: string
  imageUrl: string
  status: 'active' | 'draft' | 'archived'
  sortOrder: number
  location?: string
  /** Optional replacement image */
  file?: File
}

/** Donation record */
export interface Donation {
  id: string
  donorName: string
  email: string
  amount: number
  currency: string
  status: 'success' | 'pending' | 'failed'
  /** Paystack transaction reference */
  transactionId: string
  isAnonymous: boolean
  createdAt: string
}

/** Contact / inquiry message */
export interface Message {
  id: string
  name: string
  email: string
  subject: string
  body: string
  read: boolean
  createdAt: string
  /** Optional phone number from the contact form */
  phone?: string
}

/** Editable site content fields (legacy flat shape) */
export interface SiteContent {
  vision: string
  mandate: string
  aboutText: string
  heroHeadline: string
  missionText: string
}

/** Content Manager page tabs */
export type ContentPageKey =
  | 'home'
  | 'about'
  | 'founder'
  | 'gallery'
  | 'donate'
  | 'contact'

/** Home page editable sections */
export interface HomeContentSection {
  hero: {
    headline: string
    paragraph: string
  }
  mission: {
    title: string
    body: string
  }
  visionMandateImpact: {
    vision: string
    mandate: string
    impactSummary: string
  }
  impactStats: {
    livesImpacted: number
    outreaches: number
    volunteers: number
    successRate: number
  }
  donateCta: {
    headline: string
    subtext: string
  }
}

/** About page editable sections */
export interface AboutContentSection {
  hero: {
    headline: string
    subtext: string
  }
  story: {
    title: string
    body: string
  }
  mandateQuote: {
    quote: string
  }
  leadership: {
    heading: string
    subtext: string
  }
}

/** Founder page editable sections */
export interface FounderContentSection {
  profile: {
    label: string
    name: string
    role: string
    photoUrl: string
    intro: string
  }
  article: {
    label: string
    headline: string
    body: string
  }
  quote: {
    quote: string
    attribution: string
  }
  cta: {
    headline: string
    body: string
    primaryLabel: string
    secondaryLabel: string
  }
}

/** Gallery page editorial copy (media assets stay in Gallery Manager) */
export interface GalleryContentSection {
  hero: {
    label: string
    headline: string
    body: string
  }
  testimonial: {
    quote: string
    name: string
    role: string
    photoUrl: string
  }
  cta: {
    headline: string
    body: string
    primaryLabel: string
    secondaryLabel: string
  }
}

/** Donate page editable sections */
export interface DonateContentSection {
  hero: {
    headline: string
    subtext: string
  }
  impactStats: {
    peopleReached: number
    outreaches: number
  }
  testimonial: {
    quote: string
    donorName: string
    donorRole: string
  }
}

/** Contact page editable sections */
export interface ContactContentSection {
  hero: {
    headline: string
    subtext: string
  }
  info: {
    phone: string
    email: string
    address: string
    officeHours: string
  }
  social: {
    facebook: string
    instagram: string
    youtube: string
  }
}

/**
 * Full public-site content document managed by Content Manager.
 * Mock-backed until backend content routes are connected.
 */
export interface SiteContentDocument {
  home: HomeContentSection
  about: AboutContentSection
  founder: FounderContentSection
  gallery: GalleryContentSection
  donate: DonateContentSection
  contact: ContactContentSection
  lastUpdatedAt: string
}

/** Section keys within each page */
export type HomeSectionKey = keyof HomeContentSection
export type AboutSectionKey = keyof AboutContentSection
export type FounderSectionKey = keyof FounderContentSection
export type GalleryContentSectionKey = keyof GalleryContentSection
export type DonateSectionKey = keyof DonateContentSection
export type ContactSectionKey = keyof ContactContentSection

export type ContentSectionKey =
  | HomeSectionKey
  | AboutSectionKey
  | FounderSectionKey
  | GalleryContentSectionKey
  | DonateSectionKey
  | ContactSectionKey

/** Payload for saving a single content section */
export interface UpdateContentSectionPayload {
  page: ContentPageKey
  section: ContentSectionKey
  data: Record<string, string | number>
}

/** Leadership / board member shown on the public About page */
export interface LeadershipMember {
  id: string
  name: string
  role: string
  bio: string
  photoUrl: string
  sortOrder: number
  status: 'published' | 'draft'
  /** When true, links to the public founder profile page */
  isFounder: boolean
  createdAt: string
  updatedAt: string
}

/** Payload for creating or updating a leadership member */
export interface LeadershipMemberPayload {
  name: string
  role: string
  bio: string
  photoUrl: string
  sortOrder: number
  status: 'published' | 'draft'
  isFounder: boolean
  /** Local file for multipart upload */
  file?: File
}

/** Global site settings controlled from the admin portal */
export interface SiteSettings {
  organization: {
    name: string
    tagline: string
    logoUrl: string
  }
  contact: {
    phone: string
    email: string
    address: string
    officeHours: string
  }
  social: {
    facebook: string
    instagram: string
    youtube: string
    twitter: string
  }
  lastUpdatedAt: string
}

export type SiteSettingsSectionKey = 'organization' | 'contact' | 'social'

/** Payload for saving one site-settings section */
export interface UpdateSiteSettingsSectionPayload {
  section: SiteSettingsSectionKey
  data: Record<string, string>
}

/** Dashboard summary metrics (legacy counts) */
export interface DashboardStats {
  donationsTotal: number
  donationsCount: number
  messagesUnread: number
  galleryCount: number
  contentKeys: number
}

/** Full live dashboard payload from GET /dashboard */
export interface DashboardData {
  metrics: {
    donations: DashboardMetricCard
    livesImpacted: DashboardMetricCard
    gallery: DashboardMetricCard
    unreadMessages: DashboardMetricCard
  }
  chart: {
    monthly: ImpactChartPoint[]
    yearly: ImpactChartPoint[]
  }
  activity: ActivityItem[]
  donationStatus: FundChannel[]
  alerts: DashboardAlert[]
  recentDonations: DashboardRecentDonation[]
  counts: DashboardStats & {
    donationsSuccessCount?: number
    leadershipCount?: number
  }
}

/** Generic API error shape */
export interface ApiError {
  message: string
  status?: number
}

/** Login credentials */
export interface LoginCredentials {
  email: string
  password: string
}

/** Audit trail actor */
export interface AuditActor {
  id: string
  email: string
  name: string
  role?: string
}

/** Single audit log entry */
export interface AuditLogEntry {
  id: string
  action: 'create' | 'update' | 'delete'
  entity:
    | 'gallery'
    | 'leadership'
    | 'content'
    | 'settings'
    | 'message'
    | 'donation'
    | 'admin'
    | 'auth'
  entityId: string
  entityLabel: string
  entityTypeLabel: string
  eventType: string
  actor: AuditActor
  adminName?: string
  adminRole?: string
  details?: string
  ipAddress?: string
  category?: 'auth' | 'gallery' | 'content' | 'donation' | 'message' | 'admin'
  changes: string[]
  metadata?: Record<string, unknown>
  createdAt: string
  timestamp?: string
}

/** Filters for the audit log list */
export interface AuditLogFilters {
  from?: string
  to?: string
  actorId?: string
  adminName?: string
  search?: string
  eventType?: string
  page?: number
  limit?: number
}

/** Paginated audit log response with filter facets */
export interface AuditLogResponse {
  items: AuditLogEntry[]
  users: AuditActor[]
  eventTypes: string[]
  page: number
  limit: number
  total: number
  pageCount?: number
}

/** Administrator account managed from the admin portal */
export interface Administrator {
  id: string
  name: string
  email: string
  role: AdminRole
  status: 'active' | 'inactive'
  lastLogin: string | null
  createdAt: string | null
  createdBy: string | null
}

/** Aggregate stats for the administrators page */
export interface AdministratorStats {
  total: number
  active: number
  viewers: number
}

/** Response from GET /administrators */
export interface AdministratorsResponse {
  items: Administrator[]
  stats: AdministratorStats
}

/** Payload to create a new administrator */
export interface CreateAdministratorPayload {
  name: string
  email: string
  role: 'admin' | 'viewer'
  password: string
}

/** Payload to change an administrator's role */
export interface UpdateAdministratorRolePayload {
  role: 'admin' | 'viewer'
  reason?: string
}

/** Payload to change an administrator's status */
export interface UpdateAdministratorStatusPayload {
  status: 'active' | 'inactive'
}

/** Payload to reset an administrator's password */
export interface ResetAdministratorPasswordPayload {
  password: string
}
