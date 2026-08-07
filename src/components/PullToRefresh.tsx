import { useRef, useState, type ReactNode, type TouchEvent } from 'react'
import { RefreshCw } from 'lucide-react'

interface PullToRefreshProps {
  onRefresh: () => void
  isRefreshing: boolean
  children: ReactNode
}

const PULL_THRESHOLD = 64
const MAX_PULL = 90
const PULL_RESISTANCE = 0.45

export function PullToRefresh({ onRefresh, isRefreshing, children }: PullToRefreshProps) {
  const [pullDistance, setPullDistance] = useState(0)
  const [isTouching, setIsTouching] = useState(false)
  const startYRef = useRef<number | null>(null)

  const handleTouchStart = (e: TouchEvent) => {
    if (isRefreshing || window.scrollY > 0) {
      startYRef.current = null
      return
    }
    startYRef.current = e.touches[0].clientY
  }

  const handleTouchMove = (e: TouchEvent) => {
    if (startYRef.current === null) return
    const delta = e.touches[0].clientY - startYRef.current
    if (delta <= 0 || window.scrollY > 0) {
      setIsTouching(false)
      setPullDistance(0)
      startYRef.current = null
      return
    }
    setIsTouching(true)
    setPullDistance(Math.min(delta * PULL_RESISTANCE, MAX_PULL))
  }

  const handleTouchEnd = () => {
    if (pullDistance >= PULL_THRESHOLD) onRefresh()
    setIsTouching(false)
    setPullDistance(0)
    startYRef.current = null
  }

  const displayDistance = isRefreshing ? 48 : pullDistance
  const progress = Math.min(displayDistance / PULL_THRESHOLD, 1)

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="flex items-center justify-center overflow-hidden sm:hidden"
        style={{
          height: displayDistance,
          transition: isTouching ? 'none' : 'height 0.25s ease-out',
        }}
      >
        <RefreshCw
          size={20}
          className={isRefreshing ? 'animate-spin-slow text-[var(--color-accent)]' : 'text-[var(--color-text-muted)]'}
          style={{
            transform: isRefreshing ? undefined : `rotate(${progress * 360}deg)`,
            opacity: progress,
          }}
        />
      </div>
      {children}
    </div>
  )
}
