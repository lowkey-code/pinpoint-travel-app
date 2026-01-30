import { describe, it, expect } from "vitest"
import {
  parseDateString,
  createLocalDate,
  getWeekdayPtBR,
  formatDatePtBR,
  addDays,
  daysBetween,
  today,
  compareDates,
  isValidDate,
  extractDate,
  extractTime,
  createDateTime,
} from "~/features/itinerary/lib/dates"

describe("dates", () => {
  describe("parseDateString", () => {
    it("parses valid date string", () => {
      expect(parseDateString("2026-03-15")).toEqual({
        year: 2026,
        month: 3,
        day: 15,
      })
    })

    it("parses date at year boundary", () => {
      expect(parseDateString("2025-12-31")).toEqual({
        year: 2025,
        month: 12,
        day: 31,
      })
    })

    it("parses date at start of year", () => {
      expect(parseDateString("2026-01-01")).toEqual({
        year: 2026,
        month: 1,
        day: 1,
      })
    })
  })

  describe("createLocalDate", () => {
    it("creates date object from string", () => {
      const date = createLocalDate("2026-03-15")
      expect(date.getFullYear()).toBe(2026)
      expect(date.getMonth()).toBe(2) // 0-indexed
      expect(date.getDate()).toBe(15)
    })

    it("handles leap year date", () => {
      const date = createLocalDate("2024-02-29")
      expect(date.getFullYear()).toBe(2024)
      expect(date.getMonth()).toBe(1)
      expect(date.getDate()).toBe(29)
    })
  })

  describe("getWeekdayPtBR", () => {
    it("returns capitalized weekday in Portuguese", () => {
      // 2026-03-15 is a Sunday
      const weekday = getWeekdayPtBR("2026-03-15")
      expect(weekday).toBe("Domingo")
    })

    it("returns Monday correctly", () => {
      // 2026-03-16 is a Monday
      const weekday = getWeekdayPtBR("2026-03-16")
      expect(weekday).toBe("Segunda-feira")
    })

    it("returns Saturday correctly", () => {
      // 2026-03-14 is a Saturday
      const weekday = getWeekdayPtBR("2026-03-14")
      expect(weekday).toBe("Sábado")
    })
  })

  describe("formatDatePtBR", () => {
    it("formats date in full Portuguese format", () => {
      const formatted = formatDatePtBR("2026-03-15")
      expect(formatted).toMatch(/15.*março.*2026/)
    })

    it("formats date in short format", () => {
      const formatted = formatDatePtBR("2026-03-15", { short: true })
      expect(formatted).toMatch(/15.*mar/)
    })

    it("handles single digit day", () => {
      const formatted = formatDatePtBR("2026-03-05", { short: true })
      expect(formatted).toMatch(/05.*mar/)
    })
  })

  describe("addDays", () => {
    it("adds positive days", () => {
      expect(addDays("2026-03-15", 5)).toBe("2026-03-20")
    })

    it("subtracts days with negative value", () => {
      expect(addDays("2026-03-15", -5)).toBe("2026-03-10")
    })

    it("handles month boundary", () => {
      expect(addDays("2026-03-30", 5)).toBe("2026-04-04")
    })

    it("handles year boundary", () => {
      expect(addDays("2026-12-30", 5)).toBe("2027-01-04")
    })

    it("handles leap year February", () => {
      expect(addDays("2024-02-28", 1)).toBe("2024-02-29")
      expect(addDays("2024-02-28", 2)).toBe("2024-03-01")
    })

    it("handles non-leap year February", () => {
      expect(addDays("2025-02-28", 1)).toBe("2025-03-01")
    })

    it("returns same date when adding 0", () => {
      expect(addDays("2026-03-15", 0)).toBe("2026-03-15")
    })
  })

  describe("daysBetween", () => {
    it("returns 1 for same date", () => {
      expect(daysBetween("2026-03-15", "2026-03-15")).toBe(1)
    })

    it("returns 2 for consecutive dates", () => {
      expect(daysBetween("2026-03-15", "2026-03-16")).toBe(2)
    })

    it("calculates days across month boundary", () => {
      expect(daysBetween("2026-03-30", "2026-04-02")).toBe(4)
    })

    it("calculates days across year boundary", () => {
      expect(daysBetween("2026-12-30", "2027-01-02")).toBe(4)
    })

    it("calculates full week", () => {
      expect(daysBetween("2026-03-15", "2026-03-21")).toBe(7)
    })

    it("handles reversed dates (returns at least 1)", () => {
      expect(daysBetween("2026-03-20", "2026-03-15")).toBe(1)
    })
  })

  describe("today", () => {
    it("returns date in YYYY-MM-DD format", () => {
      const result = today()
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    })

    it("matches current date", () => {
      const result = today()
      const now = new Date()
      const expected = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`
      expect(result).toBe(expected)
    })
  })

  describe("compareDates", () => {
    it("returns -1 when first date is earlier", () => {
      expect(compareDates("2026-03-15", "2026-03-20")).toBe(-1)
    })

    it("returns 1 when first date is later", () => {
      expect(compareDates("2026-03-20", "2026-03-15")).toBe(1)
    })

    it("returns 0 for same dates", () => {
      expect(compareDates("2026-03-15", "2026-03-15")).toBe(0)
    })

    it("compares across year boundary", () => {
      expect(compareDates("2025-12-31", "2026-01-01")).toBe(-1)
    })
  })

  describe("isValidDate", () => {
    it("returns true for valid date", () => {
      expect(isValidDate("2026-03-15")).toBe(true)
    })

    it("returns true for leap year date", () => {
      expect(isValidDate("2024-02-29")).toBe(true)
    })

    it("returns false for invalid leap year date", () => {
      expect(isValidDate("2025-02-29")).toBe(false)
    })

    it("returns false for invalid month", () => {
      expect(isValidDate("2026-13-15")).toBe(false)
    })

    it("returns false for invalid day", () => {
      expect(isValidDate("2026-03-32")).toBe(false)
    })

    it("returns false for wrong format", () => {
      expect(isValidDate("15-03-2026")).toBe(false)
      expect(isValidDate("2026/03/15")).toBe(false)
      expect(isValidDate("03-15-2026")).toBe(false)
    })

    it("returns false for incomplete date", () => {
      expect(isValidDate("2026-03")).toBe(false)
      expect(isValidDate("2026")).toBe(false)
    })

    it("returns false for invalid April date", () => {
      expect(isValidDate("2026-04-31")).toBe(false)
    })
  })

  describe("extractDate", () => {
    it("extracts date from datetime string", () => {
      expect(extractDate("2026-03-15T14:30")).toBe("2026-03-15")
    })

    it("handles date-only string", () => {
      expect(extractDate("2026-03-15")).toBe("2026-03-15")
    })
  })

  describe("extractTime", () => {
    it("extracts time from datetime string", () => {
      expect(extractTime("2026-03-15T14:30")).toBe("14:30")
    })

    it("returns 00:00 for date-only string", () => {
      expect(extractTime("2026-03-15")).toBe("00:00")
    })
  })

  describe("createDateTime", () => {
    it("combines date and time", () => {
      expect(createDateTime("2026-03-15", "14:30")).toBe("2026-03-15T14:30")
    })

    it("handles midnight", () => {
      expect(createDateTime("2026-03-15", "00:00")).toBe("2026-03-15T00:00")
    })
  })
})
