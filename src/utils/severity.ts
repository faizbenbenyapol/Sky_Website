import type { SeverityLevel } from '../types'

export const SEVERITY_STYLES: Record<SeverityLevel, { text: string; bar: string }> = {
  good: { text: 'text-[var(--color-good)]', bar: 'bg-[var(--color-good)]' },
  warn: { text: 'text-[var(--color-warn)]', bar: 'bg-[var(--color-warn)]' },
  bad: { text: 'text-[var(--color-bad)]', bar: 'bg-[var(--color-bad)]' },
  unknown: {
    text: 'text-[var(--color-text-muted)]',
    bar: 'bg-[var(--color-text-muted)]',
  },
}
