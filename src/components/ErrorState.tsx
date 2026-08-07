import { AlertTriangle, RotateCw } from 'lucide-react'

interface ErrorStateProps {
  message: string
  onRetry: () => void
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-14 text-center">
      <AlertTriangle size={36} className="text-[var(--color-bad)]" strokeWidth={1.5} />
      <p className="text-[var(--color-text)]">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-2 flex items-center gap-2 border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-text-soft)] transition-colors hover:border-[var(--color-accent)]/50 hover:text-[var(--color-accent)]"
      >
        <RotateCw size={15} />
        ลองใหม่อีกครั้ง
      </button>
    </div>
  )
}
