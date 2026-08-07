import { useMemo } from 'react'
import type { WeatherCategory } from '../utils/theme'

interface WeatherSceneProps {
  category: WeatherCategory
  isDay: boolean
}

interface FallingParticle {
  id: number
  left: number
  size: number
  duration: number
  delay: number
  opacity: number
}

function makeFallingParticles(
  count: number,
  sizeRange: [number, number],
  durationRange: [number, number],
): FallingParticle[] {
  return Array.from({ length: count }, (_, id) => ({
    id,
    left: Math.random() * 100,
    size: sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0]),
    duration: durationRange[0] + Math.random() * (durationRange[1] - durationRange[0]),
    delay: -Math.random() * durationRange[1],
    opacity: 0.3 + Math.random() * 0.45,
  }))
}

const RAIN_DENSITY: Partial<
  Record<WeatherCategory, { count: number; duration: [number, number] }>
> = {
  drizzle: { count: 26, duration: [1.6, 2.4] },
  rain: { count: 46, duration: [1, 1.6] },
  'heavy-rain': { count: 70, duration: [0.6, 1] },
  storm: { count: 76, duration: [0.55, 0.9] },
}

export function WeatherScene({ category, isDay }: WeatherSceneProps) {
  const raindrops = useMemo(() => {
    const config = RAIN_DENSITY[category]
    return config ? makeFallingParticles(config.count, [12, 22], config.duration) : []
  }, [category])

  const snowflakes = useMemo(
    () => (category === 'snow' ? makeFallingParticles(32, [3, 6], [7, 13]) : []),
    [category],
  )

  // ดาวระยิบระยับตอนกลางคืน แสดงเฉพาะฟ้าโปร่ง/เมฆบาง (เมฆหนาบังดาวไม่เห็น)
  const stars = useMemo(() => {
    if (isDay || (category !== 'clear' && category !== 'cloudy')) return []
    return Array.from({ length: 24 }, (_, id) => ({
      id,
      left: Math.random() * 100,
      top: Math.random() * 55,
      size: 1.5 + Math.random() * 1.5,
      duration: 2 + Math.random() * 2.5,
      delay: -Math.random() * 4,
    }))
  }, [category, isDay])

  const clouds = useMemo(() => {
    const count =
      category === 'overcast' ? 5 : category === 'cloudy' || category === 'fog' ? 3 : 0
    return Array.from({ length: count }, (_, id) => ({
      id,
      top: 8 + Math.random() * 34,
      width: 140 + Math.random() * 120,
      height: 40 + Math.random() * 30,
      duration: 46 + Math.random() * 34,
      delay: -Math.random() * 60,
      opacity: 0.1 + Math.random() * 0.1,
    }))
  }, [category])

  const fogBands = useMemo(
    () =>
      category === 'fog'
        ? Array.from({ length: 4 }, (_, id) => ({
            id,
            top: 15 + id * 20,
            duration: 22 + Math.random() * 14,
            delay: -Math.random() * 30,
          }))
        : [],
    [category],
  )

  return (
    <div
      aria-hidden="true"
      className="weather-fx-layer pointer-events-none absolute inset-0 overflow-hidden"
    >
      {category === 'clear' && isDay && (
        <div
          className="weather-fx absolute left-1/2 top-4 h-36 w-36 -translate-x-1/2 rounded-full bg-[var(--color-warn)]/25 blur-2xl"
          style={{ animation: 'sun-pulse 5s ease-in-out infinite' }}
        />
      )}
      {category === 'clear' && !isDay && (
        <div
          className="weather-fx absolute right-10 top-6 h-24 w-24 rounded-full bg-[#4a3f6b]/[0.16] blur-2xl"
          style={{ animation: 'moon-pulse 6s ease-in-out infinite' }}
        />
      )}

      {stars.map((s) => (
        <span
          key={s.id}
          className="weather-fx absolute rounded-full bg-[#4a3f6b]"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            animation: `twinkle ${s.duration}s ease-in-out infinite`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}

      {clouds.map((c) => (
        <span
          key={c.id}
          className="weather-fx absolute rounded-full bg-[var(--color-text-muted)] blur-2xl"
          style={{
            top: `${c.top}%`,
            left: '-20%',
            width: c.width,
            height: c.height,
            opacity: c.opacity,
            animation: `cloud-drift ${c.duration}s linear infinite`,
            animationDelay: `${c.delay}s`,
          }}
        />
      ))}

      {fogBands.map((f) => (
        <span
          key={f.id}
          className="weather-fx absolute h-10 w-[160%] rounded-full bg-[var(--color-text-muted)]/[0.14] blur-xl"
          style={{
            top: `${f.top}%`,
            left: '-30%',
            animation: `cloud-drift ${f.duration}s linear infinite`,
            animationDelay: `${f.delay}s`,
          }}
        />
      ))}

      {raindrops.map((r) => (
        <span
          key={r.id}
          className="weather-fx absolute top-0 w-px rounded-full bg-gradient-to-b from-transparent via-[#2f5163] to-transparent"
          style={{
            left: `${r.left}%`,
            height: r.size,
            opacity: r.opacity,
            animation: `rain-fall ${r.duration}s linear infinite`,
            animationDelay: `${r.delay}s`,
          }}
        />
      ))}

      {snowflakes.map((s) => (
        <span
          key={s.id}
          className="weather-fx absolute top-0 rounded-full bg-[#3d5a73]"
          style={{
            left: `${s.left}%`,
            width: s.size,
            height: s.size,
            opacity: s.opacity,
            animation: `snow-fall ${s.duration}s linear infinite`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
    </div>
  )
}
