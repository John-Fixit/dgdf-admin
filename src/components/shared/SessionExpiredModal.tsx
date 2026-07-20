import { useNavigate } from 'react-router-dom'
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/react'
import { loginPathWithFrom } from '@/lib/authRedirect'
import { useAuthStore } from '@/store/authStore'
import { useSessionStore } from '@/store/sessionStore'

/**
 * Blocking modal shown when an API request returns 401.
 * Only action is to continue to login with a `from` return path.
 */
export function SessionExpiredModal(): React.ReactElement {
  const navigate = useNavigate()
  const isOpen = useSessionStore((s) => s.isExpiredOpen)
  const from = useSessionStore((s) => s.from)
  const closeExpired = useSessionStore((s) => s.closeExpired)
  const clearSession = useAuthStore((s) => s.clearSession)

  function handleLogin() {
    closeExpired()
    clearSession()
    navigate(loginPathWithFrom(`/${from}`), { replace: true })
  }

  return (
    <Modal
      isOpen={isOpen}
      isDismissable={false}
      hideCloseButton
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
                Session expired
              </h2>
            </ModalHeader>
            <ModalBody>
              <p className="text-sm leading-relaxed text-slate-500">
                Your session has expired. Please log in again to continue.
              </p>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" className="w-full" onPress={handleLogin}>
                Login
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
