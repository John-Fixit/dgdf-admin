import { useMemo } from "react";
import { motion } from "framer-motion";
import type { AuditLogEntry } from "@/lib/types";
import { AuditEventIcon } from "./AuditEventIcon";

interface AuditTimelineProps {
  items: AuditLogEntry[];
}

const EASE = [0.22, 1, 0.36, 1] as const;

interface DateGroup {
  key: string;
  label: string;
  items: AuditLogEntry[];
}

/**
 * Chronological audit trail grouped by calendar day.
 */
export function AuditTimeline({
  items,
}: AuditTimelineProps): React.ReactElement {
  const groups = useMemo(() => groupByDate(items), [items]);

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
        <p className="text-sm font-medium text-slate-600">
          No audit events found
        </p>
        <p className="mt-1 text-sm text-slate-400">
          Try adjusting the time range or clearing filters.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {groups.map((group, groupIndex) => (
        <motion.section
          key={group.key}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.35,
            delay: groupIndex * 0.04,
            ease: EASE,
          }}
          aria-label={`Events on ${group.label}`}
        >
          <div className="relative mb-8 flex items-center justify-center">
            <div className="absolute inset-x-0 top-1/2 h-px bg-slate-200" />
            <span className="relative rounded-full bg-white shadow px-3.5 py-1 text-xs font-medium text-slate-500">
              {group.label}
            </span>
          </div>

          <ol className="relative space-y-0 pl-0">
            {group.items.map((entry, index) => {
              const isLast = index === group.items.length - 1;
              return (
                <li
                  key={entry.id}
                  className="relative grid grid-cols-[4.5rem_2rem_minmax(0,1fr)] gap-x-3 pb-8 last:pb-0 sm:grid-cols-[5.5rem_2rem_minmax(0,1fr)] sm:gap-x-4"
                >
                  <time
                    dateTime={entry.createdAt}
                    className="pt-1.5 text-right text-xs tabular-nums text-slate-400 sm:text-sm"
                  >
                    {formatTime(entry.createdAt)}
                  </time>

                  <div className="relative flex justify-center pt-0.5">
                    {!isLast ? (
                      <span
                        className="absolute left-1/2 top-8 -bottom-8 w-px -translate-x-1/2 bg-slate-200"
                        aria-hidden
                      />
                    ) : null}
                    <AuditEventIcon entry={entry} />
                  </div>

                  <div className="min-w-0 pt-0.5">
                    <p className="text-sm leading-snug text-slate-800 sm:text-[15px]">
                      <span className="font-bold text-primary">
                        {entry.actor.name}
                      </span>{" "}
                      <span className="font-medium text-slate-700">
                        {activitySummary(entry)}
                      </span>
                      {entry.entity !== "auth" && entry.entityLabel ? (
                        <>
                          {" "}
                          <span className="font-semibold text-slate-800">
                            &ldquo;{entry.entityLabel}&rdquo;
                          </span>
                        </>
                      ) : null}
                    </p>

                    <p className="mt-1 text-xs text-slate-400 sm:text-[13px]">
                      {entry.entity === "auth"
                        ? "Authentication"
                        : entry.entityTypeLabel}
                      {entry.entityId ? (
                        <>
                          {" "}
                          <span aria-hidden>·</span> {entry.entityId}
                        </>
                      ) : null}
                    </p>

                    {entry.entity !== "auth" && entry.changes.length > 0 ? (
                      <p className="mt-2 font-mono text-xs text-slate-500 sm:text-[13px]">
                        {entry.changes.join(", ")}
                      </p>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ol>
        </motion.section>
      ))}
    </div>
  );
}

/**
 * Groups entries by local calendar day, newest day first.
 */
function groupByDate(items: AuditLogEntry[]): DateGroup[] {
  const map = new Map<string, DateGroup>();

  for (const item of items) {
    const date = new Date(item.createdAt);
    const key = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("-");

    const existing = map.get(key);
    if (existing) {
      existing.items.push(item);
    } else {
      map.set(key, {
        key,
        label: formatDayLabel(date),
        items: [item],
      });
    }
  }

  return [...map.values()];
}

/**
 * @param date
 */
function formatDayLabel(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

/**
 * @param iso
 */
function formatTime(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(new Date(iso));
}

/**
 * @param entry
 */
function activitySummary(entry: AuditLogEntry): string {
  if (entry.entity === "auth") {
    if (entry.changes.includes("login") || entry.action === "create") {
      return "logged in";
    }
    return "logged out";
  }

  const verb =
    entry.action === "create"
      ? "Created"
      : entry.action === "delete"
        ? "Deleted"
        : "Updated";
  return `${verb} ${entry.entityTypeLabel.toLowerCase()}`;
}
