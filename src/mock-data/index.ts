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
    id: "gal-1",
    title: "Elderly Outreach Dec 2023",
    description:
      "Volunteers distributing supplies to elderly community members.",
    imageUrl:
      "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&q=80",
    category: "Impact Event",
    status: "active",
    sortOrder: 1,
    mediaType: "image",
    location: "Lagos",
    fileSize: "1.2 MB",
    format: "JPG",
    createdAt: "2026-06-12T10:00:00.000Z",
    updatedAt: "2026-06-12T10:00:00.000Z",
  },
  {
    id: "gal-2",
    title: "Clean Water Project Phase 1",
    description: "Community borehole infrastructure in a rural village.",
    imageUrl:
      "https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=800&q=80",
    category: "Infrastructure",
    status: "active",
    sortOrder: 2,
    mediaType: "image",
    fileSize: "2.8 MB",
    format: "PNG",
    createdAt: "2026-05-28T14:30:00.000Z",
    updatedAt: "2026-05-28T14:30:00.000Z",
  },
  {
    id: "gal-3",
    title: "School Sponsorship Program",
    description: "Students engaged in a foundation-supported classroom.",
    imageUrl:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80",
    category: "Education",
    status: "active",
    sortOrder: 3,
    mediaType: "image",
    fileSize: "1.5 MB",
    format: "JPG",
    createdAt: "2026-05-10T09:15:00.000Z",
    updatedAt: "2026-05-10T09:15:00.000Z",
  },
  {
    id: "gal-4",
    title: "Food Distribution Logistics",
    description: "Rice packages prepared for weekend outreach distribution.",
    imageUrl:
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80",
    category: "Outreach",
    status: "draft",
    sortOrder: 4,
    mediaType: "image",
    fileSize: "940 KB",
    format: "JPG",
    createdAt: "2026-04-22T18:00:00.000Z",
    updatedAt: "2026-04-22T18:00:00.000Z",
  },
  {
    id: "gal-5",
    title: "Community Hub Architecture",
    description: "Newly built community center at golden hour.",
    imageUrl:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
    category: "Infrastructure",
    status: "active",
    sortOrder: 5,
    mediaType: "image",
    fileSize: "3.2 MB",
    format: "JPG",
    createdAt: "2026-04-05T11:45:00.000Z",
    updatedAt: "2026-04-05T11:45:00.000Z",
  },
  {
    id: "gal-6",
    title: "Youth Mentorship Workshop",
    description: "Mentors guiding students through career planning sessions.",
    imageUrl:
      "https://images.unsplash.com/photo-1529390079861-591de354faf5?w=800&q=80",
    category: "Education",
    status: "archived",
    sortOrder: 6,
    mediaType: "image",
    fileSize: "1.8 MB",
    format: "JPG",
    createdAt: "2026-03-18T13:20:00.000Z",
    updatedAt: "2026-03-18T13:20:00.000Z",
  },
];

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
    id: "lead-1",
    name: "Rev'd Mrs Folake Ojo",
    role: "President / Chairperson",
    bio: "Rev'd Mrs Folake Ojo serves as President and Chairperson of Divine Gospel Delight Foundation. With a heart for gospel-centered service, she guides the foundation’s work of restoring hope and dignity to the less privileged across Nigeria.",
    photoUrl:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=1000&fit=crop",
    sortOrder: 1,
    status: "published",
    isFounder: true,
    createdAt: "2026-01-10T09:00:00.000Z",
    updatedAt: "2026-07-18T10:00:00.000Z",
  },
  {
    id: "lead-2",
    name: "Bolanle Ojo",
    role: "Secretary",
    bio: "Bolanle Ojo serves as Secretary of Divine Gospel Delight Foundation. He helps coordinate the foundation’s outreach and administrative work so widows, orphans, families, and communities can be served with care and excellence.",
    photoUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&h=1000&fit=crop",
    sortOrder: 2,
    status: "published",
    isFounder: false,
    createdAt: "2026-01-10T09:00:00.000Z",
    updatedAt: "2026-07-18T10:00:00.000Z",
  },
];

/** Global site settings seed — org identity, contact, social */
export const mockSiteSettings: SiteSettings = {
  organization: {
    name: "Divine Gospel Delight Foundation",
    tagline: "Restoring Hope and Dignity to Every Life",
    logoUrl: "",
  },
  contact: {
    phone: "08037310730\n08033705759",
    email: "divinegospeldelight.ministry@gmail.com",
    address: "Lagos, Nigeria",
    officeHours: "Monday – Friday: 9:00 AM – 5:00 PM",
  },
  social: {
    facebook: "https://facebook.com/dgdelightfound",
    instagram: "https://instagram.com/dgdelightfound",
    youtube: "https://youtube.com/@dgdelightfound",
    twitter: "https://twitter.com/dgdelightfound",
  },
  lastUpdatedAt: "2026-07-18T10:00:00.000Z",
};

/** Editable site content seed — Content Manager sections */
export const mockContent: SiteContentDocument = {
  home: {
    hero: {
      headline: "Restoring Hope and Dignity to Every Life",
      paragraph:
        "We exist to meet the needs of the less privileged through humanitarian and empowerment support — a faith-filled calling to restore hope, dignity, and purpose across Nigerian communities.",
    },
    mission: {
      title: "Our Mission",
      body: "To fulfill the social responsibility of our divine mandate through meeting the needs of the less privileged people of Nigerian society via providing them with humanitarian and empowerment support thereby restoring hope and dignity to them in our society.",
    },
    visionMandateImpact: {
      vision:
        "To become a humanitarian organization renowned for providing a platform where individuals irrespective of their backgrounds can transition from just existing to fulfilling life purpose.",
      mandate:
        "Propagating the Gospel through service for humanity — restoring hope and dignity to the less privileged.",
      impactSummary:
        "Serving widows, orphans, teenagers, retirees, and families — and growing into health, education, and spiritual enrichment across Nigeria and beyond.",
    },
    impactStats: {
      livesImpacted: 12000,
      outreaches: 45,
      volunteers: 150,
      successRate: 92,
    },
    donateCta: {
      headline: "Sow Into Hope and Dignity",
      subtext:
        "Your gift helps us fulfill our divine mandate — meeting needs, empowering families, and restoring hope across Nigerian communities.",
    },
  },
  about: {
    hero: {
      headline: "Propagating the Gospel Through Service for Humanity",
      subtext:
        "Divine Gospel Delight Foundation was founded as an offshoot of our divine mandate of propagating the Gospel through service for humanity.",
    },
    story: {
      title: "Our Story",
      body: "Divine Gospel Delight Foundation was founded as an offshoot of our divine mandate of propagating the Gospel through service for humanity. We started from meeting small needs of people in the neighborhood with focus on widows, orphans, teenage children, retirees etc. Our passion is growing into family enrichment programs for effective parenting and achieving sustainability in family lives. We are also progressing to becoming a foundation committed to people's health, education and spiritual enrichment across Nigeria and to other parts of the world.",
    },
    mandateQuote: {
      quote:
        "Restoring hope and dignity — helping people transition from just existing to fulfilling life purpose.",
    },
    leadership: {
      heading: "Our Leadership",
      subtext: "Guided by faith and compassion to serve the less privileged.",
    },
  },
  founder: {
    profile: {
      label: "Our Leaders",
      name: "Rev'd Mrs Folake Ojo",
      role: "President / Chairperson",
      photoUrl:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200&h=1500&fit=crop",
      intro:
        "Meet the servants guiding Divine Gospel Delight Foundation — leading with faith, compassion, and a heart for the less privileged.",
    },
    article: {
      label: "Our Story",
      headline: "Propagating the Gospel through service for humanity",
      body: "Divine Gospel Delight Foundation was founded as an offshoot of our divine mandate of propagating the Gospel through service for humanity.\n\nWe started from meeting small needs of people in the neighborhood with focus on widows, orphans, teenage children, retirees etc. Our passion is growing into family enrichment programs for effective parenting and achieving sustainability in family lives.\n\nWe are also progressing to becoming a foundation committed to people's health, education and spiritual enrichment across Nigeria and to other parts of the world.",
    },
    quote: {
      quote:
        "To become a humanitarian organization renowned for providing a platform where individuals irrespective of their backgrounds can transition from just existing to fulfilling life purpose.",
      attribution: "Divine Gospel Delight Foundation",
    },
    cta: {
      headline: "Walk With Us in This Mandate",
      body: "Your partnership helps us restore hope, empower families, and point people toward purpose across Nigeria.",
      primaryLabel: "Support Our Work",
      secondaryLabel: "Back to About",
    },
  },
  gallery: {
    hero: {
      label: "Our Gallery",
      headline: "Capturing Every Act of Service",
      body: "Moments from our outreach among widows, orphans, families, and neighbors — where compassion meets dignity and the Gospel is lived out in service.",
    },
    testimonial: {
      quote:
        "Divine Gospel Delight Foundation didn’t just offer help — they offered hope. Our neighborhood felt seen, valued, and strengthened by their service.",
      name: "Community Neighbor",
      role: "Outreach Beneficiary",
      photoUrl:
        "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&h=400&fit=crop",
    },
    cta: {
      headline: "Be Part of the Next Chapter",
      body: "Your support helps us continue serving communities and capturing stories of hope across Nigeria.",
      primaryLabel: "Donate Now",
      secondaryLabel: "Contact Us",
    },
  },
  donate: {
    hero: {
      headline: "Restore Hope. Uplift Dignity.",
      subtext:
        "Your gift helps us meet the needs of widows, orphans, retirees, and families — providing humanitarian and empowerment support that restores hope across Nigeria.",
    },
    impactStats: {
      peopleReached: 12000,
      outreaches: 45,
    },
    testimonial: {
      quote:
        "Giving through this foundation feels like planting hope. You can see compassion and dignity in the way they serve.",
      donorName: "A Faithful Partner",
      donorRole: "Monthly Supporter",
    },
  },
  contact: {
    hero: {
      headline: "We Would Love to Hear from You",
      subtext:
        "Whether you want to partner with us, volunteer, ask about our programmes, or share a word of encouragement — our team is ready to listen with grace.",
    },
    info: {
      phone: "08037310730\n08033705759",
      email: "divinegospeldelight.ministry@gmail.com",
      address: "Lagos, Nigeria",
      officeHours: "Monday – Friday: 9:00 AM – 5:00 PM",
    },
    social: {
      facebook: "https://facebook.com/dgdelightfound",
      instagram: "https://instagram.com/dgdelightfound",
      youtube: "https://youtube.com/@dgdelightfound",
    },
  },
  lastUpdatedAt: "2026-07-18T10:00:00.000Z",
};
