import { CloudSun, MapPin, RefreshCw } from 'lucide-react'
import { formatUpdatedTime } from '../utils/format'

interface HeaderProps {
  locationName: string
  updatedAt: string | null
  isRefreshing: boolean
  onRefresh: () => void
  onOpenSearch: () => void
}

export function Header({
  locationName,
  updatedAt,
  isRefreshing,
  onRefresh,
  onOpenSearch,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--color-border)]/80 bg-[var(--color-bg)]/85 backdrop-blur-sm">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-4 sm:px-6 sm:py-5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400/20 to-indigo-400/10 text-sky-400 ring-1 ring-inset ring-sky-400/20">
            <CloudSun size={20} strokeWidth={2} />
          </div>
          <div className="min-w-0">
            <button
              type="button"
              onClick={onOpenSearch}
              className="group flex items-center gap-1.5 text-left"
            >
              <h1 className="truncate text-lg font-semibold tracking-tight text-[var(--color-text)] sm:text-2xl">
                สภาพอากาศเขต{locationName}
              </h1>
              <MapPin
                size={15}
                className="mt-0.5 shrink-0 text-[var(--color-text-muted)] transition-colors group-hover:text-[var(--color-accent)]"
              />
            </button>
            <p className="mt-0.5 text-xs text-[var(--color-text-muted)] sm:text-sm">
              {updatedAt ? formatUpdatedTime(updatedAt) : 'กำลังโหลดข้อมูล...'}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onRefresh}
          disabled={isRefreshing}
          aria-label="รีเฟรชข้อมูล"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-soft)] shadow-[var(--shadow-card)] transition-all hover:border-[var(--color-accent)]/50 hover:text-[var(--color-accent)] active:scale-95 disabled:opacity-60"
        >
          <RefreshCw
            size={18}
            className={isRefreshing ? 'animate-spin-slow' : ''}
          />
        </button>
      </div>
    </header>
  )
}
