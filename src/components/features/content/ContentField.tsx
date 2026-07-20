import type { UseFormRegister, FieldPath } from 'react-hook-form'
import { Input } from '@heroui/react'
import { cn } from '@/lib/utils'
import type { SiteContentDocument } from '@/lib/types'

interface ContentFieldProps {
  name: FieldPath<SiteContentDocument>
  label: string
  hint?: string
  rows?: number
  register: UseFormRegister<SiteContentDocument>
  className?: string
}

/**
 * Labeled text or textarea field bound to the content document form.
 */
export function ContentField({
  name,
  label,
  hint,
  rows,
  register,
  className,
}: ContentFieldProps): React.ReactElement {
  if (rows && rows > 1) {
    return (
      <div className={cn('space-y-2', className)}>
        <label
          htmlFor={name}
          className="block text-sm font-semibold text-primary"
        >
          {label}
        </label>
        {hint ? <p className="text-xs leading-relaxed text-slate-400">{hint}</p> : null}
        <textarea
          id={name}
          rows={rows}
          className="w-full resize-y rounded-lg border border-slate-200 bg-white px-3.5 py-3 text-sm leading-relaxed text-slate-800 shadow-none transition-colors placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          {...register(name)}
        />
      </div>
    )
  }

  return (
    <Input
      id={name}
      label={label}
      labelPlacement="outside"
      description={hint}
      variant="bordered"
      className={className}
      classNames={{
        label: 'text-sm font-semibold text-primary',
        description: 'text-xs text-slate-400',
        inputWrapper:
          'border-slate-200 shadow-none data-[hover=true]:border-primary/40',
      }}
      {...register(name)}
    />
  )
}
