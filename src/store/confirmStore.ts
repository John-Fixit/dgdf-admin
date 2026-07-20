import { create } from 'zustand'

export type ConfirmVariant = 'danger' | 'primary'

export interface ConfirmOptions {
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: ConfirmVariant
}

interface ConfirmRequest extends ConfirmOptions {
  resolve: (confirmed: boolean) => void
}

interface ConfirmState {
  isOpen: boolean
  request: ConfirmRequest | null
  openConfirm: (options: ConfirmOptions) => Promise<boolean>
  resolveConfirm: (confirmed: boolean) => void
  setOpen: (open: boolean) => void
}

/**
 * Global confirm dialog state. Prefer `useConfirm().confirm(...)`.
 */
export const useConfirmStore = create<ConfirmState>((set, get) => ({
  isOpen: false,
  request: null,

  openConfirm: (options) => {
    return new Promise<boolean>((resolve) => {
      set({
        isOpen: true,
        request: { ...options, resolve },
      })
    })
  },

  resolveConfirm: (confirmed) => {
    const { request } = get()
    request?.resolve(confirmed)
    set({ isOpen: false, request: null })
  },

  setOpen: (open) => {
    if (!open) {
      get().resolveConfirm(false)
      return
    }
    set({ isOpen: open })
  },
}))
