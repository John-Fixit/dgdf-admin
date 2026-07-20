/**
 * Skeleton placeholders shown while content loads.
 */
export function ContentSkeleton(): React.ReactElement {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-3xl border border-slate-100 bg-white p-6 shadow-ambient"
          style={{ borderLeftWidth: 4, borderLeftColor: '#F0A50033' }}
        >
          <div className="h-3 w-16 rounded bg-slate-100" />
          <div className="mt-4 h-6 w-3/5 rounded bg-slate-100" />
          <div className="mt-3 h-4 w-4/5 rounded bg-slate-100" />
          <div className="mt-5 space-y-2">
            <div className="h-3 w-full rounded bg-slate-50" />
            <div className="h-3 w-2/3 rounded bg-slate-50" />
          </div>
          <div className="mt-8 flex justify-end">
            <div className="h-9 w-20 rounded-full bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  )
}
