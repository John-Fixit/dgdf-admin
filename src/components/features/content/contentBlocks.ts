import type {
  AboutContentSection,
  ContactContentSection,
  ContentPageKey,
  ContentSectionKey,
  DonateContentSection,
  FounderContentSection,
  GalleryContentSection,
  HomeContentSection,
  SiteContentDocument,
} from "@/lib/types";

export type FieldType = "text" | "textarea" | "number" | "image";

export type ContentBlockIcon = "text" | "stats" | "social" | "contact";

export interface ContentFieldDef {
  key: string;
  label: string;
  type: FieldType;
  helper: string;
  placeholder?: string;
  /** Soft character limit shown under text inputs */
  maxLength?: number;
  /** Appended after number inputs (e.g. %) */
  suffix?: string;
  rows?: number;
}

export interface ContentBlockDef {
  id: ContentSectionKey;
  page: ContentPageKey;
  label: string;
  title: string;
  description: string;
  /** Icon shown in the identity panel */
  icon: ContentBlockIcon;
  fields: ContentFieldDef[];
}

export const CONTENT_TABS: {
  key: ContentPageKey;
  label: string;
}[] = [
  { key: "home", label: "Home" },
  { key: "about", label: "About" },
  { key: "founder", label: "Leaders" },
  { key: "donate", label: "Donate" },
  { key: "contact", label: "Contact" },
];

function formatNumber(value: string | number | undefined): string {
  const n = Number(value);
  if (!Number.isFinite(n)) return value == null ? "—" : String(value);
  return n.toLocaleString("en-US");
}

/**
 * Builds inline stat chip labels for number-only content sections.
 */
export function getStatChips(
  block: ContentBlockDef,
  values: Record<string, string | number>,
): string[] | null {
  const numberFields = block.fields.filter((field) => field.type === "number");
  if (
    numberFields.length === 0 ||
    numberFields.length !== block.fields.length
  ) {
    return null;
  }

  const units: Record<string, string> = {
    livesImpacted: "lives",
    outreaches: "outreaches",
    volunteers: "volunteers",
    peopleReached: "people",
  };

  return numberFields.map((field) => {
    const formatted = formatNumber(values[field.key]);
    if (field.suffix) return `${formatted}${field.suffix}`;
    const unit = units[field.key] ?? field.label.toLowerCase();
    return `${formatted} ${unit}`;
  });
}

export const CONTENT_BLOCKS: ContentBlockDef[] = [
  // ── Home ──────────────────────────────────────────────
  {
    id: "hero",
    page: "home",
    label: "Hero",
    title: "Hero Headline & Subtext",
    description: "The first thing visitors read when they land on the homepage",
    icon: "text",
    fields: [
      {
        key: "headline",
        label: "Hero Headline",
        type: "text",
        helper: "Primary headline shown in the homepage hero",
        maxLength: 100,
        placeholder: "Restoring Hope and Dignity…",
      },
      {
        key: "paragraph",
        label: "Supporting Paragraph",
        type: "textarea",
        helper: "Short supporting copy beneath the hero headline",
        maxLength: 360,
        rows: 4,
      },
    ],
  },
  {
    id: "mission",
    page: "home",
    label: "Mission",
    title: "Mission Statement",
    description: "Full mission statement featured on the homepage",
    icon: "text",
    fields: [
      {
        key: "title",
        label: "Section Title",
        type: "text",
        helper: "Headline above the mission statement",
        maxLength: 80,
      },
      {
        key: "body",
        label: "Mission Text",
        type: "textarea",
        helper: "Full foundation mission statement",
        maxLength: 600,
        rows: 6,
      },
    ],
  },
  {
    id: "visionMandateImpact",
    page: "home",
    label: "Vision",
    title: "Vision, Mandate & Impact",
    description: "Three narrative pillars that frame purpose and outcomes",
    icon: "text",
    fields: [
      {
        key: "vision",
        label: "Vision Text",
        type: "textarea",
        helper: "Long-term vision statement on the homepage",
        maxLength: 500,
        rows: 5,
      },
      {
        key: "mandate",
        label: "Mandate Text",
        type: "textarea",
        helper: "Foundational mandate shown alongside vision",
        maxLength: 400,
        rows: 4,
      },
      {
        key: "impactSummary",
        label: "Impact Summary",
        type: "textarea",
        helper: "Short summary of impact philosophy",
        maxLength: 400,
        rows: 4,
      },
    ],
  },
  {
    id: "impactStats",
    page: "home",
    label: "Impact",
    title: "Impact Statistics",
    description: "Key metrics displayed in the homepage impact strip",
    icon: "stats",
    fields: [
      {
        key: "livesImpacted",
        label: "Lives Impacted",
        type: "number",
        helper: "Total lives reached — shown as a homepage statistic",
      },
      {
        key: "outreaches",
        label: "Outreaches",
        type: "number",
        helper: "Number of outreach programmes completed",
      },
      {
        key: "volunteers",
        label: "Volunteers",
        type: "number",
        helper: "Active volunteer count displayed publicly",
      },
      {
        key: "successRate",
        label: "Success Rate",
        type: "number",
        helper: "Programme success rate shown with a percent sign",
        suffix: "%",
      },
    ],
  },
  {
    id: "donateCta",
    page: "home",
    label: "CTA",
    title: "Donate CTA Banner",
    description: "Homepage call-to-action that drives visitors to donate",
    icon: "text",
    fields: [
      {
        key: "headline",
        label: "CTA Headline",
        type: "text",
        helper: "Headline on the homepage donate banner",
        maxLength: 90,
      },
      {
        key: "subtext",
        label: "CTA Subtext",
        type: "textarea",
        helper: "Supporting copy beneath the donate CTA headline",
        maxLength: 220,
        rows: 4,
      },
    ],
  },

  // ── About ─────────────────────────────────────────────
  {
    id: "hero",
    page: "about",
    label: "Hero",
    title: "Page Hero",
    description: "Hero headline and introduction for the About page",
    icon: "text",
    fields: [
      {
        key: "headline",
        label: "Hero Headline",
        type: "text",
        helper: "Main headline at the top of the About page",
        maxLength: 100,
      },
      {
        key: "subtext",
        label: "Subtext",
        type: "textarea",
        helper: "Supporting copy under the About page hero",
        maxLength: 280,
        rows: 4,
      },
    ],
  },
  {
    id: "story",
    page: "about",
    label: "Story",
    title: "Our Story",
    description: "Full foundation story shown on the About page",
    icon: "text",
    fields: [
      {
        key: "title",
        label: "Story Title",
        type: "text",
        helper: "Headline for the Our Story section",
        maxLength: 80,
      },
      {
        key: "body",
        label: "Story Body",
        type: "textarea",
        helper: "Full Our Story narrative",
        maxLength: 1200,
        rows: 8,
      },
    ],
  },
  {
    id: "mandateQuote",
    page: "about",
    label: "Quote",
    title: "Mandate Quote",
    description: "Featured quote that captures the foundation’s mandate",
    icon: "text",
    fields: [
      {
        key: "quote",
        label: "Quote Text",
        type: "textarea",
        helper: "Pull-quote displayed in the About page mandate section",
        maxLength: 320,
        rows: 4,
      },
    ],
  },
  {
    id: "leadership",
    page: "about",
    label: "Leadership",
    title: "Leadership Section Intro",
    description:
      "Heading copy above leadership cards (profiles are edited in Leadership)",
    icon: "text",
    fields: [
      {
        key: "heading",
        label: "Heading",
        type: "text",
        helper: "Section headline for leadership",
        maxLength: 80,
      },
      {
        key: "subtext",
        label: "Subtext",
        type: "textarea",
        helper: "Short supporting line under the leadership heading",
        maxLength: 200,
        rows: 3,
      },
    ],
  },

  // ── Meet Our Leaders (founder page) ───────────────────
  {
    id: "profile",
    page: "founder",
    label: "Intro",
    title: "Page Introduction",
    description: "Label and intro above President & Secretary profiles",
    icon: "text",
    fields: [
      {
        key: "label",
        label: "Section Label",
        type: "text",
        helper: "Small label above the page headline",
        maxLength: 40,
      },
      {
        key: "name",
        label: "Primary Leader Name",
        type: "text",
        helper: "Used in SEO / fallback metadata",
        maxLength: 80,
      },
      {
        key: "role",
        label: "Primary Leader Role",
        type: "text",
        helper: "Used in SEO / fallback metadata",
        maxLength: 80,
      },
      {
        key: "photoUrl",
        label: "Fallback Photo URL",
        type: "image",
        helper: "Optional fallback image (live photos come from Leadership)",
      },
      {
        key: "intro",
        label: "Intro Paragraph",
        type: "textarea",
        helper: "Warm introduction under Meet Our Leaders",
        maxLength: 360,
        rows: 4,
      },
    ],
  },
  {
    id: "article",
    page: "founder",
    label: "Story",
    title: "Story Article",
    description: "Story section beneath the leadership profiles",
    icon: "text",
    fields: [
      {
        key: "label",
        label: "Article Label",
        type: "text",
        helper: "Small label above the article headline",
        maxLength: 40,
      },
      {
        key: "headline",
        label: "Article Headline",
        type: "text",
        helper: "Headline for the story article",
        maxLength: 120,
      },
      {
        key: "body",
        label: "Article Body",
        type: "textarea",
        helper: "Paragraphs separated by a blank line",
        maxLength: 1600,
        rows: 10,
      },
    ],
  },
  {
    id: "quote",
    page: "founder",
    label: "Quote",
    title: "Featured Quote",
    description: "Pull-quote on the Meet Our Leaders page",
    icon: "text",
    fields: [
      {
        key: "quote",
        label: "Quote Text",
        type: "textarea",
        helper: "Quote body",
        maxLength: 500,
        rows: 5,
      },
      {
        key: "attribution",
        label: "Attribution",
        type: "text",
        helper: "Who the quote is attributed to",
        maxLength: 80,
      },
    ],
  },
  {
    id: "cta",
    page: "founder",
    label: "CTA",
    title: "Call to Action",
    description: "Bottom CTA on the Meet Our Leaders page",
    icon: "text",
    fields: [
      {
        key: "headline",
        label: "CTA Headline",
        type: "text",
        helper: "Headline for the bottom call to action",
        maxLength: 90,
      },
      {
        key: "body",
        label: "CTA Body",
        type: "textarea",
        helper: "Supporting copy under the CTA headline",
        maxLength: 280,
        rows: 4,
      },
      {
        key: "primaryLabel",
        label: "Primary Button",
        type: "text",
        helper: "Primary button label",
        maxLength: 40,
      },
      {
        key: "secondaryLabel",
        label: "Secondary Button",
        type: "text",
        helper: "Secondary button label",
        maxLength: 40,
      },
    ],
  },

  // ── Donate ────────────────────────────────────────────
  {
    id: "hero",
    page: "donate",
    label: "Hero",
    title: "Donate Hero",
    description: "Primary headline and intro on the donate page",
    icon: "text",
    fields: [
      {
        key: "headline",
        label: "Headline",
        type: "text",
        helper: "Hero headline on the donate page",
        maxLength: 100,
      },
      {
        key: "subtext",
        label: "Subtext",
        type: "textarea",
        helper: "Supporting copy under the donate hero",
        maxLength: 280,
        rows: 4,
      },
    ],
  },
  // {
  //   id: "impactStats",
  //   page: "donate",
  //   label: "Stats",
  //   title: "Impact Stats on Donate Page",
  //   description: "Compact impact figures shown near the donation form",
  //   icon: "stats",
  //   fields: [
  //     {
  //       key: "peopleReached",
  //       label: "People Reached",
  //       type: "number",
  //       helper: "People reached figure on the donate page",
  //     },
  //     {
  //       key: "outreaches",
  //       label: "Outreaches",
  //       type: "number",
  //       helper: "Outreach count shown on the donate page",
  //     },
  //   ],
  // },

  // ── Contact ───────────────────────────────────────────
  {
    id: "hero",
    page: "contact",
    label: "Hero",
    title: "Contact Hero",
    description: "Hero copy that greets visitors on the contact page",
    icon: "text",
    fields: [
      {
        key: "headline",
        label: "Headline",
        type: "text",
        helper: "Main headline on the contact page",
        maxLength: 100,
      },
      {
        key: "subtext",
        label: "Subtext",
        type: "textarea",
        helper: "Supporting copy under the contact hero",
        maxLength: 280,
        rows: 4,
      },
    ],
  },
  // {
  //   id: "info",
  //   page: "contact",
  //   label: "Info",
  //   title: "Contact Information",
  //   description: "Public phone, email, address, and office hours",
  //   icon: "contact",
  //   fields: [
  //     {
  //       key: "phone",
  //       label: "Phone Number",
  //       type: "textarea",
  //       helper: "Public phone numbers (one per line)",
  //       maxLength: 120,
  //       rows: 3,
  //     },
  //     {
  //       key: "email",
  //       label: "Email Address",
  //       type: "text",
  //       helper: "Public email address for general inquiries",
  //       maxLength: 80,
  //     },
  //     {
  //       key: "address",
  //       label: "Physical Address",
  //       type: "textarea",
  //       helper: "Office address — line breaks are preserved",
  //       maxLength: 200,
  //       rows: 3,
  //     },
  //     {
  //       key: "officeHours",
  //       label: "Office Hours",
  //       type: "text",
  //       helper: "Hours of operation shown to visitors",
  //       maxLength: 80,
  //     },
  //   ],
  // },
  // {
  //   id: "social",
  //   page: "contact",
  //   label: "Social",
  //   title: "Social Media Links",
  //   description: "Public profile URLs linked from the contact page",
  //   icon: "social",
  //   fields: [
  //     {
  //       key: "facebook",
  //       label: "Facebook URL",
  //       type: "text",
  //       helper: "Full Facebook page URL",
  //       placeholder: "https://facebook.com/…",
  //     },
  //     {
  //       key: "instagram",
  //       label: "Instagram URL",
  //       type: "text",
  //       helper: "Full Instagram profile URL",
  //       placeholder: "https://instagram.com/…",
  //     },
  //     {
  //       key: "youtube",
  //       label: "YouTube URL",
  //       type: "text",
  //       helper: "Full YouTube channel URL",
  //       placeholder: "https://youtube.com/…",
  //     },
  //   ],
  // },
];

/**
 * Returns content blocks for a given page tab.
 */
export function getBlocksForPage(page: ContentPageKey): ContentBlockDef[] {
  return CONTENT_BLOCKS.filter((block) => block.page === page);
}

/**
 * Reads section values from the content document for a block.
 */
export function getSectionValues(
  content: SiteContentDocument,
  block: ContentBlockDef,
): Record<string, string | number> {
  const page = content[block.page] as
    | HomeContentSection
    | AboutContentSection
    | FounderContentSection
    | GalleryContentSection
    | DonateContentSection
    | ContactContentSection;
  const section = page[block.id as keyof typeof page] as Record<
    string,
    string | number
  >;
  return { ...section };
}
