import type { SeverityLevel } from '../types'

export const SEVERITY_STYLES: Record<
  SeverityLevel,
  { text: string; bg: string; border: string; dot: string }
> = {
  good: {
    text: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
    border: 'border-emerald-400/30',
    dot: 'bg-emerald-400',
  },
  warn: {
    text: 'text-amber-400',
    bg: 'bg-amber-400/10',
    border: 'border-amber-400/30',
    dot: 'bg-amber-400',
  },
  bad: {
    text: 'text-rose-400',
    bg: 'bg-rose-400/10',
    border: 'border-rose-400/30',
    dot: 'bg-rose-400',
  },
}
