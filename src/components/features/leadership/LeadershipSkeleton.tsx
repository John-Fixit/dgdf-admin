/**
 * Skeleton placeholders while leadership loads.
 */
export function LeadershipSkeleton(): React.ReactElement {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-ambient"
        >
          <div className="aspect-[4/3] bg-slate-100" />
          <div className="space-y-3 p-5">
            <div className="h-3 w-24 rounded bg-slate-100" />
            <div className="h-5 w-2/3 rounded bg-slate-100" />
            <div className="h-3 w-full rounded bg-slate-50" />
            <div className="h-3 w-4/5 rounded bg-slate-50" />
            <div className="mt-4 flex justify-end gap-2 border-t border-slate-100 pt-4">
              <div className="h-9 w-9 rounded-lg bg-slate-100" />
              <div className="h-9 w-20 rounded-lg bg-slate-100" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
