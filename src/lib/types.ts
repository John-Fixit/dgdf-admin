/** Authenticated admin user */
export interface AdminUser {
  id: string
  email: string
  name: string
  role: 'admin'
  /** JWT used as Bearer token for API calls */
  token?: string
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

/** Outreach program row for dashboard table */
export interface OutreachProgram {
  id: string
  name: string
  region: string
  status: 'active' | 'in_review' | 'paused'
  budgetUsedPercent: number
}

/** Impact chart bar point */
export interface ImpactChartPoint {
  label: string
  value: number
  isPeak?: boolean
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
  createdAt: string
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
export type ContentPageKey = 'home' | 'about' | 'donate' | 'contact'

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
  donate: DonateContentSection
  contact: ContactContentSection
  lastUpdatedAt: string
}

/** Section keys within each page */
export type HomeSectionKey = keyof HomeContentSection
export type AboutSectionKey = keyof AboutContentSection
export type DonateSectionKey = keyof DonateContentSection
export type ContactSectionKey = keyof ContactContentSection

export type ContentSectionKey =
  | HomeSectionKey
  | AboutSectionKey
  | DonateSectionKey
  | ContactSectionKey

/** Payload for saving a single content section */
export interface UpdateContentSectionPayload {
  page: ContentPageKey
  section: ContentSectionKey
  data: Record<string, string | number>
}

/** Dashboard summary metrics */
export interface DashboardStats {
  donationsTotal: number
  donationsCount: number
  messagesUnread: number
  galleryCount: number
  contentKeys: number
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
