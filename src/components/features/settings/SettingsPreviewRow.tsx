import { cn } from '@/lib/utils'

interface SettingsPreviewRowProps {
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>
  label: string
  value?: string | null
  href?: string
  multiline?: boolean
  tone?: string
}

/**
 * Icon + label + value row used in Site Settings preview cards.
 */
export function SettingsPreviewRow({
  icon: Icon,
  label,
  value,
  href,
  multiline = false,
  tone = 'bg-primary/10 text-primary',
}: SettingsPreviewRowProps): React.ReactElement {
  const trimmed = value?.trim() ?? ''
  const isEmpty = !trimmed

  return (
    <div className="flex items-start gap-3.5">
      <span
        className={cn(
          'mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
          tone,
        )}
        aria-hidden
      >
        <Icon className="h-4.5 w-4.5" />
      </span>
      <div className="min-w-0 flex-1 pt-0.5">
        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
          {label}
        </p>
        {isEmpty ? (
          <p className="mt-1 text-sm italic text-slate-300">Not set</p>
        ) : href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 block truncate text-sm font-medium text-primary transition-colors hover:text-accent"
          >
            {trimmed}
          </a>
        ) : (
          <p
            className={cn(
              'mt-1 text-sm font-medium text-slate-700',
              multiline && 'whitespace-pre-line',
            )}
          >
            {trimmed}
          </p>
        )}
      </div>
    </div>
  )
}
