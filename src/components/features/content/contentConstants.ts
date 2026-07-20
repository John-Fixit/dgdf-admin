import type { ContentPageKey } from '@/lib/types'

export const CONTENT_PAGES: {
  key: ContentPageKey
  label: string
  publicPath: string
  description: string
  sections: number
}[] = [
  {
    key: 'home',
    label: 'Home',
    publicPath: '/',
    description: 'Hero, mission, vision, and impact narrative',
    sections: 5,
  },
  {
    key: 'about',
    label: 'About',
    publicPath: '/about',
    description: 'Heritage story, mission/vision, and CTAs',
    sections: 4,
  },
  {
    key: 'founder',
    label: 'Founder',
    publicPath: '/founder',
    description: 'Leadership profile and founding story',
    sections: 3,
  },
  {
    key: 'donate',
    label: 'Donate',
    publicPath: '/donate',
    description: 'Giving hero, impact framing, transparency',
    sections: 3,
  },
  {
    key: 'contact',
    label: 'Contact',
    publicPath: '/contact',
    description: 'Inquiry copy and office details',
    sections: 3,
  },
  {
    key: 'gallery',
    label: 'Gallery',
    publicPath: '/gallery',
    description: 'Page copy only — media stays in Gallery',
    sections: 2,
  },
]
