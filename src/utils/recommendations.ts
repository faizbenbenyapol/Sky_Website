import {
  Umbrella,
  Shirt,
  Footprints,
  Wind,
  type LucideIcon,
} from 'lucide-react'
import type { Pm25Reading, SeverityLevel, WeatherData } from '../types'
import { isHeavyRain } from './weatherCode'

export interface PM25Info {
  level: string
  severity: SeverityLevel
}

// เกณฑ์ AQI มาจากสถานีตรวจวัดจริง (มาตรฐาน US EPA ที่ WAQI ใช้คำนวณ)
// เกณฑ์ µg/m³ มาจากค่าประมาณการแบบจำลองบรรยากาศ อิงเกณฑ์กรมควบคุมมลพิษไทย
export function getPM25Info(pm25: Pm25Reading | null): PM25Info {
  if (pm25 === null) return { level: 'ไม่มีข้อมูล', severity: 'unknown' }
  if (pm25.unit === 'aqi') {
    if (pm25.value <= 50) return { level: 'ดี', severity: 'good' }
    if (pm25.value <= 100) return { level: 'ปานกลาง', severity: 'warn' }
    if (pm25.value <= 150) return { level: 'เริ่มมีผลกระทบต่อกลุ่มเสี่ยง', severity: 'warn' }
    if (pm25.value <= 200) return { level: 'มีผลกระทบต่อสุขภาพ', severity: 'bad' }
    return { level: 'มีผลกระทบต่อสุขภาพมาก', severity: 'bad' }
  }
  if (pm25.value <= 25) return { level: 'ดี', severity: 'good' }
  if (pm25.value <= 37) return { level: 'ปานกลาง', severity: 'warn' }
  if (pm25.value <= 50) return { level: 'เริ่มมีผลกระทบ', severity: 'warn' }
  return { level: 'มีผลกระทบต่อสุขภาพ', severity: 'bad' }
}

export interface ActivityItem {
  id: string
  icon: LucideIcon
  question: string
  answer: string
  severity: SeverityLevel
}

export function getActivityRecommendations(data: WeatherData): ActivityItem[] {
  const { rainChance, feelsLike, pm25 } = data
  const pm25Info = getPM25Info(pm25)
  const heavyRain = isHeavyRain(data.weatherCode)

  const umbrella: ActivityItem =
    rainChance >= 60
      ? {
          id: 'umbrella',
          icon: Umbrella,
          question: 'ต้องพกร่มไหม',
          answer: 'ควรพกร่ม',
          severity: 'bad',
        }
      : rainChance >= 30
        ? {
            id: 'umbrella',
            icon: Umbrella,
            question: 'ต้องพกร่มไหม',
            answer: 'พกไว้ก่อนดีกว่า',
            severity: 'warn',
          }
        : {
            id: 'umbrella',
            icon: Umbrella,
            question: 'ต้องพกร่มไหม',
            answer: 'ไม่จำเป็น',
            severity: 'good',
          }

  const laundry: ActivityItem =
    rainChance >= 50
      ? {
          id: 'laundry',
          icon: Shirt,
          question: 'ตากผ้ากลางแจ้งได้ไหม',
          answer: 'ไม่แนะนำ',
          severity: 'bad',
        }
      : rainChance >= 25
        ? {
            id: 'laundry',
            icon: Shirt,
            question: 'ตากผ้ากลางแจ้งได้ไหม',
            answer: 'เสี่ยง ควรระวัง',
            severity: 'warn',
          }
        : {
            id: 'laundry',
            icon: Shirt,
            question: 'ตากผ้ากลางแจ้งได้ไหม',
            answer: 'ตากได้สบาย',
            severity: 'good',
          }

  const outdoorBad = heavyRain || rainChance >= 60 || pm25Info.severity === 'bad'
  const outdoorWarn =
    rainChance >= 30 || pm25Info.severity === 'warn' || feelsLike >= 38

  const outdoor: ActivityItem = outdoorBad
    ? {
        id: 'outdoor',
        icon: Footprints,
        question: 'เหมาะกับการออกไปข้างนอกไหม',
        answer: 'ไม่แนะนำ',
        severity: 'bad',
      }
    : outdoorWarn
      ? {
          id: 'outdoor',
          icon: Footprints,
          question: 'เหมาะกับการออกไปข้างนอกไหม',
          answer: 'ออกได้ แต่ควรระวัง',
          severity: 'warn',
        }
      : {
          id: 'outdoor',
          icon: Footprints,
          question: 'เหมาะกับการออกไปข้างนอกไหม',
          answer: 'เหมาะมาก',
          severity: 'good',
        }

  const mask: ActivityItem =
    pm25Info.severity === 'bad'
      ? {
          id: 'mask',
          icon: Wind,
          question: 'ควรสวมหน้ากากไหม',
          answer: 'ควรสวม',
          severity: 'bad',
        }
      : pm25Info.severity === 'warn'
        ? {
            id: 'mask',
            icon: Wind,
            question: 'ควรสวมหน้ากากไหม',
            answer: 'ควรพิจารณา',
            severity: 'warn',
          }
        : pm25Info.severity === 'unknown'
          ? {
              id: 'mask',
              icon: Wind,
              question: 'ควรสวมหน้ากากไหม',
              answer: 'ไม่มีข้อมูลฝุ่น',
              severity: 'unknown',
            }
          : {
              id: 'mask',
              icon: Wind,
              question: 'ควรสวมหน้ากากไหม',
              answer: 'ไม่จำเป็น',
              severity: 'good',
            }

  return [umbrella, laundry, outdoor, mask]
}

export interface SummaryInfo {
  headline: string
  detail: string
  severity: SeverityLevel
}

export function getSummary(data: WeatherData): SummaryInfo {
  const { rainChance, pm25, feelsLike } = data
  const pm25Info = getPM25Info(pm25)
  const heavyRain = isHeavyRain(data.weatherCode)

  if (heavyRain || rainChance >= 60) {
    return {
      headline: 'วันนี้น่าจะตก! พกร่มไว้เลย',
      detail: `โอกาสเกิดฝน ${rainChance}% โดยเฉพาะ${data.rainPeakLabel}`,
      severity: 'bad',
    }
  }
  if (rainChance >= 30) {
    return {
      headline: 'อากาศครึ้ม อาจมีฝนบางช่วง',
      detail: `โอกาสเกิดฝน ${rainChance}% ${data.rainPeakLabel}`,
      severity: 'warn',
    }
  }
  if (pm25Info.severity === 'bad' && pm25) {
    return {
      headline: 'อากาศไม่ดี ฝุ่น PM2.5 สูง',
      detail:
        pm25.unit === 'aqi'
          ? `ดัชนีคุณภาพอากาศอยู่ที่ ${pm25.value} AQI ควรสวมหน้ากาก`
          : `ค่าฝุ่น PM2.5 อยู่ที่ ${pm25.value} ไมโครกรัม/ลบ.ม. ควรสวมหน้ากาก`,
      severity: 'bad',
    }
  }
  if (feelsLike >= 38) {
    return {
      headline: 'อากาศร้อนจัด ดื่มน้ำเยอะ ๆ',
      detail: `รู้สึกได้ถึง ${feelsLike}° ควรหลีกเลี่ยงแดดจัด`,
      severity: 'warn',
    }
  }
  if (pm25Info.severity === 'warn') {
    return {
      headline: 'วันนี้อากาศดี แต่ฝุ่นเริ่มสูง',
      detail: `ค่าฝุ่น PM2.5 อยู่ในระดับ${pm25Info.level} ควรสังเกตอาการ`,
      severity: 'warn',
    }
  }
  return {
    headline: 'วันนี้อากาศดี ออกไปข้างนอกได้สบาย',
    detail: `โอกาสเกิดฝนต่ำเพียง ${rainChance}% เหมาะกับกิจกรรมกลางแจ้ง`,
    severity: 'good',
  }
}
