// Utility function that converts a duration in milliseconds to a human-readable
// string format of minutes and seconds, handling edge cases like zero or
// negative values.

export default function formatMsToMinSec(ms: number): string {
  if (!ms || ms <= 0) return '0s';

  const totalSeconds = Math.floor(ms / 1000);
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;

  if (mins > 0) return `${mins}m ${secs}s`;
  return `${secs}s`;
}
