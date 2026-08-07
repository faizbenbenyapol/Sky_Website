import {
  Sun,
  CloudSun,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudRainWind,
  CloudSnow,
  CloudLightning,
  Moon,
  CloudMoon,
  type LucideIcon,
} from 'lucide-react'

interface WeatherCodeInfo {
  label: string
  icon: LucideIcon
}

const WEATHER_CODE_MAP: Record<number, WeatherCodeInfo> = {
  0: { label: 'ท้องฟ้าแจ่มใส', icon: Sun },
  1: { label: 'มีเมฆบางส่วน', icon: CloudSun },
  2: { label: 'เมฆเป็นส่วนมาก', icon: CloudSun },
  3: { label: 'มีเมฆมาก', icon: Cloud },
  45: { label: 'มีหมอก', icon: CloudFog },
  48: { label: 'มีหมอกน้ำแข็ง', icon: CloudFog },
  51: { label: 'ฝนโปรยปรายเบาบาง', icon: CloudDrizzle },
  53: { label: 'ฝนโปรยปราย', icon: CloudDrizzle },
  55: { label: 'ฝนโปรยปรายหนาแน่น', icon: CloudDrizzle },
  56: { label: 'ฝนโปรยปรายเยือกแข็ง', icon: CloudDrizzle },
  57: { label: 'ฝนโปรยปรายเยือกแข็งหนาแน่น', icon: CloudDrizzle },
  61: { label: 'ฝนตกเบา', icon: CloudRain },
  63: { label: 'ฝนตกปานกลาง', icon: CloudRain },
  65: { label: 'ฝนตกหนัก', icon: CloudRainWind },
  66: { label: 'ฝนเยือกแข็งเบา', icon: CloudRain },
  67: { label: 'ฝนเยือกแข็งหนัก', icon: CloudRainWind },
  71: { label: 'หิมะตกเบา', icon: CloudSnow },
  73: { label: 'หิมะตกปานกลาง', icon: CloudSnow },
  75: { label: 'หิมะตกหนัก', icon: CloudSnow },
  77: { label: 'เกล็ดหิมะ', icon: CloudSnow },
  80: { label: 'ฝนตกเป็นช่วง เบา', icon: CloudRain },
  81: { label: 'ฝนตกเป็นช่วง ปานกลาง', icon: CloudRain },
  82: { label: 'ฝนตกเป็นช่วง หนักมาก', icon: CloudRainWind },
  85: { label: 'หิมะตกเป็นช่วง เบา', icon: CloudSnow },
  86: { label: 'หิมะตกเป็นช่วง หนัก', icon: CloudSnow },
  95: { label: 'พายุฝนฟ้าคะนอง', icon: CloudLightning },
  96: { label: 'พายุฝนฟ้าคะนองและลูกเห็บ', icon: CloudLightning },
  99: { label: 'พายุฝนฟ้าคะนองและลูกเห็บหนัก', icon: CloudLightning },
}

export function getWeatherInfo(code: number, isDay = true): WeatherCodeInfo {
  if (!isDay) {
    if (code === 0) return { label: 'ท้องฟ้าแจ่มใส', icon: Moon }
    if (code === 1 || code === 2) {
      return { label: 'มีเมฆบางส่วน', icon: CloudMoon }
    }
  }
  return WEATHER_CODE_MAP[code] ?? { label: 'ไม่ทราบสภาพอากาศ', icon: Cloud }
}

export function isHeavyRain(code: number): boolean {
  return [65, 67, 82, 95, 96, 99].includes(code)
}
