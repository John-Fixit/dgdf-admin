import { create } from 'zustand'
import type { ReactNode } from 'react'

export type DrawerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | 'full'
export type DrawerPlacement = 'left' | 'right' | 'top' | 'bottom'

export interface OpenDrawerOptions {
  title: string
  description?: string
  size?: DrawerSize
  placement?: DrawerPlacement
  /** Body content rendered inside the shared AppDrawer */
  content: ReactNode
}

interface DrawerState {
  isOpen: boolean
  title: string
  description?: string
  size: DrawerSize
  placement: DrawerPlacement
  content: ReactNode | null
  openDrawer: (options: OpenDrawerOptions) => void
  closeDrawer: () => void
  setOpen: (open: boolean) => void
}

/**
 * Global drawer host for create/edit and other secondary actions.
 */
export const useDrawerStore = create<DrawerState>((set) => ({
  isOpen: false,
  title: '',
  description: undefined,
  size: 'md',
  placement: 'right',
  content: null,

  openDrawer: ({ title, description, size = 'md', placement = 'right', content }) => {
    set({
      isOpen: true,
      title,
      description,
      size,
      placement,
      content,
    })
  },

  closeDrawer: () => {
    set({ isOpen: false })
  },

  setOpen: (open) => {
    set({ isOpen: open })
  },
}))
