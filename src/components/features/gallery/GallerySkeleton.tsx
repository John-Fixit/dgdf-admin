/**
 * Skeleton placeholders while gallery loads.
 */
export function GallerySkeleton(): React.ReactElement {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="h-11 w-48 animate-pulse rounded-xl bg-slate-100" />
        <div className="h-11 w-64 animate-pulse rounded-xl bg-slate-100" />
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="animate-pulse overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-ambient"
          >
            <div className="aspect-[4/3] bg-slate-100" />
            <div className="space-y-3 p-5">
              <div className="h-3 w-24 rounded bg-slate-100" />
              <div className="h-5 w-3/5 rounded bg-slate-100" />
              <div className="h-3 w-full rounded bg-slate-50" />
              <div className="h-3 w-2/3 rounded bg-slate-50" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
