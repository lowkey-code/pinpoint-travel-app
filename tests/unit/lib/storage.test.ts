import { describe, it, expect, beforeEach, vi, afterEach } from "vitest"
import {
  createEmptyState,
  loadState,
  saveStateImmediate,
  saveStateDebounced,
  flushPendingWrites,
  generateId,
  exportTrip,
  importTrip,
  validateExportedTrip,
  parseImportedTrip,
} from "~/features/itinerary/lib/storage"
import type { ItineraryState, Trip, ExportedTrip, ItineraryItem } from "~/features/itinerary/lib/types"
import { STORAGE_KEY, CURRENT_SCHEMA_VERSION } from "~/features/itinerary/lib/constants"

// Helper to create a minimal valid trip
function createTestTrip(overrides: Partial<Trip> = {}): Trip {
  return {
    id: "trip-1",
    name: "Test Trip",
    days: [{ index: 0, date: "2026-03-15" }],
    items: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
    archived: false,
    ...overrides,
  }
}

// Helper to create a minimal valid item
function createTestItem(overrides: Partial<ItineraryItem> = {}): ItineraryItem {
  return {
    id: "item-1",
    tripId: "trip-1",
    dayIndex: 0,
    segment: "morning",
    itemType: "activity",
    title: "Test Activity",
    status: "planned",
    priority: 0,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    ...overrides,
  }
}

describe("storage", () => {
  beforeEach(() => {
    localStorage.clear()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe("createEmptyState", () => {
    it("returns state with current schema version", () => {
      const state = createEmptyState()
      expect(state.schemaVersion).toBe(CURRENT_SCHEMA_VERSION)
    })

    it("returns state with null activeTripId", () => {
      const state = createEmptyState()
      expect(state.activeTripId).toBeNull()
    })

    it("returns state with empty trips array", () => {
      const state = createEmptyState()
      expect(state.trips).toEqual([])
    })

    it("returns state with empty undoStacks", () => {
      const state = createEmptyState()
      expect(state.undoStacks).toEqual({})
    })
  })

  describe("loadState", () => {
    it("returns empty state when localStorage is empty", () => {
      const state = loadState()
      expect(state).toEqual(createEmptyState())
    })

    it("returns empty state for invalid JSON", () => {
      localStorage.setItem(STORAGE_KEY, "not valid json")
      const state = loadState()
      expect(state).toEqual(createEmptyState())
    })

    it("returns empty state for invalid structure (missing schemaVersion)", () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ trips: [] }))
      const state = loadState()
      expect(state).toEqual(createEmptyState())
    })

    it("returns empty state for invalid structure (missing trips array)", () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ schemaVersion: 2 }))
      const state = loadState()
      expect(state).toEqual(createEmptyState())
    })

    it("returns empty state for invalid structure (trips not array)", () => {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ schemaVersion: 2, trips: "not an array" })
      )
      const state = loadState()
      expect(state).toEqual(createEmptyState())
    })

    it("loads valid state from localStorage", () => {
      const savedState: ItineraryState = {
        schemaVersion: CURRENT_SCHEMA_VERSION,
        activeTripId: "trip-1",
        trips: [createTestTrip()],
        undoStacks: {},
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedState))

      const state = loadState()
      expect(state.schemaVersion).toBe(CURRENT_SCHEMA_VERSION)
      expect(state.activeTripId).toBe("trip-1")
      expect(state.trips).toHaveLength(1)
      expect(state.trips[0].name).toBe("Test Trip")
    })

    it("migrates v1 state to v2", () => {
      const v1State = {
        schemaVersion: 1,
        activeTripId: null,
        trips: [
          {
            id: "trip-1",
            name: "Legacy Trip",
            days: [{ index: 0 }],
            items: [
              {
                id: "item-1",
                tripId: "trip-1",
                dayIndex: 0,
                segment: "morning",
                title: "Old Item",
                isDayTrip: true,
                duration: 120, // old: number in minutes
                cost: 50.5, // old: number
                address: "123 Main St", // old: address field
                hotel: "Some Hotel", // old: hotel field (removed)
                status: "planned",
                priority: 0,
                createdAt: 1000,
                updatedAt: 1000,
              },
            ],
            createdAt: 1000,
            updatedAt: 1000,
            archived: false,
          },
        ],
        undoStacks: {},
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(v1State))

      const state = loadState()

      // Should be migrated to v2
      expect(state.schemaVersion).toBe(CURRENT_SCHEMA_VERSION)

      const item = state.trips[0].items[0]
      // Old fields converted to text
      expect(item.itemType).toBe("dayTrip") // isDayTrip: true -> itemType: "dayTrip"
      expect(item.durationText).toBe("120 min")
      expect(item.costText).toBe("R$ 50.50")
      expect(item.addressText).toBe("123 Main St")
      // Old fields should be undefined
      expect((item as any).duration).toBeUndefined()
      expect((item as any).cost).toBeUndefined()
      expect((item as any).address).toBeUndefined()
      expect((item as any).hotel).toBeUndefined()
    })

    it("migrates v1 item without duration/cost", () => {
      const v1State = {
        schemaVersion: 1,
        activeTripId: null,
        trips: [
          {
            id: "trip-1",
            name: "Trip",
            days: [{ index: 0 }],
            items: [
              {
                id: "item-1",
                tripId: "trip-1",
                dayIndex: 0,
                segment: "morning",
                title: "Simple Item",
                isDayTrip: false,
                status: "planned",
                priority: 0,
                createdAt: 1000,
                updatedAt: 1000,
              },
            ],
            createdAt: 1000,
            updatedAt: 1000,
            archived: false,
          },
        ],
        undoStacks: {},
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(v1State))

      const state = loadState()
      const item = state.trips[0].items[0]

      expect(item.itemType).toBe("activity") // isDayTrip: false -> itemType: "activity"
      expect(item.durationText).toBeUndefined()
      expect(item.costText).toBeUndefined()
    })

    it("saves migrated state back to localStorage", () => {
      const v1State = {
        schemaVersion: 1,
        activeTripId: null,
        trips: [],
        undoStacks: {},
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(v1State))

      loadState()

      // Check that localStorage was updated with migrated state
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}")
      expect(saved.schemaVersion).toBe(CURRENT_SCHEMA_VERSION)
    })
  })

  describe("saveStateImmediate", () => {
    it("saves state to localStorage", () => {
      const state: ItineraryState = {
        schemaVersion: CURRENT_SCHEMA_VERSION,
        activeTripId: "trip-1",
        trips: [createTestTrip()],
        undoStacks: {},
      }

      saveStateImmediate(state)

      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}")
      expect(saved.schemaVersion).toBe(CURRENT_SCHEMA_VERSION)
      expect(saved.activeTripId).toBe("trip-1")
      expect(saved.trips).toHaveLength(1)
    })

    it("handles localStorage errors gracefully", () => {
      const originalSetItem = localStorage.setItem
      localStorage.setItem = () => {
        throw new Error("Storage full")
      }

      const state = createEmptyState()
      // Should not throw
      expect(() => saveStateImmediate(state)).not.toThrow()

      localStorage.setItem = originalSetItem
    })
  })

  describe("saveStateDebounced", () => {
    it("does not save immediately", () => {
      const state = createEmptyState()
      state.activeTripId = "debounced-trip"

      saveStateDebounced(state)

      const saved = localStorage.getItem(STORAGE_KEY)
      expect(saved).toBeNull()
    })

    it("saves after debounce timeout", () => {
      const state = createEmptyState()
      state.activeTripId = "debounced-trip"

      saveStateDebounced(state)
      vi.advanceTimersByTime(500) // STORAGE_DEBOUNCE_MS

      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}")
      expect(saved.activeTripId).toBe("debounced-trip")
    })

    it("only saves latest state when called multiple times", () => {
      const state1 = createEmptyState()
      state1.activeTripId = "trip-1"

      const state2 = createEmptyState()
      state2.activeTripId = "trip-2"

      const state3 = createEmptyState()
      state3.activeTripId = "trip-3"

      saveStateDebounced(state1)
      vi.advanceTimersByTime(100)
      saveStateDebounced(state2)
      vi.advanceTimersByTime(100)
      saveStateDebounced(state3)
      vi.advanceTimersByTime(500)

      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}")
      expect(saved.activeTripId).toBe("trip-3")
    })
  })

  describe("flushPendingWrites", () => {
    it("saves pending state immediately", () => {
      const state = createEmptyState()
      state.activeTripId = "flushed-trip"

      saveStateDebounced(state)
      flushPendingWrites()

      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}")
      expect(saved.activeTripId).toBe("flushed-trip")
    })

    it("does nothing when no pending writes", () => {
      flushPendingWrites()
      expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
    })

    it("clears pending state after flush", () => {
      const state = createEmptyState()
      state.activeTripId = "flushed-once"

      saveStateDebounced(state)
      flushPendingWrites()

      localStorage.clear()
      flushPendingWrites() // Should not save again

      expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
    })
  })

  describe("generateId", () => {
    it("generates unique IDs", () => {
      const ids = new Set<string>()
      for (let i = 0; i < 100; i++) {
        ids.add(generateId())
      }
      expect(ids.size).toBe(100)
    })

    it("generates ID with expected format", () => {
      const id = generateId()
      expect(id).toMatch(/^[a-z0-9]+-[a-z0-9]+$/)
    })

    it("generates ID containing timestamp part", () => {
      const before = Date.now()
      const id = generateId()
      const after = Date.now()

      const timestampPart = id.split("-")[0]
      const timestamp = parseInt(timestampPart, 36)

      expect(timestamp).toBeGreaterThanOrEqual(before)
      expect(timestamp).toBeLessThanOrEqual(after)
    })
  })

  describe("exportTrip", () => {
    it("creates export with version 1", () => {
      const trip = createTestTrip()
      const exported = exportTrip(trip)

      expect(exported.exportVersion).toBe(1)
    })

    it("includes timestamp", () => {
      const before = Date.now()
      const trip = createTestTrip()
      const exported = exportTrip(trip)
      const after = Date.now()

      expect(exported.exportedAt).toBeGreaterThanOrEqual(before)
      expect(exported.exportedAt).toBeLessThanOrEqual(after)
    })

    it("includes trip data", () => {
      const trip = createTestTrip({ name: "Exported Trip", description: "A trip" })
      const exported = exportTrip(trip)

      expect(exported.trip.name).toBe("Exported Trip")
      expect(exported.trip.description).toBe("A trip")
    })

    it("creates a copy of the trip", () => {
      const trip = createTestTrip()
      const exported = exportTrip(trip)

      trip.name = "Modified"
      expect(exported.trip.name).toBe("Test Trip")
    })
  })

  describe("importTrip", () => {
    it("imports trip with no collisions", () => {
      const exported: ExportedTrip = {
        exportVersion: 1,
        exportedAt: Date.now(),
        trip: createTestTrip({ id: "new-trip", name: "Imported Trip" }),
      }

      const imported = importTrip(exported, [])

      expect(imported.id).toBe("new-trip")
      expect(imported.name).toBe("Imported Trip")
    })

    it("generates new trip ID on collision", () => {
      const existingTrip = createTestTrip({ id: "trip-1" })
      const exported: ExportedTrip = {
        exportVersion: 1,
        exportedAt: Date.now(),
        trip: createTestTrip({ id: "trip-1" }),
      }

      const imported = importTrip(exported, [existingTrip])

      expect(imported.id).not.toBe("trip-1")
      expect(imported.id).toMatch(/^[a-z0-9]+-[a-z0-9]+$/)
    })

    it("generates new item IDs on collision", () => {
      const existingTrip = createTestTrip({
        items: [createTestItem({ id: "item-1" })],
      })
      const exported: ExportedTrip = {
        exportVersion: 1,
        exportedAt: Date.now(),
        trip: createTestTrip({
          items: [createTestItem({ id: "item-1" }), createTestItem({ id: "item-2" })],
        }),
      }

      const imported = importTrip(exported, [existingTrip])

      expect(imported.items[0].id).not.toBe("item-1")
      expect(imported.items[1].id).toBe("item-2") // No collision
    })

    it("updates item tripId to new trip ID", () => {
      const existingTrip = createTestTrip({ id: "trip-1" })
      const exported: ExportedTrip = {
        exportVersion: 1,
        exportedAt: Date.now(),
        trip: createTestTrip({
          id: "trip-1",
          items: [createTestItem({ id: "item-1", tripId: "trip-1" })],
        }),
      }

      const imported = importTrip(exported, [existingTrip])

      expect(imported.items[0].tripId).toBe(imported.id)
    })

    it("appends (importado) to name on collision", () => {
      const existingTrip = createTestTrip({ name: "My Trip" })
      const exported: ExportedTrip = {
        exportVersion: 1,
        exportedAt: Date.now(),
        trip: createTestTrip({ id: "new-trip", name: "My Trip" }),
      }

      const imported = importTrip(exported, [existingTrip])

      expect(imported.name).toBe("My Trip (importado)")
    })

    it("does not modify name when no collision", () => {
      const existingTrip = createTestTrip({ name: "Other Trip" })
      const exported: ExportedTrip = {
        exportVersion: 1,
        exportedAt: Date.now(),
        trip: createTestTrip({ id: "new-trip", name: "My Trip" }),
      }

      const imported = importTrip(exported, [existingTrip])

      expect(imported.name).toBe("My Trip")
    })

    it("sets archived to false", () => {
      const exported: ExportedTrip = {
        exportVersion: 1,
        exportedAt: Date.now(),
        trip: createTestTrip({ archived: true }),
      }

      const imported = importTrip(exported, [])

      expect(imported.archived).toBe(false)
    })

    it("updates updatedAt timestamp", () => {
      const oldTimestamp = Date.now() - 100000
      const exported: ExportedTrip = {
        exportVersion: 1,
        exportedAt: oldTimestamp,
        trip: createTestTrip({ updatedAt: oldTimestamp }),
      }

      const before = Date.now()
      const imported = importTrip(exported, [])
      const after = Date.now()

      expect(imported.updatedAt).toBeGreaterThanOrEqual(before)
      expect(imported.updatedAt).toBeLessThanOrEqual(after)
    })

    it("handles item ID collision within same import", () => {
      const exported: ExportedTrip = {
        exportVersion: 1,
        exportedAt: Date.now(),
        trip: createTestTrip({
          items: [
            createTestItem({ id: "same-id" }),
            createTestItem({ id: "same-id" }), // Same ID
          ],
        }),
      }

      const imported = importTrip(exported, [])

      // Both items should have different IDs
      expect(imported.items[0].id).not.toBe(imported.items[1].id)
    })
  })

  describe("validateExportedTrip", () => {
    it("returns true for valid exported trip", () => {
      const exported: ExportedTrip = {
        exportVersion: 1,
        exportedAt: Date.now(),
        trip: createTestTrip(),
      }

      expect(validateExportedTrip(exported)).toBe(true)
    })

    it("returns false for null", () => {
      expect(validateExportedTrip(null)).toBe(false)
    })

    it("returns false for non-object", () => {
      expect(validateExportedTrip("string")).toBe(false)
      expect(validateExportedTrip(123)).toBe(false)
      expect(validateExportedTrip([])).toBe(false)
    })

    it("returns false for missing exportVersion", () => {
      expect(
        validateExportedTrip({
          exportedAt: Date.now(),
          trip: createTestTrip(),
        })
      ).toBe(false)
    })

    it("returns false for non-number exportVersion", () => {
      expect(
        validateExportedTrip({
          exportVersion: "1",
          exportedAt: Date.now(),
          trip: createTestTrip(),
        })
      ).toBe(false)
    })

    it("returns false for missing exportedAt", () => {
      expect(
        validateExportedTrip({
          exportVersion: 1,
          trip: createTestTrip(),
        })
      ).toBe(false)
    })

    it("returns false for non-number exportedAt", () => {
      expect(
        validateExportedTrip({
          exportVersion: 1,
          exportedAt: "2024-01-01",
          trip: createTestTrip(),
        })
      ).toBe(false)
    })

    it("returns false for missing trip", () => {
      expect(
        validateExportedTrip({
          exportVersion: 1,
          exportedAt: Date.now(),
        })
      ).toBe(false)
    })

    it("returns false for null trip", () => {
      expect(
        validateExportedTrip({
          exportVersion: 1,
          exportedAt: Date.now(),
          trip: null,
        })
      ).toBe(false)
    })

    it("returns false for trip without id", () => {
      expect(
        validateExportedTrip({
          exportVersion: 1,
          exportedAt: Date.now(),
          trip: { name: "Trip", days: [], items: [] },
        })
      ).toBe(false)
    })

    it("returns false for trip without name", () => {
      expect(
        validateExportedTrip({
          exportVersion: 1,
          exportedAt: Date.now(),
          trip: { id: "1", days: [], items: [] },
        })
      ).toBe(false)
    })

    it("returns false for trip without days array", () => {
      expect(
        validateExportedTrip({
          exportVersion: 1,
          exportedAt: Date.now(),
          trip: { id: "1", name: "Trip", items: [] },
        })
      ).toBe(false)
    })

    it("returns false for trip without items array", () => {
      expect(
        validateExportedTrip({
          exportVersion: 1,
          exportedAt: Date.now(),
          trip: { id: "1", name: "Trip", days: [] },
        })
      ).toBe(false)
    })

    it("returns false for trip with non-array days", () => {
      expect(
        validateExportedTrip({
          exportVersion: 1,
          exportedAt: Date.now(),
          trip: { id: "1", name: "Trip", days: "not array", items: [] },
        })
      ).toBe(false)
    })

    it("returns false for trip with non-array items", () => {
      expect(
        validateExportedTrip({
          exportVersion: 1,
          exportedAt: Date.now(),
          trip: { id: "1", name: "Trip", days: [], items: "not array" },
        })
      ).toBe(false)
    })
  })

  describe("parseImportedTrip", () => {
    it("parses valid JSON export", () => {
      const exported: ExportedTrip = {
        exportVersion: 1,
        exportedAt: Date.now(),
        trip: createTestTrip(),
      }
      const json = JSON.stringify(exported)

      const result = parseImportedTrip(json)

      expect(result).not.toBeNull()
      expect(result?.trip.name).toBe("Test Trip")
    })

    it("returns null for invalid JSON", () => {
      const result = parseImportedTrip("not valid json")

      expect(result).toBeNull()
    })

    it("returns null for valid JSON but invalid format", () => {
      const result = parseImportedTrip(JSON.stringify({ foo: "bar" }))

      expect(result).toBeNull()
    })

    it("returns null for empty string", () => {
      const result = parseImportedTrip("")

      expect(result).toBeNull()
    })

    it("returns null for partial export (missing trip.items)", () => {
      const result = parseImportedTrip(
        JSON.stringify({
          exportVersion: 1,
          exportedAt: Date.now(),
          trip: { id: "1", name: "Trip", days: [] },
        })
      )

      expect(result).toBeNull()
    })
  })
})
