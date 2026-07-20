/** Authenticated admin user */
export interface AdminUser {
  id: string
  email: string
  name: string
  role: 'admin'
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
  status: 'completed' | 'pending' | 'failed'
  /** Public-facing transaction reference (e.g. DGD-9021) */
  transactionId: string
  message?: string
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

/** Editable site content fields */
export interface SiteContent {
  vision: string
  mandate: string
  aboutText: string
  heroHeadline: string
  missionText: string
}

/** Home page editorial sections for the public site */
export interface HomeContentSection {
  heroHeadline: string
  missionText: string
  establishedYear: string
  mandateHeadline: string
  mandateQuote: string
  vision: string
  mandate: string
  aboutText: string
  visionHeadline: string
  impactCallout: string
  impactCalloutBody: string
  livesImpacted: string
  outreaches: string
  volunteers: string
  successRate: string
  donateCtaHeadline: string
  donateCtaBody: string
  donateCtaPrimary: string
}

/** About page editorial sections */
export interface AboutContentSection {
  label: string
  headline: string
  headlineAccent: string
  headlineSuffix: string
  intro: string
  missionTitle: string
  missionBody: string
  visionTitle: string
  visionBody: string
  quote: string
  journeyLabel: string
  journeyHeadline: string
  leadershipLabel: string
  leadershipHeadline: string
  ctaHeadline: string
  ctaBody: string
  ctaPrimary: string
  ctaSecondary: string
}

/** Founder page editorial sections */
export interface FounderContentSection {
  label: string
  name: string
  role: string
  intro: string
  articleLabel: string
  articleHeadline: string
  articleBody: string
  quote: string
  quoteAttribution: string
  ctaHeadline: string
  ctaBody: string
  ctaPrimary: string
  ctaSecondary: string
}

/** Donate page editorial sections */
export interface DonateContentSection {
  heroLabel: string
  heroHeadline: string
  heroAccent: string
  heroBody: string
  impactTitle: string
  impactQuote: string
  transparencyLabel: string
  transparencyHeadline: string
  transparencyBody: string
}

/** Contact page editorial sections */
export interface ContactContentSection {
  label: string
  headline: string
  body: string
  quote: string
  addressLines: string
  emailLines: string
  phoneLines: string
  officeHours: string
  inquiryOptions: string
}

/** Gallery page copy (assets stay in Gallery Manager) */
export interface GalleryCopySection {
  heroLabel: string
  heroHeadline: string
  heroBody: string
  ctaHeadline: string
  ctaBody: string
  ctaPrimary: string
}

/**
 * Full public-site content document managed by the Content Control Center.
 * Wired to mock API until backend content routes expand beyond flat keys.
 */
export interface SiteContentDocument {
  home: HomeContentSection
  about: AboutContentSection
  founder: FounderContentSection
  donate: DonateContentSection
  contact: ContactContentSection
  gallery: GalleryCopySection
  lastUpdatedAt: string
}

/** Content page keys shown in the control center nav */
export type ContentPageKey = keyof Omit<SiteContentDocument, 'lastUpdatedAt'>

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
