import type { ItineraryState, Trip, ExportedTrip } from "./types"
import { STORAGE_KEY, CURRENT_SCHEMA_VERSION, STORAGE_DEBOUNCE_MS } from "./constants"

// Empty state factory
export function createEmptyState(): ItineraryState {
  return {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    activeTripId: null,
    trips: [],
    undoStacks: {},
  }
}

// Safe JSON parse
function safeParse<T>(json: string | null, fallback: T): T {
  if (!json) return fallback
  try {
    return JSON.parse(json) as T
  } catch {
    // Invalid JSON, return fallback
    return fallback
  }
}

// Migration registry
type Migration = (state: ItineraryState) => ItineraryState

const migrations: Record<number, Migration> = {
  // v1 -> v2: duration/cost/address -> text fields, add itemType, remove hotel
  1: (state) => ({
    ...state,
    schemaVersion: 2,
    trips: state.trips.map((trip) => ({
      ...trip,
      items: trip.items.map((item: any) => ({
        ...item,
        itemType: item.isDayTrip ? "dayTrip" : "activity",
        durationText: item.duration ? `${item.duration} min` : undefined,
        costText: item.cost ? `R$ ${item.cost.toFixed(2)}` : undefined,
        addressText: item.address,
        duration: undefined,
        cost: undefined,
        address: undefined,
        hotel: undefined,
      })),
    })),
  }),
}

// Apply migrations
function migrate(state: ItineraryState): ItineraryState {
  let current = state
  while (current.schemaVersion < CURRENT_SCHEMA_VERSION) {
    const migration = migrations[current.schemaVersion]
    if (!migration) {
      // No migration available, skip to current version
      current = { ...current, schemaVersion: CURRENT_SCHEMA_VERSION }
      break
    }
    current = migration(current)
  }
  return current
}

// Load state from localStorage
export function loadState(): ItineraryState {
  if (typeof window === "undefined") return createEmptyState()

  const raw = localStorage.getItem(STORAGE_KEY)
  const parsed = safeParse<ItineraryState | null>(raw, null)

  if (!parsed) return createEmptyState()

  // Validate structure
  if (typeof parsed.schemaVersion !== "number" || !Array.isArray(parsed.trips)) {
    // Invalid state structure, reset to empty
    return createEmptyState()
  }

  // Migrate if needed
  if (parsed.schemaVersion < CURRENT_SCHEMA_VERSION) {
    const migrated = migrate(parsed)
    saveStateImmediate(migrated)
    return migrated
  }

  return parsed
}

// Immediate save
export function saveStateImmediate(state: ItineraryState): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Failed to save to localStorage (e.g., quota exceeded)
    // Silently fail - data remains in memory
  }
}

// Debounced save
let debounceTimer: ReturnType<typeof setTimeout> | null = null
let pendingState: ItineraryState | null = null

export function saveStateDebounced(state: ItineraryState): void {
  pendingState = state
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    if (pendingState) {
      saveStateImmediate(pendingState)
      pendingState = null
    }
    debounceTimer = null
  }, STORAGE_DEBOUNCE_MS)
}

// Flush pending writes
export function flushPendingWrites(): void {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
    debounceTimer = null
  }
  if (pendingState) {
    saveStateImmediate(pendingState)
    pendingState = null
  }
}

// Generate unique ID
export function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`
}

// Export trip to JSON
export function exportTrip(trip: Trip): ExportedTrip {
  return {
    exportVersion: 1,
    exportedAt: Date.now(),
    trip: { ...trip },
  }
}

// Import trip with ID collision resolution
export function importTrip(exported: ExportedTrip, existingTrips: Trip[]): Trip {
  const existingIds = new Set(existingTrips.map((t) => t.id))
  const existingItemIds = new Set(existingTrips.flatMap((t) => t.items.map((i) => i.id)))

  // New trip ID if collision
  let newTripId = exported.trip.id
  if (existingIds.has(newTripId)) {
    newTripId = generateId()
  }

  // Map old item IDs to new ones
  const itemIdMap = new Map<string, string>()
  const newItems = exported.trip.items.map((item) => {
    let newItemId = item.id
    if (existingItemIds.has(newItemId) || itemIdMap.has(newItemId)) {
      newItemId = generateId()
    }
    itemIdMap.set(item.id, newItemId)
    return { ...item, id: newItemId, tripId: newTripId }
  })

  return {
    ...exported.trip,
    id: newTripId,
    items: newItems,
    name: existingTrips.some((t) => t.name === exported.trip.name)
      ? `${exported.trip.name} (importado)`
      : exported.trip.name,
    archived: false,
    updatedAt: Date.now(),
  }
}

// Validate exported trip
export function validateExportedTrip(data: unknown): data is ExportedTrip {
  if (typeof data !== "object" || data === null) return false
  const obj = data as Record<string, unknown>
  if (typeof obj.exportVersion !== "number") return false
  if (typeof obj.exportedAt !== "number") return false
  if (typeof obj.trip !== "object" || obj.trip === null) return false
  const trip = obj.trip as Record<string, unknown>
  if (typeof trip.id !== "string") return false
  if (typeof trip.name !== "string") return false
  if (!Array.isArray(trip.days)) return false
  if (!Array.isArray(trip.items)) return false
  return true
}

// Parse imported JSON
export function parseImportedTrip(json: string): ExportedTrip | null {
  try {
    const data = JSON.parse(json)
    if (validateExportedTrip(data)) return data
    return null
  } catch {
    return null
  }
}
