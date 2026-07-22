import type {
  Donation,
  GalleryItem,
  LeadershipMember,
  Message,
  SiteContentDocument,
  SiteSettings,
} from "@/lib/types";

/** Seed gallery images */
export const mockGallery: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Elderly Outreach Dec 2023',
    description: 'Volunteers distributing supplies to elderly community members.',
    imageUrl:
      'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&q=80',
    category: 'Impact Event',
    status: 'active',
    sortOrder: 1,
    mediaType: 'image',
    location: 'Lagos',
    fileSize: '1.2 MB',
    format: 'JPG',
    createdAt: '2026-06-12T10:00:00.000Z',
    updatedAt: '2026-06-12T10:00:00.000Z',
  },
  {
    id: 'gal-2',
    title: 'Clean Water Project Phase 1',
    description: 'Community borehole infrastructure in a rural village.',
    imageUrl:
      'https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=800&q=80',
    category: 'Infrastructure',
    status: 'active',
    sortOrder: 2,
    mediaType: 'image',
    fileSize: '2.8 MB',
    format: 'PNG',
    createdAt: '2026-05-28T14:30:00.000Z',
    updatedAt: '2026-05-28T14:30:00.000Z',
  },
  {
    id: 'gal-3',
    title: 'School Sponsorship Program',
    description: 'Students engaged in a foundation-supported classroom.',
    imageUrl:
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80',
    category: 'Education',
    status: 'active',
    sortOrder: 3,
    mediaType: 'image',
    fileSize: '1.5 MB',
    format: 'JPG',
    createdAt: '2026-05-10T09:15:00.000Z',
    updatedAt: '2026-05-10T09:15:00.000Z',
  },
  {
    id: 'gal-4',
    title: 'Food Distribution Logistics',
    description: 'Rice packages prepared for weekend outreach distribution.',
    imageUrl:
      'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80',
    category: 'Outreach',
    status: 'draft',
    sortOrder: 4,
    mediaType: 'image',
    fileSize: '940 KB',
    format: 'JPG',
    createdAt: '2026-04-22T18:00:00.000Z',
    updatedAt: '2026-04-22T18:00:00.000Z',
  },
  {
    id: 'gal-5',
    title: 'Community Hub Architecture',
    description: 'Newly built community center at golden hour.',
    imageUrl:
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
    category: 'Infrastructure',
    status: 'active',
    sortOrder: 5,
    mediaType: 'image',
    fileSize: '3.2 MB',
    format: 'JPG',
    createdAt: '2026-04-05T11:45:00.000Z',
    updatedAt: '2026-04-05T11:45:00.000Z',
  },
  {
    id: 'gal-6',
    title: 'Youth Mentorship Workshop',
    description: 'Mentors guiding students through career planning sessions.',
    imageUrl:
      'https://images.unsplash.com/photo-1529390079861-591de354faf5?w=800&q=80',
    category: 'Education',
    status: 'archived',
    sortOrder: 6,
    mediaType: 'image',
    fileSize: '1.8 MB',
    format: 'JPG',
    createdAt: '2026-03-18T13:20:00.000Z',
    updatedAt: '2026-03-18T13:20:00.000Z',
  },
]

/** Seed donations */
export const mockDonations: Donation[] = [
  {
    id: "don-1",
    donorName: "Olawale Okonjo",
    email: "olawale.o@email.com",
    amount: 500_000,
    currency: "NGN",
    isAnonymous: false,
    status: "success",
    transactionId: "DGD-9021",
    createdAt: "2024-10-24T08:22:00.000Z",
  },
  {
    id: "don-2",
    donorName: "Amina Danjuma",
    email: "amina.d@email.com",
    amount: 2_500_000,
    currency: "NGN",
    isAnonymous: false,
    status: "success",
    transactionId: "DGD-8912",
    createdAt: "2024-10-22T16:10:00.000Z",
  },
  {
    id: "don-3",
    donorName: "Chidi Eze",
    email: "chidi.e@email.com",
    amount: 50_000,
    currency: "NGN",
    isAnonymous: false,
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
    isAnonymous: false,
    status: "success",
    transactionId: "DGD-8654",
    createdAt: "2024-10-19T09:40:00.000Z",
  },
  {
    id: "don-5",
    donorName: "Samuel Yusuf",
    email: "s.yusuf@email.com",
    amount: 1_000_000,
    currency: "NGN",
    isAnonymous: false,
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
    isAnonymous: false,
    status: "success",
    transactionId: "DGD-8432",
    createdAt: "2024-10-16T07:30:00.000Z",
  },
  {
    id: "don-7",
    donorName: "David Okeke",
    email: "d.okeke@email.com",
    amount: 300_000,
    currency: "NGN",
    isAnonymous: false,
    status: "success",
    transactionId: "DGD-8321",
    createdAt: "2024-10-14T14:18:00.000Z",
  },
  {
    id: "don-8",
    donorName: "Ngozi Adeyemi",
    email: "n.adeyemi@email.com",
    amount: 200_000,
    currency: "NGN",
    isAnonymous: false,
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
    isAnonymous: false,
    status: "success",
    transactionId: "DGD-8109",
    createdAt: "2024-10-10T15:20:00.000Z",
  },
  {
    id: "don-10",
    donorName: "Grace Nwosu",
    email: "g.nwosu@email.com",
    amount: 85_000,
    currency: "NGN",
    isAnonymous: false,
    status: "success",
    transactionId: "DGD-8098",
    createdAt: "2024-10-08T10:45:00.000Z",
  },
];

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

/** Leadership / board members shown on the public About page */
export const mockLeadership: LeadershipMember[] = [
  {
    id: 'lead-1',
    name: 'Dr. Adebayo Ogunlesi',
    role: 'Founder & CEO',
    bio: 'A visionary philanthropist with over 20 years of experience in strategic development and international relations.',
    photoUrl:
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&h=1000&fit=crop',
    sortOrder: 1,
    status: 'published',
    isFounder: true,
    createdAt: '2026-01-10T09:00:00.000Z',
    updatedAt: '2026-07-18T10:00:00.000Z',
  },
  {
    id: 'lead-2',
    name: 'Chioma Nnaji',
    role: 'Operations Director',
    bio: 'Leading our ground-level execution with a focus on operational excellence and sustainable community impact.',
    photoUrl:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=1000&fit=crop',
    sortOrder: 2,
    status: 'published',
    isFounder: false,
    createdAt: '2026-01-10T09:00:00.000Z',
    updatedAt: '2026-07-18T10:00:00.000Z',
  },
  {
    id: 'lead-3',
    name: 'Olusola Alake',
    role: 'Board Chairman',
    bio: 'Ensuring the highest standards of governance and strategic foresight across all foundation activities.',
    photoUrl:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&h=1000&fit=crop',
    sortOrder: 3,
    status: 'published',
    isFounder: false,
    createdAt: '2026-01-10T09:00:00.000Z',
    updatedAt: '2026-07-18T10:00:00.000Z',
  },
  {
    id: 'lead-4',
    name: 'Zainab Bello',
    role: 'Head of Impact',
    bio: 'Dedicated to measuring and scaling our humanitarian efforts to reach the most vulnerable populations.',
    photoUrl:
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&h=1000&fit=crop',
    sortOrder: 4,
    status: 'draft',
    isFounder: false,
    createdAt: '2026-03-02T11:00:00.000Z',
    updatedAt: '2026-07-10T14:30:00.000Z',
  },
];

/** Global site settings seed — org identity, contact, social */
export const mockSiteSettings: SiteSettings = {
  organization: {
    name: 'Divine Gospel Delight Foundation',
    tagline: 'Humanitarian Impact in Nigeria',
    logoUrl: '',
  },
  contact: {
    phone: '+234 (0) 800 DELIGHT',
    email: 'info@dgdelightfound.org',
    address: '12 Corporate Way, Victoria Island, Lagos, Nigeria',
    officeHours: 'Monday – Friday: 9:00 AM – 5:00 PM',
  },
  social: {
    facebook: 'https://facebook.com/dgdelightfound',
    instagram: 'https://instagram.com/dgdelightfound',
    youtube: 'https://youtube.com/@dgdelightfound',
    twitter: 'https://twitter.com/dgdelightfound',
  },
  lastUpdatedAt: '2026-07-18T10:00:00.000Z',
};

/** Editable site content seed — Content Manager sections */
export const mockContent: SiteContentDocument = {
  home: {
    hero: {
      headline: 'Restoring Hope and Dignity to the Heart of Nigeria.',
      paragraph:
        'We are a humanitarian foundation dedicated to empowering underserved communities through sustainable health, education, and spiritual guidance. Every soul deserves a chance at delight.',
    },
    mission: {
      title: 'Our Mission',
      body: 'To preach the gospel, serve the vulnerable, and empower communities with compassion, dignity, and hope across Nigeria.',
    },
    visionMandateImpact: {
      vision: 'Building a Nigeria where delight is a common heritage.',
      mandate:
        'To preach the gospel, serve the vulnerable, and empower communities with compassion, dignity, and hope.',
      impactSummary:
        'We believe in measurable, sustainable change that outlives our physical presence — impact over optics.',
    },
    impactStats: {
      livesImpacted: 12000,
      outreaches: 45,
      volunteers: 150,
      successRate: 92,
    },
    donateCta: {
      headline: 'Your Generosity Fuels Transformation',
      subtext:
        'Join partners across Nigeria in restoring hope through education, health, and community outreach.',
    },
  },
  about: {
    hero: {
      headline: 'Crafting a Legacy of Hope & Excellence in Nigeria.',
      subtext:
        'Divine Gospel Delight Foundation stands as a beacon of refined philanthropy, dedicated to restoring dignity and creating sustainable impact.',
    },
    story: {
      title: 'Our Foundation Story',
      body: 'Divine Gospel Delight Foundation was founded on the conviction that every act of compassion should be delivered with excellence.\n\nFrom early community relief work to structured national programmes, we have grown into a foundation committed to health, education, and spiritual uplift across Nigeria.',
    },
    mandateQuote: {
      quote:
        'Our faith inspires every act of compassion and every life we transform.',
    },
    leadership: {
      heading: 'Our Leadership',
      subtext:
        'A dedicated board guiding the foundation with faith, discipline, and operational excellence.',
    },
  },
  founder: {
    profile: {
      label: 'The Founder',
      name: 'Dr. Adebayo Ogunlesi',
      role: 'Founder & CEO',
      photoUrl:
        'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=1200&h=1500&fit=crop',
      intro:
        'A visionary philanthropist whose faith, discipline, and devotion to community excellence shaped the foundation’s mission to restore hope and dignity across Nigeria.',
    },
    article: {
      label: 'His Story',
      headline: 'A life devoted to service and excellence',
      body: 'Dr. Adebayo Ogunlesi founded Divine Gospel Delight Foundation with a clear conviction: humanitarian work should be marked by excellence, dignity, and lasting impact—not spectacle.\n\nRaised with a deep sense of faith and responsibility, he saw early how poverty and limited opportunity could steal delight from entire communities. That awareness became a calling.\n\nUnder his leadership, DGDF has pursued a standard of delivery rarely associated with charity—precise planning, accountable stewardship, and programs designed to help people move from surviving to thriving.',
    },
    quote: {
      quote:
        'Our mission transcends mere charity; it is a divine commitment to uplift the vulnerable and showcase the true spirit of African resilience through tangible impact.',
      attribution: 'Dr. Adebayo Ogunlesi',
    },
    cta: {
      headline: 'Continue the Work He Began',
      body: 'Support the programs and communities shaped by this vision—your partnership helps restore hope with excellence and dignity.',
      primaryLabel: 'Support Our Work',
      secondaryLabel: 'Back to About',
    },
  },
  gallery: {
    hero: {
      label: 'Our Visual Narrative',
      headline: 'Capturing the Heart of Every Outreach',
      body: 'A documentary-style journey through the communities we serve. These are the faces of hope, the hands of change, and the spirit of a community united in faith and service.',
    },
    testimonial: {
      quote:
        "The Divine Gospel Delight Foundation didn't just give us resources; they gave us hope. Our community has seen a transformation that only grace could bring.",
      name: 'Sister Ngozi Adeyemi',
      role: 'Community Leader, Lagos Outreach',
      photoUrl:
        'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&h=400&fit=crop',
    },
    cta: {
      headline: 'Be Part of the Next Chapter',
      body: 'Your support allows us to continue documenting and creating these stories of transformation. Every donation directly funds our next outreach.',
      primaryLabel: 'Donate Now',
      secondaryLabel: 'Join as Volunteer',
    },
  },
  donate: {
    hero: {
      headline: 'Your Generosity, Their Future.',
      subtext:
        'Every donation is a seed planted for sustainable change. Join our mission to provide dignity, education, and health to communities across Nigeria.',
    },
    impactStats: {
      peopleReached: 12402,
      outreaches: 45,
    },
    testimonial: {
      quote:
        'Supporting this foundation has been one of the most meaningful decisions I have made. You can see the dignity restored in every community they touch.',
      donorName: 'Chioma Adebayo',
      donorRole: 'Monthly Partner',
    },
  },
  contact: {
    hero: {
      headline: 'Connecting hearts to the mission of compassion.',
      subtext:
        'Whether you have a question about our programmes, wish to partner with us, or simply want to share a word of encouragement — we are here to listen.',
    },
    info: {
      phone: '+234 1 234 5678',
      email: 'info@dgdelightfound.org',
      address:
        '12 Prosperity Lane, Victoria Island Extension,\nLagos, Nigeria',
      officeHours: 'Monday – Friday: 9:00 AM – 5:00 PM',
    },
    social: {
      facebook: 'https://facebook.com/dgdelightfound',
      instagram: 'https://instagram.com/dgdelightfound',
      youtube: 'https://youtube.com/@dgdelightfound',
    },
  },
  lastUpdatedAt: '2026-07-18T10:00:00.000Z',
};
