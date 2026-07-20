import type { UseFormRegister } from 'react-hook-form'
import type { ContentPageKey, SiteContentDocument } from '@/lib/types'
import { ContentField } from './ContentField'
import { SectionCard } from './SectionCard'

interface PanelProps {
  register: UseFormRegister<SiteContentDocument>
}

/**
 * Home page content sections.
 */
function HomePanel({ register }: PanelProps): React.ReactElement {
  return (
    <div className="space-y-5">
      <SectionCard
        index={0}
        eyebrow="Section 01"
        title="Hero Narrative"
        description="Primary headline and supporting copy visitors see first on the homepage."
        mapsTo="/ · Hero"
      >
        <ContentField
          name="home.heroHeadline"
          label="Hero headline"
          rows={2}
          register={register}
          hint="Keep this bold, faith-forward, and under two lines."
        />
        <ContentField
          name="home.missionText"
          label="Supporting paragraph"
          rows={4}
          register={register}
        />
        <ContentField
          name="home.establishedYear"
          label="Established year badge"
          register={register}
        />
      </SectionCard>

      <SectionCard
        index={1}
        eyebrow="Section 02"
        title="Mission & Mandate"
        description="Faith-driven framing shown in the homepage mission block."
        mapsTo="/ · Mission"
      >
        <ContentField
          name="home.mandateHeadline"
          label="Mandate headline"
          register={register}
        />
        <ContentField
          name="home.mandateQuote"
          label="Mandate quote"
          rows={3}
          register={register}
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <ContentField name="home.mandate" label="Mandate summary" rows={4} register={register} />
          <ContentField name="home.vision" label="Vision summary" rows={4} register={register} />
        </div>
      </SectionCard>

      <SectionCard
        index={2}
        eyebrow="Section 03"
        title="Impact Metrics"
        description="Headline statistics displayed beneath the mission narrative."
        mapsTo="/ · Impact"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <ContentField name="home.livesImpacted" label="Lives impacted" register={register} />
          <ContentField name="home.outreaches" label="Outreaches" register={register} />
          <ContentField name="home.volunteers" label="Volunteers" register={register} />
          <ContentField name="home.successRate" label="Success rate" register={register} />
        </div>
      </SectionCard>

      <SectionCard
        index={3}
        eyebrow="Section 04"
        title="Vision Callout"
        description="Closing vision statement and impact philosophy."
        mapsTo="/ · Vision"
      >
        <ContentField name="home.visionHeadline" label="Vision headline" rows={2} register={register} />
        <ContentField name="home.impactCallout" label="Impact callout" register={register} />
        <ContentField
          name="home.impactCalloutBody"
          label="Impact callout body"
          rows={3}
          register={register}
        />
        <ContentField name="home.aboutText" label="Foundation overview" rows={4} register={register} />
      </SectionCard>

      <SectionCard
        index={4}
        eyebrow="Section 05"
        title="Donate CTA Band"
        description="Homepage call-to-action that drives visitors to the donate flow."
        mapsTo="/ · Donate CTA"
      >
        <ContentField name="home.donateCtaHeadline" label="CTA headline" register={register} />
        <ContentField name="home.donateCtaBody" label="CTA body" rows={3} register={register} />
        <ContentField name="home.donateCtaPrimary" label="Primary button label" register={register} />
      </SectionCard>
    </div>
  )
}

/**
 * About page content sections.
 */
function AboutPanel({ register }: PanelProps): React.ReactElement {
  return (
    <div className="space-y-5">
      <SectionCard
        index={0}
        eyebrow="Section 01"
        title="Heritage Hero"
        description="Opening identity block for the About page."
        mapsTo="/about · Hero"
      >
        <ContentField name="about.label" label="Eyebrow label" register={register} />
        <div className="grid gap-5 sm:grid-cols-3">
          <ContentField name="about.headline" label="Headline" register={register} />
          <ContentField name="about.headlineAccent" label="Accent phrase" register={register} />
          <ContentField name="about.headlineSuffix" label="Headline suffix" register={register} />
        </div>
        <ContentField name="about.intro" label="Intro paragraph" rows={4} register={register} />
      </SectionCard>

      <SectionCard
        index={1}
        eyebrow="Section 02"
        title="Mission & Vision"
        description="Core institutional statements shown mid-page."
        mapsTo="/about · Mission"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <ContentField name="about.missionTitle" label="Mission title" register={register} />
          <ContentField name="about.visionTitle" label="Vision title" register={register} />
        </div>
        <ContentField name="about.missionBody" label="Mission body" rows={4} register={register} />
        <ContentField name="about.visionBody" label="Vision body" rows={4} register={register} />
        <ContentField name="about.quote" label="Pull quote" rows={2} register={register} />
      </SectionCard>

      <SectionCard
        index={2}
        eyebrow="Section 03"
        title="Journey & Leadership"
        description="Section labels for timeline and board modules."
        mapsTo="/about · Journey"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <ContentField name="about.journeyLabel" label="Journey label" register={register} />
          <ContentField name="about.journeyHeadline" label="Journey headline" register={register} />
          <ContentField name="about.leadershipLabel" label="Leadership label" register={register} />
          <ContentField
            name="about.leadershipHeadline"
            label="Leadership headline"
            register={register}
          />
        </div>
      </SectionCard>

      <SectionCard
        index={3}
        eyebrow="Section 04"
        title="Closing CTA"
        description="Final conversion band on the About page."
        mapsTo="/about · CTA"
      >
        <ContentField name="about.ctaHeadline" label="CTA headline" register={register} />
        <ContentField name="about.ctaBody" label="CTA body" rows={3} register={register} />
        <div className="grid gap-5 sm:grid-cols-2">
          <ContentField name="about.ctaPrimary" label="Primary button" register={register} />
          <ContentField name="about.ctaSecondary" label="Secondary button" register={register} />
        </div>
      </SectionCard>
    </div>
  )
}

/**
 * Founder page content sections.
 */
function FounderPanel({ register }: PanelProps): React.ReactElement {
  return (
    <div className="space-y-5">
      <SectionCard
        index={0}
        eyebrow="Section 01"
        title="Founder Profile"
        description="Identity and introduction for the founder page."
        mapsTo="/founder · Hero"
      >
        <ContentField name="founder.label" label="Eyebrow label" register={register} />
        <div className="grid gap-5 sm:grid-cols-2">
          <ContentField name="founder.name" label="Full name" register={register} />
          <ContentField name="founder.role" label="Role / title" register={register} />
        </div>
        <ContentField name="founder.intro" label="Intro" rows={4} register={register} />
      </SectionCard>

      <SectionCard
        index={1}
        eyebrow="Section 02"
        title="Leadership Article"
        description="Long-form narrative and signature quote."
        mapsTo="/founder · Article"
      >
        <ContentField name="founder.articleLabel" label="Article label" register={register} />
        <ContentField name="founder.articleHeadline" label="Article headline" register={register} />
        <ContentField name="founder.articleBody" label="Article body" rows={6} register={register} />
        <ContentField name="founder.quote" label="Quote" rows={2} register={register} />
        <ContentField name="founder.quoteAttribution" label="Quote attribution" register={register} />
      </SectionCard>

      <SectionCard
        index={2}
        eyebrow="Section 03"
        title="Founder CTA"
        mapsTo="/founder · CTA"
      >
        <ContentField name="founder.ctaHeadline" label="CTA headline" register={register} />
        <ContentField name="founder.ctaBody" label="CTA body" rows={3} register={register} />
        <div className="grid gap-5 sm:grid-cols-2">
          <ContentField name="founder.ctaPrimary" label="Primary button" register={register} />
          <ContentField name="founder.ctaSecondary" label="Secondary button" register={register} />
        </div>
      </SectionCard>
    </div>
  )
}

/**
 * Donate page content sections.
 */
function DonatePanel({ register }: PanelProps): React.ReactElement {
  return (
    <div className="space-y-5">
      <SectionCard
        index={0}
        eyebrow="Section 01"
        title="Giving Hero"
        description="Primary fundraising narrative above the donation form."
        mapsTo="/donate · Hero"
      >
        <ContentField name="donate.heroLabel" label="Eyebrow label" register={register} />
        <div className="grid gap-5 sm:grid-cols-2">
          <ContentField name="donate.heroHeadline" label="Headline" register={register} />
          <ContentField name="donate.heroAccent" label="Accent phrase" register={register} />
        </div>
        <ContentField name="donate.heroBody" label="Hero body" rows={4} register={register} />
      </SectionCard>

      <SectionCard
        index={1}
        eyebrow="Section 02"
        title="Impact Framing"
        mapsTo="/donate · Impact"
      >
        <ContentField name="donate.impactTitle" label="Impact title" register={register} />
        <ContentField name="donate.impactQuote" label="Impact quote" rows={2} register={register} />
      </SectionCard>

      <SectionCard
        index={2}
        eyebrow="Section 03"
        title="Transparency Block"
        description="Trust and stewardship messaging shown beside giving."
        mapsTo="/donate · Transparency"
      >
        <ContentField name="donate.transparencyLabel" label="Label" register={register} />
        <ContentField name="donate.transparencyHeadline" label="Headline" register={register} />
        <ContentField
          name="donate.transparencyBody"
          label="Body"
          rows={4}
          register={register}
        />
      </SectionCard>
    </div>
  )
}

/**
 * Contact page content sections.
 */
function ContactPanel({ register }: PanelProps): React.ReactElement {
  return (
    <div className="space-y-5">
      <SectionCard
        index={0}
        eyebrow="Section 01"
        title="Contact Hero"
        mapsTo="/contact · Hero"
      >
        <ContentField name="contact.label" label="Eyebrow label" register={register} />
        <ContentField name="contact.headline" label="Headline" rows={2} register={register} />
        <ContentField name="contact.body" label="Body" rows={4} register={register} />
        <ContentField name="contact.quote" label="Side quote" rows={2} register={register} />
      </SectionCard>

      <SectionCard
        index={1}
        eyebrow="Section 02"
        title="Office Details"
        description="One detail per line. These populate the public contact detail list."
        mapsTo="/contact · Details"
      >
        <ContentField
          name="contact.addressLines"
          label="Address lines"
          rows={3}
          register={register}
          hint="One line per row."
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <ContentField
            name="contact.emailLines"
            label="Email lines"
            rows={3}
            register={register}
          />
          <ContentField
            name="contact.phoneLines"
            label="Phone lines"
            rows={3}
            register={register}
          />
        </div>
        <ContentField
          name="contact.officeHours"
          label="Office hours"
          rows={3}
          register={register}
        />
      </SectionCard>

      <SectionCard
        index={2}
        eyebrow="Section 03"
        title="Inquiry Options"
        description="Dropdown choices on the public contact form."
        mapsTo="/contact · Form"
      >
        <ContentField
          name="contact.inquiryOptions"
          label="Inquiry types"
          rows={4}
          register={register}
          hint="One option per line."
        />
      </SectionCard>
    </div>
  )
}

/**
 * Gallery page copy sections (media managed separately).
 */
function GalleryPanel({ register }: PanelProps): React.ReactElement {
  return (
    <div className="space-y-5">
      <SectionCard
        index={0}
        eyebrow="Section 01"
        title="Gallery Hero Copy"
        description="Editorial framing for the public gallery page. Upload media in Gallery Manager."
        mapsTo="/gallery · Hero"
      >
        <ContentField name="gallery.heroLabel" label="Eyebrow label" register={register} />
        <ContentField name="gallery.heroHeadline" label="Headline" rows={2} register={register} />
        <ContentField name="gallery.heroBody" label="Body" rows={3} register={register} />
      </SectionCard>

      <SectionCard
        index={1}
        eyebrow="Section 02"
        title="Gallery CTA"
        mapsTo="/gallery · CTA"
      >
        <ContentField name="gallery.ctaHeadline" label="CTA headline" register={register} />
        <ContentField name="gallery.ctaBody" label="CTA body" rows={3} register={register} />
        <ContentField name="gallery.ctaPrimary" label="Primary button" register={register} />
      </SectionCard>
    </div>
  )
}

interface ContentPagePanelsProps {
  page: ContentPageKey
  register: UseFormRegister<SiteContentDocument>
}

/**
 * Renders the active page’s section editors.
 */
export function ContentPagePanels({
  page,
  register,
}: ContentPagePanelsProps): React.ReactElement {
  switch (page) {
    case 'home':
      return <HomePanel register={register} />
    case 'about':
      return <AboutPanel register={register} />
    case 'founder':
      return <FounderPanel register={register} />
    case 'donate':
      return <DonatePanel register={register} />
    case 'contact':
      return <ContactPanel register={register} />
    case 'gallery':
      return <GalleryPanel register={register} />
  }
}
