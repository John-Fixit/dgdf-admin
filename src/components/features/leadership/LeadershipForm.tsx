import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { addToast, Button, Switch } from '@heroui/react'
import { Save } from 'lucide-react'
import { ImageUploadField } from '@/components/shared'
import {
  useCreateLeadership,
  useUpdateLeadership,
} from '@/hooks'
import { useDrawerStore } from '@/store/drawerStore'
import { cn } from '@/lib/utils'
import type { LeadershipMember, LeadershipMemberPayload } from '@/lib/types'

interface LeadershipFormProps {
  member?: LeadershipMember
  /** Next sort order suggestion for new members */
  nextSortOrder: number
}

type FormValues = {
  name: string
  role: string
  bio: string
  photoUrl: string
  sortOrder: number
  status: 'published' | 'draft'
  isFounder: boolean
}

/**
 * Create / edit form for a leadership member (drawer body).
 */
export function LeadershipForm({
  member,
  nextSortOrder,
}: LeadershipFormProps): React.ReactElement {
  const closeDrawer = useDrawerStore((s) => s.closeDrawer)
  const createMutation = useCreateLeadership()
  const updateMutation = useUpdateLeadership()
  const isEditing = Boolean(member)
  const [photoFile, setPhotoFile] = useState<File | null>(null)

  const defaultValues = useMemo<FormValues>(
    () => ({
      name: member?.name ?? '',
      role: member?.role ?? '',
      bio: member?.bio ?? '',
      photoUrl: member?.photoUrl ?? '',
      sortOrder: member?.sortOrder ?? nextSortOrder,
      status: member?.status ?? 'published',
      isFounder: member?.isFounder ?? false,
    }),
    [member, nextSortOrder],
  )

  const { register, handleSubmit, watch, reset, setValue, formState } =
    useForm<FormValues>({
      defaultValues,
    })

  useEffect(() => {
    reset(defaultValues)
    setPhotoFile(null)
  }, [defaultValues, reset])

  const photoUrl = watch('photoUrl')
  const status = watch('status')
  const isFounder = watch('isFounder')
  const bio = watch('bio') ?? ''
  const isSaving = createMutation.isPending || updateMutation.isPending

  async function onSave(values: FormValues): Promise<void> {
    const payload: LeadershipMemberPayload = {
      name: values.name.trim(),
      role: values.role.trim(),
      bio: values.bio.trim(),
      photoUrl: values.photoUrl.trim(),
      sortOrder: Number(values.sortOrder) || 1,
      status: values.status,
      isFounder: values.isFounder,
      file: photoFile ?? undefined,
    }

    if (!payload.name || !payload.role || (!payload.photoUrl && !payload.file)) {
      addToast({
        title: 'Please fill required fields',
        description: 'Name, role, and a profile photo are required.',
        color: 'danger',
      })
      return
    }

    try {
      if (member) {
        await updateMutation.mutateAsync({ id: member.id, payload })
      } else {
        await createMutation.mutateAsync(payload)
      }
      closeDrawer()
      addToast({
        title: 'Changes saved',
        description: member
          ? 'Leadership profile updated successfully'
          : 'Leadership profile added successfully',
        color: 'success',
      })
    } catch {
      addToast({
        title: 'Failed to save. Try again.',
        color: 'danger',
      })
    }
  }

  const submit = handleSubmit((values) => {
    void onSave(values)
  })

  return (
    <form
      className="flex h-full flex-col"
      onSubmit={(event) => {
        event.preventDefault()
        void submit()
      }}
    >
      <div className="flex-1 space-y-6">
        <ImageUploadField
          label="Profile Photo"
          helper="Upload a clear headshot · JPG, PNG, or WEBP · Max 5 MB"
          value={photoUrl}
          onChange={(url, file) => {
            setPhotoFile(file)
            setValue('photoUrl', url, { shouldDirty: true, shouldValidate: true })
          }}
        />

        <Field
          id="lead-name"
          label="Full Name"
          helper="Display name on the About page leadership section"
          maxLength={80}
          count={watch('name')?.length ?? 0}
        >
          <input
            id="lead-name"
            maxLength={80}
            className={fieldClass}
            placeholder="Dr. Adebayo Ogunlesi"
            {...register('name')}
          />
        </Field>

        <Field
          id="lead-role"
          label="Role / Title"
          helper="Position shown beneath the name"
          maxLength={80}
          count={watch('role')?.length ?? 0}
        >
          <input
            id="lead-role"
            maxLength={80}
            className={fieldClass}
            placeholder="Founder & CEO"
            {...register('role')}
          />
        </Field>

        <Field
          id="lead-bio"
          label="Biography"
          helper="Short bio visitors read on the public About page"
          maxLength={400}
          count={bio.length}
        >
          <textarea
            id="lead-bio"
            rows={5}
            maxLength={400}
            className={cn(fieldClass, 'h-auto resize-y py-3')}
            placeholder="A short professional biography…"
            {...register('bio')}
          />
        </Field>

        <Field
          id="lead-order"
          label="Display Order"
          helper="Lower numbers appear first in the leadership row"
        >
          <input
            id="lead-order"
            type="number"
            min={1}
            className={cn(fieldClass, 'max-w-[140px]')}
            {...register('sortOrder', { valueAsNumber: true })}
          />
        </Field>

        <div className="space-y-4 rounded-xl border border-slate-100 bg-slate-50/60 p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-accent">
                Published
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Draft profiles stay hidden on the public site
              </p>
            </div>
            <Switch
              size="sm"
              color="success"
              isSelected={status === 'published'}
              onValueChange={(selected) =>
                setValue('status', selected ? 'published' : 'draft', {
                  shouldDirty: true,
                })
              }
            />
          </div>

          <div className="h-px bg-slate-200/80" />

          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-accent">
                Founder Profile
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Links this person to the public founder page
              </p>
            </div>
            <Switch
              size="sm"
              color="primary"
              isSelected={isFounder}
              onValueChange={(selected) =>
                setValue('isFounder', selected, { shouldDirty: true })
              }
            />
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 mt-8 flex gap-3 border-t border-slate-100 bg-white pt-5">
        <Button
          type="button"
          variant="bordered"
          className="flex-1 rounded-lg border-slate-200 font-semibold"
          isDisabled={isSaving}
          onPress={closeDrawer}
        >
          Cancel
        </Button>
        <Button
          type="button"
          color="primary"
          className="flex-1 rounded-lg font-semibold tracking-wide"
          isLoading={isSaving}
          isDisabled={isEditing && !formState.isDirty}
          startContent={isSaving ? null : <Save className="h-4 w-4" />}
          onPress={() => void submit()}
        >
          {isEditing ? 'Save changes' : 'Add member'}
        </Button>
      </div>
    </form>
  )
}

const fieldClass = cn(
  'h-11 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-800 shadow-sm transition-colors',
  'placeholder:text-slate-400',
  'focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20',
)

function Field({
  id,
  label,
  helper,
  maxLength,
  count,
  children,
}: {
  id: string
  label: string
  helper: string
  maxLength?: number
  count?: number
  children: React.ReactNode
}): React.ReactElement {
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="block text-[11px] font-bold uppercase tracking-[0.14em] text-accent"
      >
        {label}
      </label>
      {children}
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs leading-relaxed text-slate-400">{helper}</p>
        {maxLength != null && count != null ? (
          <span
            className={cn(
              'shrink-0 text-[11px] tabular-nums',
              count >= maxLength
                ? 'font-semibold text-error'
                : 'text-slate-300',
            )}
          >
            {count}/{maxLength}
          </span>
        ) : null}
      </div>
    </div>
  )
}
