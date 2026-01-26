import type {
  ItineraryItem,
  Segment,
  Trip,
  Day,
  RenderableItem,
  GhostItem,
  ItemStatus,
} from "./types"
import { SEGMENTS, DAY_LABEL_PREFIX } from "./constants"
import { generateId } from "./storage"

// Get items for a day segment (excluding dayTrips)
export function getItemsForDaySegment(
  items: ItineraryItem[],
  dayIndex: number,
  segment: Segment
): ItineraryItem[] {
  return items.filter(
    (item) => item.dayIndex === dayIndex && item.segment === segment && !item.isDayTrip
  )
}

// Get dayTrips that cover a segment
export function getDayTripsForSegment(
  items: ItineraryItem[],
  dayIndex: number,
  segment: Segment
): ItineraryItem[] {
  return items.filter(
    (item) =>
      item.dayIndex === dayIndex &&
      item.isDayTrip &&
      (item.primarySegment === segment || item.coversSegments?.includes(segment))
  )
}

// Create ghost items for dayTrip covered segments
export function createGhostItems(dayTrip: ItineraryItem): GhostItem[] {
  if (!dayTrip.isDayTrip || !dayTrip.coversSegments) return []
  return dayTrip.coversSegments
    .filter((seg) => seg !== dayTrip.primarySegment)
    .map((segment) => ({
      parentId: dayTrip.id,
      segment,
      title: dayTrip.title,
      isDayTripGhost: true as const,
    }))
}

// Get renderable items for a segment (items + ghosts)
export function getRenderableItemsForSegment(
  items: ItineraryItem[],
  dayIndex: number,
  segment: Segment
): RenderableItem[] {
  const regularItems = getItemsForDaySegment(items, dayIndex, segment)
  const dayTrips = getDayTripsForSegment(items, dayIndex, segment)
  const result: RenderableItem[] = [...regularItems]

  for (const dayTrip of dayTrips) {
    if (dayTrip.primarySegment === segment) {
      result.push(dayTrip)
    } else {
      result.push({
        parentId: dayTrip.id,
        segment,
        title: dayTrip.title,
        isDayTripGhost: true,
      })
    }
  }
  return result
}

// Filter by city
export function filterByCity(items: ItineraryItem[], city: string): ItineraryItem[] {
  const normalized = city.toLowerCase().trim()
  return items.filter((item) => item.city?.toLowerCase().trim() === normalized)
}

// Filter by status
export function filterByStatus(items: ItineraryItem[], status: ItemStatus): ItineraryItem[] {
  return items.filter((item) => item.status === status)
}

// Get unique cities
export function getUniqueCities(items: ItineraryItem[]): string[] {
  const cities = new Set<string>()
  for (const item of items) {
    if (item.city) cities.add(item.city)
  }
  return Array.from(cities).sort()
}

// Calculate day duration (minutes)
export function calculateDayDuration(items: ItineraryItem[], dayIndex: number): number {
  return items
    .filter((item) => item.dayIndex === dayIndex && item.duration)
    .reduce((sum, item) => sum + (item.duration ?? 0), 0)
}

// Calculate trip cost
export function calculateTripCost(items: ItineraryItem[]): number {
  return items.filter((item) => item.cost).reduce((sum, item) => sum + (item.cost ?? 0), 0)
}

// Format duration
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}min`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`
}

// Format cost
export function formatCost(cost: number, currency = "BRL"): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency }).format(cost)
}

// Create item
export function createItem(
  tripId: string,
  dayIndex: number,
  segment: Segment,
  partial?: Partial<ItineraryItem>
): ItineraryItem {
  const now = Date.now()
  return {
    id: generateId(),
    tripId,
    dayIndex,
    segment,
    title: "",
    status: "planned",
    priority: 0,
    createdAt: now,
    updatedAt: now,
    ...partial,
  }
}

// Create day
export function createDay(index: number, date?: string): Day {
  return {
    index,
    date,
    label: `${DAY_LABEL_PREFIX} ${index + 1}`,
  }
}

// Create trip
export function createTrip(name: string, partial?: Partial<Trip>): Trip {
  const now = Date.now()
  return {
    id: generateId(),
    name,
    days: [createDay(0)],
    items: [],
    createdAt: now,
    updatedAt: now,
    archived: false,
    ...partial,
  }
}

// Reindex days after deletion
export function reindexDays(days: Day[]): Day[] {
  return days.map((day, index) => ({
    ...day,
    index,
    label: day.label?.startsWith(DAY_LABEL_PREFIX)
      ? `${DAY_LABEL_PREFIX} ${index + 1}`
      : day.label,
  }))
}

// Update item day indices after day deletion
export function updateItemDayIndices(items: ItineraryItem[], deletedDayIndex: number): ItineraryItem[] {
  return items
    .filter((item) => item.dayIndex !== deletedDayIndex)
    .map((item) => ({
      ...item,
      dayIndex: item.dayIndex > deletedDayIndex ? item.dayIndex - 1 : item.dayIndex,
      updatedAt: Date.now(),
    }))
}

// Sort items by segment order
export function sortItemsBySegment(items: ItineraryItem[]): ItineraryItem[] {
  const segmentOrder = Object.fromEntries(SEGMENTS.map((seg, idx) => [seg, idx]))
  return [...items].sort((a, b) => {
    if (a.dayIndex !== b.dayIndex) return a.dayIndex - b.dayIndex
    return segmentOrder[a.segment] - segmentOrder[b.segment]
  })
}

// Check if dayTrip covers segment
export function isDayTripCoveringSegment(item: ItineraryItem, segment: Segment): boolean {
  if (!item.isDayTrip) return false
  return item.primarySegment === segment || (item.coversSegments?.includes(segment) ?? false)
}

// Get all segments covered by dayTrip
export function getDayTripCoveredSegments(item: ItineraryItem): Segment[] {
  if (!item.isDayTrip) return [item.segment]
  const segments = new Set<Segment>()
  if (item.primarySegment) segments.add(item.primarySegment)
  if (item.coversSegments) {
    for (const seg of item.coversSegments) segments.add(seg)
  }
  return SEGMENTS.filter((seg) => segments.has(seg))
}
