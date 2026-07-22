/**
 * Skeleton placeholders shown while content loads.
 */
export function ContentSkeleton(): React.ReactElement {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="flex min-h-30 flex-col overflow-hidden rounded-[14px] border border-[#E5E9EF] bg-white"
        >
          <div className="flex animate-pulse items-start justify-between gap-4 bg-[#EBF0F7] px-6 py-5">
            <div className="min-w-0 flex-1">
              <div className="h-5 w-14 rounded-full bg-slate-200/80" />
              <div className="mt-2.5 h-5 w-4/5 rounded bg-slate-200/70" />
              <div className="mt-1.5 h-3.5 w-full rounded bg-slate-200/50" />
            </div>
            <div className="mt-0.5 h-5 w-5 shrink-0 rounded bg-slate-200/40" />
          </div>
          <div className="flex flex-1 animate-pulse flex-col px-6 py-5">
            <div className="h-2.5 w-28 rounded bg-slate-100" />
            <div className="mt-3 space-y-2">
              <div className="h-3.5 w-full rounded bg-slate-50" />
              <div className="h-3.5 w-5/6 rounded bg-slate-50" />
              <div className="h-3.5 w-2/3 rounded bg-slate-50" />
            </div>
            <div className="mt-auto flex justify-end pt-5">
              <div className="h-9 w-20 rounded-lg bg-slate-100" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
