import type {
  ActivityItem,
  AdminUser,
  DashboardAlert,
  DashboardStats,
  Donation,
  FundChannel,
  GalleryItem,
  ImpactChartPoint,
  Message,
  OutreachProgram,
  SiteContentDocument,
} from "@/lib/types";

/** Mock authenticated admin user */
export const mockUser: AdminUser = {
  id: "admin-1",
  email: "admin@dgdelightfound.org",
  name: "Admin User",
  role: "admin",
  title: "Lead Coordinator",
};

/** Seed gallery images */
export const mockGallery: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Elderly Outreach Dec 2023',
    description: 'Volunteers distributing supplies to elderly community members.',
    imageUrl:
      'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&q=80',
    category: 'Impact Event',
    location: 'Lagos',
    fileSize: '1.2 MB',
    format: 'JPG',
    createdAt: '2026-06-12T10:00:00.000Z',
  },
  {
    id: 'gal-2',
    title: 'Clean Water Project Phase 1',
    description: 'Community borehole infrastructure in a rural village.',
    imageUrl:
      'https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=800&q=80',
    category: 'Infrastructure',
    fileSize: '2.8 MB',
    format: 'PNG',
    createdAt: '2026-05-28T14:30:00.000Z',
  },
  {
    id: 'gal-3',
    title: 'School Sponsorship Program',
    description: 'Students engaged in a foundation-supported classroom.',
    imageUrl:
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80',
    category: 'Education',
    fileSize: '1.5 MB',
    format: 'JPG',
    createdAt: '2026-05-10T09:15:00.000Z',
  },
  {
    id: 'gal-4',
    title: 'Food Distribution Logistics',
    description: 'Rice packages prepared for weekend outreach distribution.',
    imageUrl:
      'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80',
    category: 'Outreach',
    fileSize: '940 KB',
    format: 'JPG',
    createdAt: '2026-04-22T18:00:00.000Z',
  },
  {
    id: 'gal-5',
    title: 'Community Hub Architecture',
    description: 'Newly built community center at golden hour.',
    imageUrl:
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
    category: 'Infrastructure',
    fileSize: '3.2 MB',
    format: 'RAW',
    createdAt: '2026-04-05T11:45:00.000Z',
  },
  {
    id: 'gal-6',
    title: 'Youth Mentorship Workshop',
    description: 'Mentors guiding students through career planning sessions.',
    imageUrl:
      'https://images.unsplash.com/photo-1529390079861-591de354faf5?w=800&q=80',
    category: 'Education',
    fileSize: '1.8 MB',
    format: 'JPG',
    createdAt: '2026-03-18T13:20:00.000Z',
  },
]

/** Gallery storage stats shown on Gallery Manager (API wiring later) */
export const mockGalleryStats = {
  totalAssets: 128,
  storageUsed: '2.4 GB',
  storageLimit: '10 GB',
} as const;

/** Seed donations */
export const mockDonations: Donation[] = [
  {
    id: "don-1",
    donorName: "Olawale Okonjo",
    email: "olawale.o@email.com",
    amount: 500_000,
    currency: "NGN",
    status: "completed",
    transactionId: "DGD-9021",
    message: "Keep up the amazing work!",
    createdAt: "2024-10-24T08:22:00.000Z",
  },
  {
    id: "don-2",
    donorName: "Amina Danjuma",
    email: "amina.d@email.com",
    amount: 2_500_000,
    currency: "NGN",
    status: "completed",
    transactionId: "DGD-8912",
    createdAt: "2024-10-22T16:10:00.000Z",
  },
  {
    id: "don-3",
    donorName: "Chidi Eze",
    email: "chidi.e@email.com",
    amount: 50_000,
    currency: "NGN",
    status: "pending",
    transactionId: "DGD-8765",
    createdAt: "2024-10-21T12:05:00.000Z",
  },
  {
    id: "don-4",
    donorName: "Elizabeth Balogun",
    email: "e.balogun@email.com",
    amount: 120_000,
    currency: "NGN",
    status: "completed",
    transactionId: "DGD-8654",
    createdAt: "2024-10-19T09:40:00.000Z",
  },
  {
    id: "don-5",
    donorName: "Samuel Yusuf",
    email: "s.yusuf@email.com",
    amount: 1_000_000,
    currency: "NGN",
    status: "failed",
    transactionId: "DGD-8543",
    createdAt: "2024-10-18T19:55:00.000Z",
  },
  {
    id: "don-6",
    donorName: "Fatima Hassan",
    email: "fatima.h@email.com",
    amount: 75_000,
    currency: "NGN",
    status: "completed",
    transactionId: "DGD-8432",
    createdAt: "2024-10-16T07:30:00.000Z",
  },
  {
    id: "don-7",
    donorName: "David Okeke",
    email: "d.okeke@email.com",
    amount: 300_000,
    currency: "NGN",
    status: "completed",
    transactionId: "DGD-8321",
    message: "Happy to support the youth programs.",
    createdAt: "2024-10-14T14:18:00.000Z",
  },
  {
    id: "don-8",
    donorName: "Ngozi Adeyemi",
    email: "n.adeyemi@email.com",
    amount: 200_000,
    currency: "NGN",
    status: "pending",
    transactionId: "DGD-8210",
    createdAt: "2024-10-12T11:00:00.000Z",
  },
  {
    id: "don-9",
    donorName: "Ibrahim Musa",
    email: "i.musa@email.com",
    amount: 450_000,
    currency: "NGN",
    status: "completed",
    transactionId: "DGD-8109",
    createdAt: "2024-10-10T15:20:00.000Z",
  },
  {
    id: "don-10",
    donorName: "Grace Nwosu",
    email: "g.nwosu@email.com",
    amount: 85_000,
    currency: "NGN",
    status: "completed",
    transactionId: "DGD-8098",
    createdAt: "2024-10-08T10:45:00.000Z",
  },
];

/** Donation overview stats shown on Donation Records (API wiring later) */
export const mockDonationStats = {
  totalFundsLabel: "₦42.8M",
  activeDonors: 1_204,
} as const;

/** Seed contact messages */
export const mockMessages: Message[] = [
  {
    id: "msg-1",
    name: "Emmanuel Akinteye",
    email: "emmanuelakinteye@gmail.com",
    phone: "0806 219 9991",
    subject: "Event interest: Annual Royal Ambassadors Camp",
    body: "Event interest registration request.\n\nEvent: Annual Royal Ambassadors Camp\nDate: 3rd–9th August 2025\nVenue: Baptist Academy, Obanikoro, Lagos\nPhone: 0806 219 9991\n\nPlease follow up when registration opens.",
    read: true,
    createdAt: "2026-07-15T12:48:00.000Z",
  },
  {
    id: "msg-2",
    name: "Grace Nwosu",
    email: "grace.n@email.com",
    phone: "0803 445 2210",
    subject: "Volunteer opportunities for summer outreach",
    body: "Hello, I would love to learn more about volunteering with your outreach programs this summer. Could you share upcoming dates and requirements?",
    read: true,
    createdAt: "2026-07-14T10:30:00.000Z",
  },
  {
    id: "msg-3",
    name: "Robert Blake",
    email: "rblake@corp.com",
    phone: "+1 415 555 0198",
    subject: "Corporate partnership inquiry",
    body: "Our company is exploring CSR partnerships with foundations focused on education. We would appreciate a brief call to discuss possibilities.",
    read: false,
    createdAt: "2026-07-13T15:45:00.000Z",
  },
  {
    id: "msg-4",
    name: "Elena Vargas",
    email: "elena.v@email.com",
    subject: "Donation receipt request",
    body: "I donated last week and need a formal receipt for tax purposes. My reference ID is DON-2026-0712. Thank you!",
    read: true,
    createdAt: "2026-07-12T09:12:00.000Z",
  },
  {
    id: "msg-5",
    name: "Kwame Boateng",
    email: "kboateng@email.com",
    phone: "0701 882 3344",
    subject: "Media interview request",
    body: "I am a journalist covering community foundations. Would your team be available for a short interview about your mandate and impact?",
    read: false,
    createdAt: "2026-07-11T17:20:00.000Z",
  },
  {
    id: "msg-6",
    name: "Priya Sharma",
    email: "priya.s@email.com",
    subject: "Event sponsorship",
    body: "We would like to sponsor your next fundraising gala. Please share sponsorship tiers and benefits when convenient.",
    read: true,
    createdAt: "2026-07-10T08:00:00.000Z",
  },
];

/** Editable site content seed — mirrors public-web editorial structure */
export const mockContent: SiteContentDocument = {
  home: {
    heroHeadline: "Restoring Hope and Dignity to the Heart of Nigeria.",
    missionText:
      "We are an elite humanitarian collective dedicated to empowering underserved communities through sustainable health, education, and spiritual guidance. Every soul deserves a chance at delight.",
    establishedYear: "2024",
    mandateHeadline: "Driven by Faith, Guided by Compassion",
    mandateQuote:
      "Our mission transcends mere charity; it is a divine commitment to uplift the vulnerable and showcase the true spirit of African resilience through tangible impact.",
    vision: "Building a Nigeria where delight is a common heritage.",
    mandate:
      "To preach the gospel, serve the vulnerable, and empower communities with compassion, dignity, and hope.",
    aboutText:
      "Divine Gospel Delight Foundation is a premium humanitarian foundation registered in Nigeria, committed to high-impact interventions across Africa.",
    visionHeadline: "Building a Nigeria where delight is a common heritage.",
    impactCallout: "Impact over Optics.",
    impactCalloutBody:
      "We believe in measurable, sustainable change that outlives our physical presence.",
    livesImpacted: "12,000+",
    outreaches: "45",
    volunteers: "150",
    successRate: "92%",
    donateCtaHeadline: "Your Generosity Fuels Transformation",
    donateCtaBody:
      "Join partners across Nigeria in restoring hope through education, health, and community outreach.",
    donateCtaPrimary: "Donate Now",
  },
  about: {
    label: "Our Heritage",
    headline: "Crafting a Legacy of",
    headlineAccent: "Hope & Excellence",
    headlineSuffix: "in Nigeria.",
    intro:
      "Divine Gospel Delight Foundation stands as a beacon of luxury philanthropy, dedicated to restoring dignity and creating sustainable impact through refined humanitarian efforts.",
    missionTitle: "Our Mission",
    missionBody:
      "To empower marginalized communities across Nigeria by providing access to elite-level healthcare, premium educational resources, and sustainable economic opportunities.",
    visionTitle: "The Vision",
    visionBody:
      "We envision a Nigeria where humanitarian aid is synonymous with excellence, where every individual has the platform to transition from surviving to thriving.",
    quote:
      "Our faith inspires every act of compassion and every life we transform.",
    journeyLabel: "Our Journey",
    journeyHeadline: "A Decade of Dedication",
    leadershipLabel: "The Board",
    leadershipHeadline: "Our Leadership",
    ctaHeadline: "Be Part of the Legacy",
    ctaBody:
      "Join us in our mission to redefine Nigerian humanitarian efforts through the lens of excellence and dignity.",
    ctaPrimary: "Support Our Work",
    ctaSecondary: "Get in Touch",
  },
  founder: {
    label: "The Founder",
    name: "Dr. Adebayo Ogunlesi",
    role: "Founder & CEO",
    intro:
      "A visionary philanthropist whose faith, discipline, and devotion to community excellence shaped the foundation’s mission to restore hope and dignity across Nigeria.",
    articleLabel: "Leadership Journey",
    articleHeadline: "A Calling Beyond Charity",
    articleBody:
      "From early community relief work in Lagos to building a structured national foundation, Dr. Ogunlesi’s leadership blends spiritual conviction with operational excellence. His vision continues to guide every outreach, scholarship, and health initiative we deliver.",
    quote:
      "Excellence in compassion is not optional — it is how we honor the people we serve.",
    quoteAttribution: "Dr. Adebayo Ogunlesi",
    ctaHeadline: "Walk With the Mission",
    ctaBody:
      "Partner with the foundation to extend dignity, education, and hope across Nigeria.",
    ctaPrimary: "Support the Work",
    ctaSecondary: "Contact Us",
  },
  donate: {
    heroLabel: "Empowerment through Giving",
    heroHeadline: "Your Generosity,",
    heroAccent: "Their Future.",
    heroBody:
      "At Divine Gospel Delight Foundation, every donation is a seed planted for sustainable change. Join our mission to provide dignity, education, and health to communities across Nigeria.",
    impactTitle: "Where your money goes",
    impactQuote:
      "The smallest act of kindness is worth more than the grandest intention.",
    transparencyLabel: "Transparency First",
    transparencyHeadline: "Trust is our foundation.",
    transparencyBody:
      "We pride ourselves on 100% financial transparency. 92% of all donations go directly to our field programs, ensuring your contribution makes the maximum possible impact.",
  },
  contact: {
    label: "Get in Touch",
    headline: "Connecting hearts to the mission of compassion.",
    body: "Whether you have a question about our programs, wish to partner with us, or simply want to share a word of encouragement, we are here to listen and respond with grace.",
    quote:
      "Every conversation is an opportunity to extend hope.",
    addressLines:
      "12 Prosperity Lane, Victoria Island Extension,\nLagos, Nigeria",
    emailLines: "info@dgdelightfound.org\npartnerships@dgdelightfound.org",
    phoneLines: "+234 (0) 800 DIVINE GOSPEL\n+234 1 234 5678",
    officeHours:
      "Monday – Friday: 9:00 AM – 5:00 PM\nSaturday: 10:00 AM – 2:00 PM",
    inquiryOptions:
      "General Inquiry\nDonation Support\nPartnership Proposal\nVolunteer Opportunities",
  },
  gallery: {
    heroLabel: "Visual Stories",
    heroHeadline: "Moments of Impact Across Nigeria",
    heroBody:
      "A curated visual record of outreach, education, and community transformation led by Divine Gospel Delight Foundation.",
    ctaHeadline: "Be Part of the Next Chapter",
    ctaBody:
      "Your support helps us capture more stories of dignity restored and hope renewed.",
    ctaPrimary: "Support Our Work",
  },
  lastUpdatedAt: "2026-07-18T10:00:00.000Z",
};

/**
 * Computes dashboard stats from current mock datasets.
 */
export function computeDashboardStats(
  gallery: GalleryItem[],
  donations: Donation[],
  messages: Message[],
  content: SiteContentDocument,
): DashboardStats {
  const completed = donations.filter((d) => d.status === "completed");
  const sectionCount = Object.keys(content).filter(
    (key) => key !== "lastUpdatedAt",
  ).length;
  return {
    donationsTotal: completed.reduce((sum, d) => sum + d.amount, 0),
    donationsCount: donations.length,
    messagesUnread: messages.filter((m) => !m.read).length,
    galleryCount: gallery.length,
    contentKeys: sectionCount,
  };
}

/** Analytics metrics shown on the Foundation Analytics dashboard */
export const mockAnalyticsMetrics = {
  donations: {
    label: "Total Funds Raised",
    value: "₦42.8M",
    trend: "↑ 12.5%",
    trendPositive: true,
    subtitle: "vs last month",
  },
  livesImpacted: {
    label: "Lives Impacted",
    value: "12,402",
    trend: "↑ 8.2%",
    trendPositive: true,
    subtitle: "new reach this quarter",
  },
  activePrograms: {
    label: "Active Programs",
    value: "24",
    trend: "4",
    trendPositive: false,
    subtitle: "pending review",
  },
  unreadMessages: {
    label: "Inbox Attention",
    value: "3",
    trend: "2 new",
    trendPositive: false,
    subtitle: "awaiting reply",
  },
} as const;

/** Monthly impact projection bars (API wiring later) */
export const mockImpactChart: ImpactChartPoint[] = [
  { label: "Jan", value: 40 },
  { label: "Feb", value: 60 },
  { label: "Mar", value: 50 },
  { label: "Apr", value: 85, isPeak: true },
  { label: "May", value: 45 },
  { label: "Jun", value: 70 },
  { label: "Jul", value: 62 },
  { label: "Aug", value: 78 },
];

/** Yearly impact projection bars (API wiring later) */
export const mockImpactChartYearly: ImpactChartPoint[] = [
  { label: "2021", value: 35 },
  { label: "2022", value: 48 },
  { label: "2023", value: 62 },
  { label: "2024", value: 74 },
  { label: "2025", value: 88, isPeak: true },
  { label: "2026", value: 71 },
];

/** Fund allocation channels (API wiring later) */
export const mockFundChannels: FundChannel[] = [
  {
    id: "ch-education",
    label: "Education & Scholarships",
    percent: 38,
    amountLabel: "₦16.3M",
    tone: "primary",
  },
  {
    id: "ch-health",
    label: "Health & Outreach",
    percent: 29,
    amountLabel: "₦12.4M",
    tone: "accent",
  },
  {
    id: "ch-community",
    label: "Community Relief",
    percent: 21,
    amountLabel: "₦9.0M",
    tone: "warm",
  },
  {
    id: "ch-ops",
    label: "Operations & Stewardship",
    percent: 12,
    amountLabel: "₦5.1M",
    tone: "slate",
  },
];

/** Items requiring operator attention (API wiring later) */
export const mockDashboardAlerts: DashboardAlert[] = [
  {
    id: "alert-1",
    severity: "critical",
    title: "Failed donation needs review",
    detail: "Samuel Yusuf · ₦1,000,000 · #DGD-8543",
    href: "/donations",
    actionLabel: "Open ledger",
  },
  {
    id: "alert-2",
    severity: "warning",
    title: "2 unread partnership inquiries",
    detail: "Corporate CSR and media interview awaiting response",
    href: "/messages",
    actionLabel: "Open inbox",
  },
  {
    id: "alert-3",
    severity: "info",
    title: "Gallery assets pending curation",
    detail: "4 new uploads ready for public gallery review",
    href: "/gallery",
    actionLabel: "Review gallery",
  },
];

/** Latest activity feed (API wiring later) */
export const mockActivityFeed: ActivityItem[] = [
  {
    id: "act-1",
    type: "donation",
    actorName: "Mrs. Adebayo",
    title: "made a donation to the",
    highlight: "Scholarship Fund",
    timeAgo: "2 mins ago",
    avatarUrl:
      "https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=96&h=96&fit=crop",
  },
  {
    id: "act-2",
    type: "story",
    title: "New Impact Story published:",
    highlight: '"Healing in Lagos State"',
    timeAgo: "4 hours ago",
  },
  {
    id: "act-3",
    type: "update",
    actorName: "Emeka Obi",
    title: "updated 12 records in the Medical Outreach program.",
    timeAgo: "6 hours ago",
    avatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop",
  },
  {
    id: "act-4",
    type: "system",
    title: "System verification completed for",
    highlight: "Annual Transparency Report",
    timeAgo: "Yesterday",
  },
  {
    id: "act-5",
    type: "donation",
    actorName: "Amina Danjuma",
    title: "completed a major gift of",
    highlight: "₦2,500,000",
    timeAgo: "Yesterday",
  },
];

/** Active outreach programs table (API wiring later) */
export const mockOutreachPrograms: OutreachProgram[] = [
  {
    id: "prog-1",
    name: "Lagos Medical Outreach",
    region: "South West",
    status: "active",
    budgetUsedPercent: 75,
  },
  {
    id: "prog-2",
    name: "Abuja Education Support",
    region: "North Central",
    status: "in_review",
    budgetUsedPercent: 32,
  },
  {
    id: "prog-3",
    name: "Enugu Water Project",
    region: "South East",
    status: "active",
    budgetUsedPercent: 88,
  },
  {
    id: "prog-4",
    name: "Kano Youth Mentorship",
    region: "North Central",
    status: "paused",
    budgetUsedPercent: 18,
  },
];
