// Fixed segments
export type Segment = "morning" | "afternoon" | "evening"

// Item status and priority
export type ItemStatus = "planned" | "done" | "skipped"
export type ItemPriority = 0 | 1 | 2

// Itinerary item
export interface ItineraryItem {
  id: string
  tripId: string
  dayIndex: number
  segment: Segment
  title: string
  icon?: string
  timeLabel?: string
  duration?: number
  cost?: number
  currency?: string
  city?: string
  hotel?: string
  address?: string
  notes?: string
  status: ItemStatus
  priority: ItemPriority
  isDayTrip?: boolean
  primarySegment?: Segment
  coversSegments?: Segment[]
  createdAt: number
  updatedAt: number
}

// Day
export interface Day {
  index: number
  date?: string
  label?: string
}

// Trip
export interface Trip {
  id: string
  name: string
  description?: string
  startDate?: string
  endDate?: string
  days: Day[]
  items: ItineraryItem[]
  createdAt: number
  updatedAt: number
  archived: boolean
}

// Undo actions
export type UndoAction =
  | { type: "ADD_ITEM"; item: ItineraryItem }
  | { type: "UPDATE_ITEM"; before: ItineraryItem; after: ItineraryItem }
  | { type: "DELETE_ITEM"; item: ItineraryItem }
  | { type: "MOVE_ITEM"; itemId: string; fromDay: number; fromSegment: Segment; toDay: number; toSegment: Segment }
  | { type: "ADD_DAY"; day: Day }
  | { type: "DELETE_DAY"; dayIndex: number; items: ItineraryItem[] }
  | { type: "UPDATE_TRIP"; before: Partial<Trip>; after: Partial<Trip> }

// Undo stack
export interface UndoStack {
  past: UndoAction[]
  future: UndoAction[]
}

// Root state
export interface ItineraryState {
  schemaVersion: number
  activeTripId: string | null
  trips: Trip[]
  undoStacks: Record<string, UndoStack>
}

// Ghost item for dayTrip covered segments
export interface GhostItem {
  parentId: string
  segment: Segment
  title: string
  isDayTripGhost: true
}

// Renderable item (real or ghost)
export type RenderableItem = ItineraryItem | GhostItem

// Type guard
export function isGhostItem(item: RenderableItem): item is GhostItem {
  return "isDayTripGhost" in item && item.isDayTripGhost === true
}

// Export format
export interface ExportedTrip {
  exportVersion: number
  exportedAt: number
  trip: Trip
}
