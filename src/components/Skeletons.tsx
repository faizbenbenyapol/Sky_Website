export function SummaryCardSkeleton() {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-card)] sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1 space-y-3">
          <div className="skeleton h-5 w-24 rounded-full" />
          <div className="skeleton h-7 w-3/4 rounded-md" />
          <div className="skeleton h-4 w-full max-w-sm rounded-md" />
        </div>
        <div className="skeleton h-20 w-20 shrink-0 rounded-2xl sm:h-24 sm:w-24" />
      </div>
    </div>
  )
}

export function KeyMetricsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card)]"
        >
          <div className="skeleton h-8 w-8 rounded-lg" />
          <div className="skeleton mt-3.5 h-8 w-16 rounded-md" />
          <div className="skeleton mt-2 h-3 w-24 rounded-md" />
        </div>
      ))}
    </div>
  )
}

export function ActivityListSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-card)]">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className={`flex items-center gap-3 px-4 py-3.5 ${
            i !== 3 ? 'border-b border-[var(--color-border)]' : ''
          }`}
        >
          <div className="skeleton h-9 w-9 shrink-0 rounded-full" />
          <div className="skeleton h-4 flex-1 rounded-md" />
          <div className="skeleton h-6 w-16 rounded-full" />
        </div>
      ))}
    </div>
  )
}

export function HourlyForecastSkeleton() {
  return (
    <div className="flex gap-3 overflow-x-auto pb-1 sm:grid sm:grid-cols-6">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="skeleton h-[124px] w-[92px] shrink-0 rounded-xl shadow-[var(--shadow-card)] sm:w-auto"
        />
      ))}
    </div>
  )
}
