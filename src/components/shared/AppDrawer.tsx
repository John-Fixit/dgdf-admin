import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
} from '@heroui/react'
import { useDrawerStore } from '@/store/drawerStore'

/**
 * App-wide drawer host. Open via `useDrawerStore().openDrawer(...)`.
 */
export function AppDrawer(): React.ReactElement {
  const isOpen = useDrawerStore((s) => s.isOpen)
  const title = useDrawerStore((s) => s.title)
  const description = useDrawerStore((s) => s.description)
  const size = useDrawerStore((s) => s.size)
  const placement = useDrawerStore((s) => s.placement)
  const content = useDrawerStore((s) => s.content)
  const setOpen = useDrawerStore((s) => s.setOpen)
  const closeDrawer = useDrawerStore((s) => s.closeDrawer)

  return (
    <Drawer
      isOpen={isOpen}
      onOpenChange={setOpen}
      onClose={closeDrawer}
      size={size}
      placement={placement}
      backdrop="blur"
      classNames={{
        base: 'bg-white',
        header: 'border-b border-slate-200/70 px-6 py-6 sm:px-8',
        body: 'px-6 py-7 sm:px-8',
        closeButton:
          'top-5 right-5 text-slate-400 hover:bg-slate-100 hover:text-primary',
      }}
    >
      <DrawerContent>
        {() => (
          <>
            <DrawerHeader className="flex flex-col items-start gap-1.5">
              <h2 className="font-display text-2xl font-semibold tracking-tight text-primary">
                {title}
              </h2>
              {description ? (
                <p className="max-w-md text-sm font-normal leading-relaxed text-slate-500">
                  {description}
                </p>
              ) : null}
            </DrawerHeader>
            <DrawerBody className="scrollbar-thin">{content}</DrawerBody>
          </>
        )}
      </DrawerContent>
    </Drawer>
  )
}
