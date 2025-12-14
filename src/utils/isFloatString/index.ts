export default function isFloatString(value: string): boolean {
  if (typeof value !== 'string' || value.trim() === '') return false

  const n = Number(value)
  return Number.isFinite(n) && !Number.isInteger(n)
}
