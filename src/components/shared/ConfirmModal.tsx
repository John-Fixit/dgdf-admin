import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/react'
import { useConfirmStore } from '@/store/confirmStore'

/**
 * App-wide confirm modal host. Open via `useConfirm().confirm(...)`.
 */
export function ConfirmModal(): React.ReactElement {
  const isOpen = useConfirmStore((s) => s.isOpen)
  const request = useConfirmStore((s) => s.request)
  const setOpen = useConfirmStore((s) => s.setOpen)
  const resolveConfirm = useConfirmStore((s) => s.resolveConfirm)

  const variant = request?.variant ?? 'danger'
  const confirmLabel = request?.confirmLabel ?? 'Confirm'
  const cancelLabel = request?.cancelLabel ?? 'Cancel'

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={setOpen}
      backdrop="blur"
      placement="center"
      classNames={{
        base: 'bg-white',
        header: 'border-b border-slate-200/80',
        footer: 'border-t border-slate-200/80',
      }}
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <h2 className="font-display text-xl font-semibold text-primary">
                {request?.title}
              </h2>
            </ModalHeader>
            <ModalBody>
              {request?.description ? (
                <p className="text-sm leading-relaxed text-slate-500">
                  {request.description}
                </p>
              ) : null}
            </ModalBody>
            <ModalFooter>
              <Button variant="bordered" onPress={() => resolveConfirm(false)}>
                {cancelLabel}
              </Button>
              <Button
                color={variant === 'danger' ? 'danger' : 'primary'}
                onPress={() => resolveConfirm(true)}
              >
                {confirmLabel}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
