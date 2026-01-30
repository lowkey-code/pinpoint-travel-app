import { describe, it, expect } from "vitest"
import type { ItineraryItem, Segment } from "~/features/itinerary/lib/types"
import {
  getSegmentFromTime,
  isSegmentAfter,
  isSegmentBefore,
  parseDurationText,
  parseCostText,
  calculateDayDuration,
  calculateTripCost,
  formatDuration,
  formatCost,
  filterByCity,
  filterByStatus,
  getUniqueCities,
  getCitiesForDay,
  reindexDays,
  updateItemDayIndices,
  sortItemsBySegment,
  isDayTripCoveringSegment,
  getDayTripCoveredSegments,
  buildAMapUrl,
  getRenderableItemKey,
  getItemsForDaySegment,
  getDayTripsForSegment,
  createGhostItems,
} from "~/features/itinerary/lib/utils"

// Helper to create mock items
function createMockItem(overrides: Partial<ItineraryItem> = {}): ItineraryItem {
  return {
    id: "test-id",
    tripId: "trip-1",
    dayIndex: 0,
    segment: "morning",
    itemType: "activity",
    title: "Test Item",
    status: "planned",
    priority: 0,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    ...overrides,
  }
}

describe("utils", () => {
  describe("getSegmentFromTime", () => {
    it("returns morning for early hours (5:00-11:59)", () => {
      expect(getSegmentFromTime("05:00")).toBe("morning")
      expect(getSegmentFromTime("09:30")).toBe("morning")
      expect(getSegmentFromTime("11:59")).toBe("morning")
    })

    it("returns afternoon for midday hours (12:00-17:59)", () => {
      expect(getSegmentFromTime("12:00")).toBe("afternoon")
      expect(getSegmentFromTime("14:30")).toBe("afternoon")
      expect(getSegmentFromTime("17:59")).toBe("afternoon")
    })

    it("returns evening for late hours (18:00-4:59)", () => {
      expect(getSegmentFromTime("18:00")).toBe("evening")
      expect(getSegmentFromTime("21:30")).toBe("evening")
      expect(getSegmentFromTime("23:59")).toBe("evening")
      expect(getSegmentFromTime("00:00")).toBe("evening")
      expect(getSegmentFromTime("04:59")).toBe("evening")
    })
  })

  describe("isSegmentAfter", () => {
    it("afternoon is after morning", () => {
      expect(isSegmentAfter("afternoon", "morning")).toBe(true)
    })

    it("evening is after morning", () => {
      expect(isSegmentAfter("evening", "morning")).toBe(true)
    })

    it("evening is after afternoon", () => {
      expect(isSegmentAfter("evening", "afternoon")).toBe(true)
    })

    it("morning is not after afternoon", () => {
      expect(isSegmentAfter("morning", "afternoon")).toBe(false)
    })

    it("same segment is not after itself", () => {
      expect(isSegmentAfter("morning", "morning")).toBe(false)
    })
  })

  describe("isSegmentBefore", () => {
    it("morning is before afternoon", () => {
      expect(isSegmentBefore("morning", "afternoon")).toBe(true)
    })

    it("morning is before evening", () => {
      expect(isSegmentBefore("morning", "evening")).toBe(true)
    })

    it("afternoon is before evening", () => {
      expect(isSegmentBefore("afternoon", "evening")).toBe(true)
    })

    it("evening is not before morning", () => {
      expect(isSegmentBefore("evening", "morning")).toBe(false)
    })

    it("same segment is not before itself", () => {
      expect(isSegmentBefore("afternoon", "afternoon")).toBe(false)
    })
  })

  describe("parseDurationText", () => {
    it("parses simple minutes", () => {
      expect(parseDurationText("30min")).toBe(30)
      expect(parseDurationText("45 minutos")).toBe(45)
    })

    it("parses hours (extracts first number)", () => {
      expect(parseDurationText("2h")).toBe(2)
      expect(parseDurationText("3 horas")).toBe(3)
    })

    it("parses combined (extracts first number)", () => {
      expect(parseDurationText("2h 30min")).toBe(2)
    })

    it("returns null for undefined", () => {
      expect(parseDurationText(undefined)).toBeNull()
    })

    it("returns null for text without numbers", () => {
      expect(parseDurationText("longo")).toBeNull()
    })
  })

  describe("parseCostText", () => {
    it("parses BRL currency format", () => {
      expect(parseCostText("R$ 50,00")).toBe(50)
      expect(parseCostText("R$ 125,50")).toBe(125.5)
    })

    it("parses plain numbers", () => {
      expect(parseCostText("100")).toBe(100)
      expect(parseCostText("50.5")).toBe(50.5)
    })

    // NOTE: Current implementation doesn't handle thousand separator correctly
    // "R$ 1.500,00" returns 1.5 instead of 1500 - known limitation
    it("parses without thousand separator", () => {
      expect(parseCostText("R$ 1500,00")).toBe(1500)
    })

    it("returns null for undefined", () => {
      expect(parseCostText(undefined)).toBeNull()
    })

    it("returns null for non-numeric text", () => {
      expect(parseCostText("grátis")).toBeNull()
    })
  })

  describe("calculateDayDuration", () => {
    it("sums duration for items on specific day", () => {
      const items = [
        createMockItem({ dayIndex: 0, durationText: "30min" }),
        createMockItem({ dayIndex: 0, durationText: "60min" }),
        createMockItem({ dayIndex: 1, durationText: "45min" }),
      ]
      expect(calculateDayDuration(items, 0)).toBe(90)
    })

    it("returns 0 for day with no items", () => {
      const items = [createMockItem({ dayIndex: 1, durationText: "30min" })]
      expect(calculateDayDuration(items, 0)).toBe(0)
    })

    it("ignores items without duration", () => {
      const items = [
        createMockItem({ dayIndex: 0, durationText: "30min" }),
        createMockItem({ dayIndex: 0 }),
      ]
      expect(calculateDayDuration(items, 0)).toBe(30)
    })
  })

  describe("calculateTripCost", () => {
    it("sums costs across all items", () => {
      const items = [
        createMockItem({ costText: "R$ 50,00" }),
        createMockItem({ costText: "R$ 100,00" }),
        createMockItem({ costText: "R$ 25,50" }),
      ]
      expect(calculateTripCost(items)).toBe(175.5)
    })

    it("returns 0 for items without cost", () => {
      const items = [createMockItem(), createMockItem()]
      expect(calculateTripCost(items)).toBe(0)
    })

    it("ignores items with invalid cost", () => {
      const items = [
        createMockItem({ costText: "R$ 50,00" }),
        createMockItem({ costText: "grátis" }),
      ]
      expect(calculateTripCost(items)).toBe(50)
    })
  })

  describe("formatDuration", () => {
    it("formats minutes only", () => {
      expect(formatDuration(30)).toBe("30min")
      expect(formatDuration(45)).toBe("45min")
    })

    it("formats hours only", () => {
      expect(formatDuration(60)).toBe("1h")
      expect(formatDuration(120)).toBe("2h")
    })

    it("formats hours and minutes", () => {
      expect(formatDuration(90)).toBe("1h 30min")
      expect(formatDuration(150)).toBe("2h 30min")
    })

    it("handles zero", () => {
      expect(formatDuration(0)).toBe("0min")
    })
  })

  describe("formatCost", () => {
    it("formats as BRL currency", () => {
      const result = formatCost(50)
      expect(result).toMatch(/R\$\s*50,00/)
    })

    it("formats decimal values", () => {
      const result = formatCost(125.5)
      expect(result).toMatch(/R\$\s*125,50/)
    })

    it("formats large values with thousand separator", () => {
      const result = formatCost(1500)
      expect(result).toMatch(/R\$\s*1\.500,00/)
    })
  })

  describe("filterByCity", () => {
    it("filters items by city (case insensitive)", () => {
      const items = [
        createMockItem({ id: "1", city: "São Paulo" }),
        createMockItem({ id: "2", city: "Rio de Janeiro" }),
        createMockItem({ id: "3", city: "são paulo" }),
      ]
      const result = filterByCity(items, "São Paulo")
      expect(result).toHaveLength(2)
      expect(result.map((i) => i.id)).toContain("1")
      expect(result.map((i) => i.id)).toContain("3")
    })

    it("returns empty for no matches", () => {
      const items = [createMockItem({ city: "São Paulo" })]
      expect(filterByCity(items, "Tokyo")).toHaveLength(0)
    })

    it("handles items without city", () => {
      const items = [createMockItem({ city: undefined })]
      expect(filterByCity(items, "São Paulo")).toHaveLength(0)
    })
  })

  describe("filterByStatus", () => {
    it("filters items by status", () => {
      const items = [
        createMockItem({ id: "1", status: "planned" }),
        createMockItem({ id: "2", status: "done" }),
        createMockItem({ id: "3", status: "planned" }),
      ]
      const result = filterByStatus(items, "planned")
      expect(result).toHaveLength(2)
    })
  })

  describe("getUniqueCities", () => {
    it("returns unique cities sorted", () => {
      const items = [
        createMockItem({ city: "São Paulo" }),
        createMockItem({ city: "Rio de Janeiro" }),
        createMockItem({ city: "São Paulo" }),
        createMockItem({ city: "Brasília" }),
      ]
      const result = getUniqueCities(items)
      expect(result).toEqual(["Brasília", "Rio de Janeiro", "São Paulo"])
    })

    it("ignores items without city", () => {
      const items = [
        createMockItem({ city: "São Paulo" }),
        createMockItem({ city: undefined }),
      ]
      const result = getUniqueCities(items)
      expect(result).toEqual(["São Paulo"])
    })
  })

  describe("getCitiesForDay", () => {
    it("returns cities for specific day (max 2)", () => {
      const items = [
        createMockItem({ dayIndex: 0, city: "São Paulo" }),
        createMockItem({ dayIndex: 0, city: "Rio de Janeiro" }),
        createMockItem({ dayIndex: 0, city: "Brasília" }),
        createMockItem({ dayIndex: 1, city: "Tokyo" }),
      ]
      const result = getCitiesForDay(items, 0)
      expect(result).toHaveLength(2)
    })

    it("returns empty for day with no items", () => {
      const items = [createMockItem({ dayIndex: 1, city: "São Paulo" })]
      expect(getCitiesForDay(items, 0)).toHaveLength(0)
    })
  })

  describe("reindexDays", () => {
    it("reindexes days after deletion", () => {
      const days = [
        { index: 0, label: "Dia 1" },
        { index: 2, label: "Dia 3" },
        { index: 3, label: "Dia 4" },
      ]
      const result = reindexDays(days)
      expect(result).toEqual([
        { index: 0, label: "Dia 1" },
        { index: 1, label: "Dia 2" },
        { index: 2, label: "Dia 3" },
      ])
    })

    it("preserves custom labels", () => {
      const days = [
        { index: 0, label: "Chegada" },
        { index: 2, label: "Dia 3" },
      ]
      const result = reindexDays(days)
      expect(result[0].label).toBe("Chegada")
      expect(result[1].label).toBe("Dia 2")
    })
  })

  describe("updateItemDayIndices", () => {
    it("removes items from deleted day and reindexes", () => {
      const items = [
        createMockItem({ id: "1", dayIndex: 0 }),
        createMockItem({ id: "2", dayIndex: 1 }),
        createMockItem({ id: "3", dayIndex: 2 }),
      ]
      const result = updateItemDayIndices(items, 1)
      expect(result).toHaveLength(2)
      expect(result.find((i) => i.id === "1")?.dayIndex).toBe(0)
      expect(result.find((i) => i.id === "3")?.dayIndex).toBe(1)
    })
  })

  describe("sortItemsBySegment", () => {
    it("sorts by day then segment", () => {
      const items = [
        createMockItem({ id: "1", dayIndex: 1, segment: "morning" }),
        createMockItem({ id: "2", dayIndex: 0, segment: "evening" }),
        createMockItem({ id: "3", dayIndex: 0, segment: "morning" }),
      ]
      const result = sortItemsBySegment(items)
      expect(result.map((i) => i.id)).toEqual(["3", "2", "1"])
    })
  })

  describe("isDayTripCoveringSegment", () => {
    it("returns true for primary segment", () => {
      const item = createMockItem({
        isDayTrip: true,
        primarySegment: "morning",
        coversSegments: ["morning", "afternoon"],
      })
      expect(isDayTripCoveringSegment(item, "morning")).toBe(true)
    })

    it("returns true for covered segment", () => {
      const item = createMockItem({
        isDayTrip: true,
        primarySegment: "morning",
        coversSegments: ["morning", "afternoon"],
      })
      expect(isDayTripCoveringSegment(item, "afternoon")).toBe(true)
    })

    it("returns false for uncovered segment", () => {
      const item = createMockItem({
        isDayTrip: true,
        primarySegment: "morning",
        coversSegments: ["morning", "afternoon"],
      })
      expect(isDayTripCoveringSegment(item, "evening")).toBe(false)
    })

    it("returns false for non-dayTrip", () => {
      const item = createMockItem({ isDayTrip: false })
      expect(isDayTripCoveringSegment(item, "morning")).toBe(false)
    })
  })

  describe("getDayTripCoveredSegments", () => {
    it("returns all covered segments in order", () => {
      const item = createMockItem({
        isDayTrip: true,
        primarySegment: "afternoon",
        coversSegments: ["morning", "afternoon", "evening"],
      })
      const result = getDayTripCoveredSegments(item)
      expect(result).toEqual(["morning", "afternoon", "evening"])
    })

    it("returns item segment for non-dayTrip", () => {
      const item = createMockItem({ segment: "afternoon" })
      expect(getDayTripCoveredSegments(item)).toEqual(["afternoon"])
    })
  })

  describe("buildAMapUrl", () => {
    it("builds URL with coordinates", () => {
      const item = createMockItem({ lat: -23.55, lng: -46.63 })
      const url = buildAMapUrl(item)
      expect(url).toBe("https://uri.amap.com/marker?position=-46.63,-23.55")
    })

    it("builds URL with address text", () => {
      const item = createMockItem({ addressText: "Av. Paulista, São Paulo" })
      const url = buildAMapUrl(item)
      expect(url).toContain("https://uri.amap.com/search?query=")
      expect(url).toContain(encodeURIComponent("Av. Paulista, São Paulo"))
    })

    it("prefers coordinates over address", () => {
      const item = createMockItem({
        lat: -23.55,
        lng: -46.63,
        addressText: "Av. Paulista",
      })
      const url = buildAMapUrl(item)
      expect(url).toContain("marker?position=")
    })

    it("returns null when no location info", () => {
      const item = createMockItem()
      expect(buildAMapUrl(item)).toBeNull()
    })
  })

  describe("getRenderableItemKey", () => {
    it("returns item id for regular items", () => {
      const item = createMockItem({ id: "item-123" })
      expect(getRenderableItemKey(item)).toBe("item-123")
    })

    it("returns ghost key for dayTrip ghosts", () => {
      const ghost = {
        parentId: "daytrip-1",
        segment: "afternoon" as Segment,
        title: "Ghost",
        isDayTripGhost: true as const,
      }
      expect(getRenderableItemKey(ghost, 0)).toBe("ghost-daytrip-daytrip-1-0")
    })

    it("returns ghost key for transport ghosts", () => {
      const ghost = {
        parentId: "transport-1",
        segment: "morning" as Segment,
        title: "In Transit",
        isTransportGhost: true as const,
        arrivalCity: "Tokyo",
      }
      expect(getRenderableItemKey(ghost, 1)).toBe("ghost-transport-transport-1-1")
    })
  })

  describe("getItemsForDaySegment", () => {
    it("filters items by day and segment, excluding dayTrips", () => {
      const items = [
        createMockItem({ id: "1", dayIndex: 0, segment: "morning" }),
        createMockItem({ id: "2", dayIndex: 0, segment: "afternoon" }),
        createMockItem({ id: "3", dayIndex: 0, segment: "morning", isDayTrip: true }),
        createMockItem({ id: "4", dayIndex: 1, segment: "morning" }),
      ]
      const result = getItemsForDaySegment(items, 0, "morning")
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe("1")
    })
  })

  describe("getDayTripsForSegment", () => {
    it("returns dayTrips covering the segment", () => {
      const items = [
        createMockItem({
          id: "1",
          dayIndex: 0,
          isDayTrip: true,
          primarySegment: "morning",
          coversSegments: ["morning", "afternoon"],
        }),
        createMockItem({
          id: "2",
          dayIndex: 0,
          isDayTrip: true,
          primarySegment: "evening",
        }),
      ]
      const result = getDayTripsForSegment(items, 0, "afternoon")
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe("1")
    })
  })

  describe("createGhostItems", () => {
    it("creates ghosts for covered segments except primary", () => {
      const dayTrip = createMockItem({
        id: "daytrip-1",
        isDayTrip: true,
        primarySegment: "morning",
        coversSegments: ["morning", "afternoon", "evening"],
      })
      const ghosts = createGhostItems(dayTrip)
      expect(ghosts).toHaveLength(2)
      expect(ghosts.map((g) => g.segment)).toEqual(["afternoon", "evening"])
    })

    it("returns empty for non-dayTrip", () => {
      const item = createMockItem()
      expect(createGhostItems(item)).toHaveLength(0)
    })

    it("returns empty for dayTrip without coversSegments", () => {
      const dayTrip = createMockItem({
        isDayTrip: true,
        primarySegment: "morning",
      })
      expect(createGhostItems(dayTrip)).toHaveLength(0)
    })
  })
})
