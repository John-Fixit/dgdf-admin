import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { addToast, Button } from '@heroui/react'
import { Save } from 'lucide-react'
import type { ContentBlockDef } from './contentBlocks'
import { useUpdateContentSection } from '@/hooks'
import { useDrawerStore } from '@/store/drawerStore'
import { cn } from '@/lib/utils'

interface ContentEditFormProps {
  block: ContentBlockDef
  initialValues: Record<string, string | number>
}

/**
 * Section edit form rendered inside the slide-over drawer.
 */
export function ContentEditForm({
  block,
  initialValues,
}: ContentEditFormProps): React.ReactElement {
  const closeDrawer = useDrawerStore((s) => s.closeDrawer)
  const saveMutation = useUpdateContentSection()

  const defaultValues = useMemo(
    () =>
      Object.fromEntries(
        block.fields.map((field) => [
          field.key,
          initialValues[field.key] ?? (field.type === 'number' ? 0 : ''),
        ]),
      ),
    [block.fields, initialValues],
  )

  const { register, handleSubmit, watch, reset, formState } = useForm<
    Record<string, string | number>
  >({
    defaultValues,
  })

  useEffect(() => {
    reset(defaultValues)
  }, [defaultValues, reset])

  const values = watch()
  const isSaving = saveMutation.isPending

  async function handleSave(
    data: Record<string, string | number>,
  ): Promise<void> {
    const normalised: Record<string, string | number> = {}
    for (const field of block.fields) {
      const raw = data[field.key]
      if (field.type === 'number') {
        normalised[field.key] = Number(raw) || 0
      } else {
        normalised[field.key] = String(raw ?? '')
      }
    }

    try {
      await saveMutation.mutateAsync({
        page: block.page,
        section: block.id,
        data: normalised,
      })
      closeDrawer()
      addToast({
        title: 'Changes saved',
        description: 'Section updated successfully',
        color: 'success',
      })
    } catch {
      addToast({
        title: 'Failed to save. Try again.',
        color: 'danger',
      })
    }
  }

  const submit = handleSubmit((data) => {
    void handleSave(data)
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
        {block.fields.map((field) => {
          const current = String(values[field.key] ?? '')
          const count = current.length

          return (
            <div key={field.key} className="space-y-2">
              <label
                htmlFor={`content-field-${field.key}`}
                className="block text-[11px] font-bold uppercase tracking-[0.14em] text-accent"
              >
                {field.label}
              </label>

              {field.type === 'textarea' ? (
                <textarea
                  id={`content-field-${field.key}`}
                  rows={field.rows ?? 4}
                  maxLength={field.maxLength}
                  placeholder={field.placeholder}
                  className={cn(
                    'w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-relaxed text-slate-800 shadow-sm transition-colors',
                    'placeholder:text-slate-400',
                    'focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20',
                  )}
                  {...register(field.key)}
                />
              ) : (
                <div
                  className={cn(
                    'flex items-center gap-2',
                    field.type === 'number' && 'max-w-[200px]',
                  )}
                >
                  <input
                    id={`content-field-${field.key}`}
                    type={field.type === 'number' ? 'number' : 'text'}
                    maxLength={field.maxLength}
                    placeholder={field.placeholder}
                    className={cn(
                      'h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 shadow-sm transition-colors',
                      'placeholder:text-slate-400',
                      'focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20',
                    )}
                    {...register(field.key, {
                      valueAsNumber: field.type === 'number',
                    })}
                  />
                  {field.suffix ? (
                    <span className="text-sm font-medium text-slate-400">
                      {field.suffix}
                    </span>
                  ) : null}
                </div>
              )}

              <div className="flex items-start justify-between gap-3">
                <p className="text-xs leading-relaxed text-slate-400">
                  {field.helper}
                </p>
                {field.maxLength && field.type !== 'number' ? (
                  <span
                    className={cn(
                      'shrink-0 text-[11px] tabular-nums',
                      count >= field.maxLength
                        ? 'font-semibold text-error'
                        : 'text-slate-300',
                    )}
                  >
                    {count}/{field.maxLength}
                  </span>
                ) : null}
              </div>
            </div>
          )
        })}
      </div>

      <div className="sticky bottom-0 mt-8 flex gap-3 border-t border-slate-100 bg-white pt-5">
        <Button
          type="button"
          variant="bordered"
          className="flex-1 rounded-xl border-slate-200 font-semibold"
          isDisabled={isSaving}
          onPress={closeDrawer}
        >
          Cancel
        </Button>
        <Button
          type="button"
          color="primary"
          className="flex-1 rounded-xl font-semibold tracking-wide"
          isLoading={isSaving}
          isDisabled={!formState.isDirty}
          startContent={isSaving ? null : <Save className="h-4 w-4" />}
          onPress={() => void submit()}
        >
          Save changes
        </Button>
      </div>
    </form>
  )
}
