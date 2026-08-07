export function SummaryCardSkeleton() {
  return (
    <div className="flex border border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="skeleton w-1 shrink-0" />
      <div className="min-w-0 flex-1 space-y-2 px-4 py-3.5">
        <div className="skeleton h-4 w-2/3" />
        <div className="skeleton h-3.5 w-full max-w-sm" />
      </div>
    </div>
  )
}

export function KeyMetricsSkeleton() {
  return (
    <div className="flex divide-x divide-[var(--color-border)] border border-[var(--color-border)] bg-[var(--color-surface)]">
      {[0, 1].map((i) => (
        <div key={i} className="flex-1 p-5">
          <div className="skeleton h-3 w-16" />
          <div className="skeleton mt-3.5 h-8 w-16" />
          <div className="skeleton mt-2 h-3 w-24" />
        </div>
      ))}
    </div>
  )
}

export function ActivityListSkeleton() {
  return (
    <div className="border border-[var(--color-border)] bg-[var(--color-surface)]">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className={`flex items-center gap-3 px-4 py-3.5 ${
            i !== 3 ? 'border-b border-[var(--color-border)]' : ''
          }`}
        >
          <div className="skeleton h-[18px] w-[18px] shrink-0" />
          <div className="skeleton h-4 flex-1" />
          <div className="skeleton h-4 w-16" />
        </div>
      ))}
    </div>
  )
}

export function HourlyForecastSkeleton() {
  return (
    <div className="flex divide-x divide-[var(--color-border)] overflow-x-auto border border-[var(--color-border)] sm:grid sm:grid-cols-6">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="skeleton h-[140px] w-[96px] shrink-0 sm:w-auto" />
      ))}
    </div>
  )
}
