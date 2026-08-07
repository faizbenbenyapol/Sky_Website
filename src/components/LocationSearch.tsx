import { useEffect, useRef, useState } from 'react'
import { Search, X, MapPin, Loader2, LocateFixed } from 'lucide-react'
import type { LocationInfo } from '../types'
import { BANGKOK_DISTRICTS, searchDistricts } from '../data/districts'
import { searchLocationsOnline } from '../api/weather'
import { getCurrentLocation } from '../utils/geolocation'

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
  const [isLocating, setIsLocating] = useState(false)
  const [locateError, setLocateError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setOnlineResults([])
      setLocateError(null)
      requestAnimationFrame(() => inputRef.current?.focus())
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

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

  const handleUseCurrentLocation = async () => {
    if (!navigator.geolocation) {
      setLocateError('อุปกรณ์นี้ไม่รองรับการระบุตำแหน่ง')
      return
    }
    setLocateError(null)
    setIsLocating(true)
    const location = await getCurrentLocation({ timeout: 10000 })
    setIsLocating(false)
    if (location) {
      handleSelect(location)
    } else {
      setLocateError('ไม่สามารถเข้าถึงตำแหน่งของคุณได้ กรุณาอนุญาตการเข้าถึงตำแหน่ง')
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 sm:items-center sm:p-4"
      style={{ animation: 'fade-in 0.18s ease-out' }}
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="ค้นหาพื้นที่"
        className="flex max-h-[85vh] w-full flex-col border-t border-[var(--color-border)] bg-[var(--color-bg-soft)] sm:max-h-[32rem] sm:max-w-md sm:border"
        style={{ animation: 'sheet-up 0.22s cubic-bezier(0.32, 0.72, 0, 1)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center pb-1 pt-2.5 sm:hidden">
          <span className="h-1 w-9 rounded-full bg-[var(--color-border)]" />
        </div>

        <div className="flex shrink-0 items-center gap-2 border-b border-[var(--color-border)] px-4 py-3">
          <Search size={18} className="text-[var(--color-text-muted)]" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ค้นหาเขตหรือพื้นที่..."
            inputMode="search"
            className="flex-1 bg-transparent text-base text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-muted)]"
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
            className="flex h-7 w-7 shrink-0 items-center justify-center text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text)]"
          >
            <X size={18} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain py-2 [padding-bottom:max(0.5rem,env(safe-area-inset-bottom))]">
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            disabled={isLocating}
            className="flex w-full items-center gap-3 border-b border-[var(--color-border)] px-4 py-3 text-left transition-colors hover:bg-[var(--color-surface)] disabled:opacity-60"
          >
            {isLocating ? (
              <Loader2
                size={16}
                className="shrink-0 animate-spin text-[var(--color-accent)]"
              />
            ) : (
              <LocateFixed size={16} className="shrink-0 text-[var(--color-accent)]" />
            )}
            <span className="text-base text-[var(--color-text)]">
              {isLocating ? 'กำลังค้นหาตำแหน่ง...' : 'ใช้ตำแหน่งปัจจุบันของฉัน'}
            </span>
          </button>
          {locateError && (
            <p className="px-4 py-2 text-xs text-[var(--color-bad)]">{locateError}</p>
          )}
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
              className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-[var(--color-surface)] active:bg-[var(--color-surface-hover)]"
            >
              <MapPin size={16} className="shrink-0 text-[var(--color-accent)]" />
              <span className="text-base text-[var(--color-text)]">
                เขต{loc.name}
              </span>
              <span className="ml-auto shrink-0 text-xs text-[var(--color-text-muted)]">
                {loc.admin}
              </span>
            </button>
          ))}
          {extraOnline.map((loc) => (
            <button
              key={`online-${loc.name}-${loc.lat}`}
              type="button"
              onClick={() => handleSelect(loc)}
              className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-[var(--color-surface)] active:bg-[var(--color-surface-hover)]"
            >
              <MapPin size={16} className="shrink-0 text-[var(--color-text-muted)]" />
              <span className="text-base text-[var(--color-text)]">{loc.name}</span>
              <span className="ml-auto shrink-0 text-xs text-[var(--color-text-muted)]">
                {loc.admin}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
