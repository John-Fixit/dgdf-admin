import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { addToast, Button, Select, SelectItem } from '@heroui/react'
import { Save } from 'lucide-react'
import { ImageUploadField } from '@/components/shared'
import { useUpdateGallery } from '@/hooks'
import { useDrawerStore } from '@/store/drawerStore'
import { cn } from '@/lib/utils'
import type { GalleryItem, GalleryUpdatePayload } from '@/lib/types'

const STATUSES = [
  { key: 'active', label: 'Published' },
  { key: 'draft', label: 'Draft' },
  { key: 'archived', label: 'Archived' },
] as const

interface GalleryEditFormProps {
  item: GalleryItem
}

type FormValues = {
  title: string
  description: string
  category: string
  location: string
  imageUrl: string
  status: GalleryItem['status']
  sortOrder: number
}

const fieldClass = cn(
  'h-11 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-800 shadow-sm transition-colors',
  'placeholder:text-slate-400',
  'focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20',
)

/**
 * Edit form for an existing gallery asset.
 */
export function GalleryEditForm({
  item,
}: GalleryEditFormProps): React.ReactElement {
  const closeDrawer = useDrawerStore((s) => s.closeDrawer)
  const updateMutation = useUpdateGallery()
  const [imageFile, setImageFile] = useState<File | null>(null)

  const { register, handleSubmit, watch, reset, setValue, formState } =
    useForm<FormValues>({
      defaultValues: {
        title: item.title,
        description: item.description,
        category: item.category,
        location: item.location ?? '',
        imageUrl: item.imageUrl,
        status: item.status,
        sortOrder: item.sortOrder,
      },
    })

  useEffect(() => {
    reset({
      title: item.title,
      description: item.description,
      category: item.category,
      location: item.location ?? '',
      imageUrl: item.imageUrl,
      status: item.status,
      sortOrder: item.sortOrder,
    })
    setImageFile(null)
  }, [item, reset])

  const imageUrl = watch('imageUrl')
  const status = watch('status')
  const title = watch('title') ?? ''
  const description = watch('description') ?? ''

  const submit = handleSubmit(async (values) => {
    const payload: GalleryUpdatePayload = {
      title: values.title.trim(),
      description: values.description.trim(),
      category: values.category.trim() || 'General',
      location: values.location.trim() || undefined,
      imageUrl: values.imageUrl.trim(),
      status: values.status,
      sortOrder: Number(values.sortOrder) || 0,
      file: imageFile ?? undefined,
    }

    if (!payload.title || !payload.imageUrl) {
      addToast({
        title: 'Please fill required fields',
        description: 'Title and media are required.',
        color: 'danger',
      })
      return
    }

    try {
      await updateMutation.mutateAsync({ id: item.id, payload })
      closeDrawer()
      addToast({
        title: 'Changes saved',
        description: 'Gallery asset updated successfully',
        color: 'success',
      })
    } catch {
      addToast({
        title: 'Failed to save. Try again.',
        color: 'danger',
      })
    }
  })

  return (
    <form
      className="flex h-full flex-col"
      onSubmit={(event) => {
        event.preventDefault()
        void submit()
      }}
    >
      <div className="flex-1 space-y-5">
        {item.mediaType === 'image' ? (
          <ImageUploadField
            label="Media"
            helper="Replace the image · JPG, PNG, or WEBP · Max 5 MB"
            value={imageUrl}
            onChange={(url, file) => {
              setImageFile(file)
              setValue('imageUrl', url, { shouldDirty: true })
            }}
          />
        ) : (
          <div className="space-y-2">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-accent">
              Video preview
            </p>
            <video
              src={imageUrl}
              controls
              className="aspect-video w-full rounded-xl border border-slate-200 bg-slate-50 object-cover"
            />
            <p className="text-xs text-slate-400">
              Video file replacement will be available when media API is wired.
            </p>
          </div>
        )}

        <div className="space-y-2">
          <label
            htmlFor="gal-title"
            className="block text-[11px] font-bold uppercase tracking-[0.14em] text-accent"
          >
            Title
          </label>
          <input
            id="gal-title"
            maxLength={100}
            className={fieldClass}
            {...register('title')}
          />
          <p className="text-right text-[11px] tabular-nums text-slate-300">
            {title.length}/100
          </p>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="gal-desc"
            className="block text-[11px] font-bold uppercase tracking-[0.14em] text-accent"
          >
            Description
          </label>
          <textarea
            id="gal-desc"
            rows={4}
            maxLength={400}
            className={cn(fieldClass, 'h-auto resize-y py-3')}
            {...register('description')}
          />
          <p className="text-right text-[11px] tabular-nums text-slate-300">
            {description.length}/400
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label
              htmlFor="gal-category"
              className="block text-[11px] font-bold uppercase tracking-[0.14em] text-accent"
            >
              Category
            </label>
            <input
              id="gal-category"
              className={fieldClass}
              {...register('category')}
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="gal-location"
              className="block text-[11px] font-bold uppercase tracking-[0.14em] text-accent"
            >
              Location
            </label>
            <input
              id="gal-location"
              className={fieldClass}
              placeholder="Optional"
              {...register('location')}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="block text-[11px] font-bold uppercase tracking-[0.14em] text-accent">
              Status
            </label>
            <Select
              selectedKeys={[status]}
              onSelectionChange={(keys) => {
                const value = Array.from(keys)[0]
                if (
                  value === 'active' ||
                  value === 'draft' ||
                  value === 'archived'
                ) {
                  setValue('status', value, { shouldDirty: true })
                }
              }}
              classNames={{
                trigger:
                  'h-11 rounded-lg border border-slate-200 bg-white shadow-none',
              }}
              aria-label="Status"
            >
              {STATUSES.map((option) => (
                <SelectItem key={option.key}>{option.label}</SelectItem>
              ))}
            </Select>
          </div>
          <div className="space-y-2">
            <label
              htmlFor="gal-order"
              className="block text-[11px] font-bold uppercase tracking-[0.14em] text-accent"
            >
              Sort order
            </label>
            <input
              id="gal-order"
              type="number"
              min={0}
              className={fieldClass}
              {...register('sortOrder', { valueAsNumber: true })}
            />
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 mt-8 flex gap-3 border-t border-slate-100 bg-white pt-5">
        <Button
          type="button"
          variant="bordered"
          className="flex-1 rounded-lg border-slate-200 font-semibold"
          isDisabled={updateMutation.isPending}
          onPress={closeDrawer}
        >
          Cancel
        </Button>
        <Button
          type="button"
          color="primary"
          className="flex-1 rounded-lg font-semibold"
          isLoading={updateMutation.isPending}
          isDisabled={!formState.isDirty}
          startContent={
            updateMutation.isPending ? null : <Save className="h-4 w-4" />
          }
          onPress={() => void submit()}
        >
          Save changes
        </Button>
      </div>
    </form>
  )
}
