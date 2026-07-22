import { Calendar, Clock } from 'lucide-react'
import { Button } from '@heroui/react'
import { Input, Label } from '@/components/ui'
import type { AuditActor } from '@/lib/types'
import { cn } from '@/lib/utils'

export interface AuditTimeDraft {
  from: string
  to: string
}

interface AuditFilterSidebarProps {
  timeDraft: AuditTimeDraft
  onTimeDraftChange: (draft: AuditTimeDraft) => void
  onApplyTime: () => void
  users: AuditActor[]
  eventTypes: string[]
  selectedActorId?: string
  selectedEventType?: string
  onSelectActor: (actorId: string | undefined) => void
  onSelectEventType: (eventType: string | undefined) => void
}

/**
 * Right-rail filters for time range, users, and event types.
 */
export function AuditFilterSidebar({
  timeDraft,
  onTimeDraftChange,
  onApplyTime,
  users,
  eventTypes,
  selectedActorId,
  selectedEventType,
  onSelectActor,
  onSelectEventType,
}: AuditFilterSidebarProps): React.ReactElement {
  return (
    <aside
      aria-label="Audit filters"
      className="space-y-8 lg:sticky lg:top-6"
    >
      <FilterSection title="Filter by time">
        <div className="space-y-3">
          <DateTimeField
            id="audit-from"
            label="From"
            value={timeDraft.from}
            onChange={(from) => onTimeDraftChange({ ...timeDraft, from })}
          />
          <DateTimeField
            id="audit-to"
            label="To"
            value={timeDraft.to}
            onChange={(to) => onTimeDraftChange({ ...timeDraft, to })}
          />
          <Button
            color="primary"
            className="mt-1 h-10 w-full bg-primary font-semibold text-primary-foreground"
            onPress={onApplyTime}
          >
            Filter
          </Button>
        </div>
      </FilterSection>

      <FilterSection title="Filter by users">
        {users.length === 0 ? (
          <p className="text-sm text-slate-400">No users yet</p>
        ) : (
          <ul className="space-y-1">
            <li>
              <FilterLink
                active={!selectedActorId}
                onClick={() => onSelectActor(undefined)}
              >
                All users
              </FilterLink>
            </li>
            {users.map((user) => (
              <li key={user.id || user.email || user.name}>
                <FilterLink
                  active={selectedActorId === user.id}
                  onClick={() =>
                    onSelectActor(
                      selectedActorId === user.id ? undefined : user.id,
                    )
                  }
                >
                  {user.name}
                </FilterLink>
              </li>
            ))}
          </ul>
        )}
      </FilterSection>

      <FilterSection title="Filter by event type">
        {eventTypes.length === 0 ? (
          <p className="text-sm text-slate-400">No event types yet</p>
        ) : (
          <ul className="space-y-1">
            <li>
              <FilterLink
                active={!selectedEventType}
                onClick={() => onSelectEventType(undefined)}
              >
                All events
              </FilterLink>
            </li>
            {eventTypes.map((eventType) => (
              <li key={eventType}>
                <FilterLink
                  active={selectedEventType === eventType}
                  onClick={() =>
                    onSelectEventType(
                      selectedEventType === eventType ? undefined : eventType,
                    )
                  }
                >
                  {eventType}
                </FilterLink>
              </li>
            ))}
          </ul>
        )}
      </FilterSection>
    </aside>
  )
}

function FilterSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}): React.ReactElement {
  return (
    <section>
      <h2 className="mb-3 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
        {title}
      </h2>
      {children}
    </section>
  )
}

function FilterLink({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}): React.ReactElement {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'block w-full rounded-md px-1 py-1.5 text-left text-sm transition-colors',
        active
          ? 'font-semibold text-primary'
          : 'font-medium text-primary/80 hover:text-primary',
      )}
    >
      {children}
    </button>
  )
}

function DateTimeField({
  id,
  label,
  value,
  onChange,
}: {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
}): React.ReactElement {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs font-medium text-slate-500">
        {label}
      </Label>
      <div className="relative">
        <Input
          id={id}
          type="datetime-local"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-11 border-slate-200 bg-white pr-16 shadow-none [color-scheme:light]"
        />
        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center gap-1.5 text-slate-400">
          <Calendar className="h-3.5 w-3.5" aria-hidden />
          <Clock className="h-3.5 w-3.5" aria-hidden />
        </span>
      </div>
    </div>
  )
}
