export type WeatherCategory =
  | 'clear'
  | 'cloudy'
  | 'overcast'
  | 'fog'
  | 'drizzle'
  | 'rain'
  | 'heavy-rain'
  | 'storm'
  | 'snow'

const STORM_CODES = new Set([95, 96, 99])
const HEAVY_RAIN_CODES = new Set([65, 67, 82])
const RAIN_CODES = new Set([61, 63, 80, 81])
const DRIZZLE_CODES = new Set([51, 53, 55, 56, 57])
const SNOW_CODES = new Set([71, 73, 75, 77, 85, 86])
const FOG_CODES = new Set([45, 48])

export function getWeatherCategory(code: number): WeatherCategory {
  if (STORM_CODES.has(code)) return 'storm'
  if (HEAVY_RAIN_CODES.has(code)) return 'heavy-rain'
  if (RAIN_CODES.has(code)) return 'rain'
  if (DRIZZLE_CODES.has(code)) return 'drizzle'
  if (SNOW_CODES.has(code)) return 'snow'
  if (FOG_CODES.has(code)) return 'fog'
  if (code === 3) return 'overcast'
  if (code === 1 || code === 2) return 'cloudy'
  return 'clear'
}

// โทนหมึกบนกระดาษ ไม่ใช้สีสดเหมือนหน้าจอทั่วไป ให้ความรู้สึกภาพประกอบพิมพ์
export function getWeatherAccent(category: WeatherCategory, isDay: boolean): string {
  switch (category) {
    case 'storm':
      return 'text-[#4a3f6b]'
    case 'heavy-rain':
    case 'rain':
    case 'drizzle':
      return 'text-[#2f5163]'
    case 'snow':
      return 'text-[#3d5a73]'
    case 'fog':
      return 'text-[var(--color-text-muted)]'
    case 'overcast':
      return 'text-[var(--color-text-soft)]'
    case 'cloudy':
      return isDay ? 'text-[#6b5a3a]' : 'text-[#4a3f6b]'
    case 'clear':
      return isDay ? 'text-[var(--color-warn)]' : 'text-[#4a3f6b]'
  }
}

// วอเตอร์มาร์กเบา ๆ บนหัวข่าว ไม่ใช้ไล่สีเข้มแบบธีมมืด เพื่อคงความเป็นกระดาษ
export function getSkyGradient(category: WeatherCategory, isDay: boolean): string {
  switch (category) {
    case 'storm':
      return 'from-[#4a3f6b]/[0.07] via-transparent to-transparent'
    case 'heavy-rain':
      return 'from-[#2f5163]/[0.09] via-transparent to-transparent'
    case 'rain':
    case 'drizzle':
      return 'from-[#2f5163]/[0.06] via-transparent to-transparent'
    case 'fog':
      return 'from-[var(--color-text-muted)]/[0.08] via-transparent to-transparent'
    case 'snow':
      return 'from-[#3d5a73]/[0.06] via-transparent to-transparent'
    case 'overcast':
      return 'from-[var(--color-text-muted)]/[0.10] via-transparent to-transparent'
    case 'cloudy':
      return isDay
        ? 'from-[#6b5a3a]/[0.06] via-transparent to-transparent'
        : 'from-[#4a3f6b]/[0.07] via-transparent to-transparent'
    case 'clear':
      return isDay
        ? 'from-[var(--color-warn)]/[0.10] via-transparent to-transparent'
        : 'from-[#4a3f6b]/[0.08] via-transparent to-transparent'
  }
}
