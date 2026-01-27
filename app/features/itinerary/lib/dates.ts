/**
 * Date utilities for timezone-safe operations
 * All dates are treated as local calendar dates (YYYY-MM-DD)
 * without timezone conversion
 */

/**
 * Parse a date string (YYYY-MM-DD) into components
 */
export function parseDateString(dateStr: string): { year: number; month: number; day: number } {
  const [year, month, day] = dateStr.split("-").map(Number)
  return { year, month, day }
}

/**
 * Create a local Date object from date string (YYYY-MM-DD)
 * This avoids timezone issues by using local timezone explicitly
 */
export function createLocalDate(dateStr: string): Date {
  const { year, month, day } = parseDateString(dateStr)
  return new Date(year, month - 1, day)
}

/**
 * Format date string (YYYY-MM-DD) to Portuguese format
 */
export function formatDatePtBR(dateStr: string, options: { short?: boolean } = {}): string {
  const { year, month, day } = parseDateString(dateStr)
  const date = new Date(year, month - 1, day)

  if (options.short) {
    // Short format: "03 de mar."
    const formatter = new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "short",
    })
    return formatter.format(date)
  }

  // Full format: "03 de março de 2026"
  const formatter = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
  return formatter.format(date)
}

/**
 * Add days to a date string (YYYY-MM-DD)
 */
export function addDays(dateStr: string, days: number): string {
  const { year, month, day } = parseDateString(dateStr)
  const date = new Date(year, month - 1, day)
  date.setDate(date.getDate() + days)

  const newYear = date.getFullYear()
  const newMonth = String(date.getMonth() + 1).padStart(2, "0")
  const newDay = String(date.getDate()).padStart(2, "0")

  return `${newYear}-${newMonth}-${newDay}`
}

/**
 * Calculate number of days between two dates (inclusive)
 * Returns number of days from startDate to endDate, including both dates
 */
export function daysBetween(startDate: string, endDate: string): number {
  const start = createLocalDate(startDate)
  const end = createLocalDate(endDate)

  const diffTime = end.getTime() - start.getTime()
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24))

  // +1 to include both start and end date
  return Math.max(1, diffDays + 1)
}

/**
 * Get current date in YYYY-MM-DD format (local timezone)
 */
export function today(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, "0")
  const day = String(now.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

/**
 * Compare two date strings (YYYY-MM-DD)
 * Returns: -1 if date1 < date2, 0 if equal, 1 if date1 > date2
 */
export function compareDates(date1: string, date2: string): number {
  const d1 = createLocalDate(date1)
  const d2 = createLocalDate(date2)
  const diff = d1.getTime() - d2.getTime()
  return diff < 0 ? -1 : diff > 0 ? 1 : 0
}

/**
 * Check if date string is valid (YYYY-MM-DD)
 */
export function isValidDate(dateStr: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false

  const { year, month, day } = parseDateString(dateStr)
  const date = new Date(year, month - 1, day)

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  )
}

/**
 * Extract date from datetime string (YYYY-MM-DDTHH:mm → YYYY-MM-DD)
 */
export function extractDate(datetime: string): string {
  return datetime.split("T")[0]
}

/**
 * Extract time from datetime string (YYYY-MM-DDTHH:mm → HH:mm)
 */
export function extractTime(datetime: string): string {
  return datetime.split("T")[1] || "00:00"
}

/**
 * Format time for display (HH:mm → HH:mm or 09:00)
 */
export function formatTime(time: string): string {
  return time
}

/**
 * Create datetime string from date and time (YYYY-MM-DD + HH:mm → YYYY-MM-DDTHH:mm)
 */
export function createDateTime(date: string, time: string): string {
  return `${date}T${time}`
}
