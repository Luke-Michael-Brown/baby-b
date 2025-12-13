export default function formatMsToMinSec(ms: number): string {
  if (!ms || ms <= 0) return '0s'

  const totalSeconds = Math.floor(ms / 1000)
  const mins = Math.floor(totalSeconds / 60)
  const secs = totalSeconds % 60

  if (mins > 0) return `${mins}m ${secs}s`
  return `${secs}s`
}
