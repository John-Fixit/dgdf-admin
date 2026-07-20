import { heroui } from '@heroui/react'

/**
 * HeroUI plugin configured with DGD Foundation brand colors.
 */
export default heroui({
  themes: {
    light: {
      colors: {
        background: '#F4F6F9',
        foreground: '#1A1C1E',
        primary: {
          DEFAULT: '#1A3A5C',
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#F0A500',
          foreground: '#0F2744',
        },
        focus: '#1A3A5C',
        danger: {
          DEFAULT: '#DC2626',
          foreground: '#FFFFFF',
        },
        success: {
          DEFAULT: '#16A34A',
          foreground: '#FFFFFF',
        },
      },
    },
  },
})
