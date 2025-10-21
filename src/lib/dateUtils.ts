export type DateInput = Date | string | null | undefined

export function asDate(value: DateInput): Date | null {
  if (!value) return null
  const source = typeof value === "string" ? new Date(value) : value
  if (Number.isNaN(source.getTime())) return null

  const year =
    typeof value === "string"
      ? source.getUTCFullYear()
      : source.getFullYear()
  const month =
    typeof value === "string" ? source.getUTCMonth() : source.getMonth()
  const day =
    typeof value === "string" ? source.getUTCDate() : source.getDate()

  return new Date(Date.UTC(year, month, day))
}

export function toUtcMidnightIso(value: DateInput): string | null {
  const date = asDate(value)
  if (!date) return null
  const utcDate = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  )
  return utcDate.toISOString()
}
