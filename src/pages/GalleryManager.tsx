import { useMemo } from 'react'
import { Button, addToast } from '@heroui/react'
import { Upload } from 'lucide-react'
import { PageHeader } from '@/components/shared'
import { GalleryGrid, GalleryUploadForm } from '@/components/features/gallery'
import { useAuth, useDrawer, useGallery } from '@/hooks'
import { can, PERMISSION_DENIED_MESSAGE } from '@/lib/permissions'

/**
 * Gallery Manager — curate visual impact assets for the public site.
 */
export default function GalleryManager(): React.ReactElement {
  const { open } = useDrawer()
  const { user } = useAuth()
  const { data = [] } = useGallery()
  const canManage = can(user?.role, 'manageGallery')

  const stats = useMemo(() => {
    const published = data.filter((item) => item.status === 'active').length
    const drafts = data.filter((item) => item.status === 'draft').length
    return {
      total: data.length,
      published,
      drafts,
    }
  }, [data])

  function openUploadDrawer(): void {
    if (!canManage) {
      addToast({ title: PERMISSION_DENIED_MESSAGE, color: 'danger' })
      return
    }
    open({
      title: 'Add Gallery Media',
      description:
        'Upload photos or videos, set defaults, then review before saving.',
      size: '2xl',
      content: <GalleryUploadForm />,
    })
  }

  return (
    <div>
      <PageHeader
        title="Gallery"
        description="Curate photos and videos that tell your foundation’s impact story on the public site."
        actionsAlign="end"
        actions={
          <div className="flex flex-wrap items-center gap-3">
            {stats.total > 0 ? (
              <div className="hidden items-center gap-3 rounded-xl border border-slate-200/80 bg-white px-4 py-2.5 shadow-ambient sm:flex">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-accent">
                    Assets
                  </p>
                  <p className="font-display text-lg font-semibold leading-none text-primary">
                    {stats.total}
                  </p>
                </div>
                <div className="h-8 w-px bg-slate-200" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-accent">
                    Published
                  </p>
                  <p className="font-display text-lg font-semibold leading-none text-primary">
                    {stats.published}
                  </p>
                </div>
                <div className="h-8 w-px bg-slate-200" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-accent">
                    Drafts
                  </p>
                  <p className="font-display text-lg font-semibold leading-none text-primary">
                    {stats.drafts}
                  </p>
                </div>
              </div>
            ) : null}
            {canManage ? (
              <Button
                color="primary"
                className="rounded-lg font-semibold tracking-wide"
                startContent={<Upload className="h-4 w-4" />}
                onPress={openUploadDrawer}
              >
                Upload media
              </Button>
            ) : null}
          </div>
        }
      />

      <GalleryGrid canManage={canManage} />
    </div>
  )
}
