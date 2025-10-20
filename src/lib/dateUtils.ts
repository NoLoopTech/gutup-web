export type DateInput = Date | string | null | undefined

export function asDate(value: DateInput): Date | null {
  if (!value) return null
  const date = typeof value === "string" ? new Date(value) : value
  return Number.isNaN(date.getTime()) ? null : date
}

export function toUtcMidnightIso(value: DateInput): string | null {
  const date = asDate(value)
  if (!date) return null
  const utcDate = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  )
  return utcDate.toISOString()
}
