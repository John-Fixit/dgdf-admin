import { cn } from '@/lib/utils'

export const fieldClass = cn(
  'h-11 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-800 shadow-sm transition-colors',
  'placeholder:text-slate-400',
  'focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20',
)

interface SettingsFieldProps {
  id: string
  label: string
  helper: string
  maxLength?: number
  count?: number
  children: React.ReactNode
}

/**
 * Shared labelled field shell for Site Settings forms.
 */
export function SettingsField({
  id,
  label,
  helper,
  maxLength,
  count,
  children,
}: SettingsFieldProps): React.ReactElement {
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
