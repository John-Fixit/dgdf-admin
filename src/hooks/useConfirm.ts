import { useConfirmStore } from '@/store/confirmStore'
import type { ConfirmOptions } from '@/store/confirmStore'

/**
 * Promise-based confirm dialog for destructive or irreversible actions.
 *
 * @example
 * const { confirm } = useConfirm()
 * const ok = await confirm({
 *   title: 'Delete image?',
 *   description: 'This cannot be undone.',
 *   confirmLabel: 'Delete',
 * })
 */
export function useConfirm() {
  const openConfirm = useConfirmStore((s) => s.openConfirm)

  return {
    confirm: (options: ConfirmOptions) => openConfirm(options),
  }
}
