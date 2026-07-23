import { useEffect, useRef, useState } from 'react'
import { Search, X, MapPin, Loader2 } from 'lucide-react'
import type { LocationInfo } from '../types'
import { BANGKOK_DISTRICTS, searchDistricts } from '../data/districts'
import { searchLocationsOnline } from '../api/weather'

interface LocationSearchProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (location: LocationInfo) => void
}

export function LocationSearch({
  isOpen,
  onClose,
  onSelect,
}: LocationSearchProps) {
  const [query, setQuery] = useState('')
  const [onlineResults, setOnlineResults] = useState<LocationInfo[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setOnlineResults([])
      requestAnimationFrame(() => inputRef.current?.focus())
    }
  }, [isOpen])

  useEffect(() => {
    const trimmed = query.trim()
    if (trimmed.length < 2) {
      setOnlineResults([])
      return
    }
    setIsSearching(true)
    const timer = setTimeout(() => {
      searchLocationsOnline(trimmed)
        .then(setOnlineResults)
        .catch(() => setOnlineResults([]))
        .finally(() => setIsSearching(false))
    }, 400)
    return () => clearTimeout(timer)
  }, [query])

  if (!isOpen) return null

  const localResults = query.trim() ? searchDistricts(query) : BANGKOK_DISTRICTS
  const localNames = new Set(localResults.map((r) => r.name))
  const extraOnline = onlineResults.filter((r) => !localNames.has(r.name))

  const handleSelect = (location: LocationInfo) => {
    onSelect(location)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 px-4 pt-20"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-soft)] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b border-[var(--color-border)] px-4 py-3">
          <Search size={18} className="text-[var(--color-text-muted)]" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ค้นหาเขตหรือพื้นที่..."
            className="flex-1 bg-transparent text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-muted)] sm:text-base"
          />
          {isSearching && (
            <Loader2
              size={16}
              className="animate-spin text-[var(--color-text-muted)]"
            />
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="ปิด"
            className="text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
          >
            <X size={18} />
          </button>
        </div>
        <div className="max-h-80 overflow-y-auto py-2">
          {localResults.length === 0 && extraOnline.length === 0 && (
            <p className="px-4 py-6 text-center text-sm text-[var(--color-text-muted)]">
              ไม่พบพื้นที่ที่ค้นหา
            </p>
          )}
          {localResults.map((loc) => (
            <button
              key={`local-${loc.name}`}
              type="button"
              onClick={() => handleSelect(loc)}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-[var(--color-surface)]"
            >
              <MapPin size={16} className="shrink-0 text-[var(--color-accent)]" />
              <span className="text-sm text-[var(--color-text)] sm:text-base">
                เขต{loc.name}
              </span>
              <span className="ml-auto text-xs text-[var(--color-text-muted)]">
                {loc.admin}
              </span>
            </button>
          ))}
          {extraOnline.map((loc) => (
            <button
              key={`online-${loc.name}-${loc.lat}`}
              type="button"
              onClick={() => handleSelect(loc)}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-[var(--color-surface)]"
            >
              <MapPin size={16} className="shrink-0 text-[var(--color-text-muted)]" />
              <span className="text-sm text-[var(--color-text)] sm:text-base">
                {loc.name}
              </span>
              <span className="ml-auto text-xs text-[var(--color-text-muted)]">
                {loc.admin}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
