/**
 * Skeleton placeholders while site settings load.
 */
export function SettingsSkeleton(): React.ReactElement {
  return (
    <div className="space-y-5">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-xl border border-slate-200/80 bg-white p-6 shadow-ambient sm:p-7"
        >
          <div className="mb-6 border-b border-slate-100 pb-5">
            <div className="h-3 w-20 rounded bg-slate-100" />
            <div className="mt-3 h-6 w-48 rounded bg-slate-100" />
            <div className="mt-2 h-4 w-72 rounded bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="h-36 rounded-xl bg-slate-50" />
            <div className="h-11 rounded-lg bg-slate-50" />
            <div className="h-11 rounded-lg bg-slate-50" />
          </div>
        </div>
      ))}
    </div>
  )
}
