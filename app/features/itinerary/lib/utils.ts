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
import { daysBetween, addDays as addDaysToDate } from "./dates"

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

// Get multi-day transports that arrive on a specific day
export function getArrivingTransports(
  items: ItineraryItem[],
  dayIndex: number
): ItineraryItem[] {
  return items.filter(
    (item) =>
      item.itemType === "transport" &&
      item.isMultiDayTransport &&
      item.arrivalDayIndex === dayIndex
  )
}

// Get multi-day transports that depart on a specific day
export function getDepartingTransports(
  items: ItineraryItem[],
  dayIndex: number
): ItineraryItem[] {
  return items.filter(
    (item) =>
      item.itemType === "transport" &&
      item.isMultiDayTransport &&
      item.dayIndex === dayIndex
  )
}

// Determine segment from time string (HH:mm)
export function getSegmentFromTime(time: string): Segment {
  const hour = parseInt(time.split(":")[0])
  if (hour >= 5 && hour < 12) return "morning"
  if (hour >= 12 && hour < 18) return "afternoon"
  return "evening"
}

// Check if segment is after another segment
export function isSegmentAfter(segment: Segment, afterSegment: Segment): boolean {
  const order: Segment[] = ["morning", "afternoon", "evening"]
  return order.indexOf(segment) > order.indexOf(afterSegment)
}

// Check if segment is before another segment
export function isSegmentBefore(segment: Segment, beforeSegment: Segment): boolean {
  const order: Segment[] = ["morning", "afternoon", "evening"]
  return order.indexOf(segment) < order.indexOf(beforeSegment)
}

// Create ghost item for transport in transit
export function createTransportGhost(transport: ItineraryItem, segment: Segment): GhostItem {
  return {
    parentId: transport.id,
    segment,
    title: transport.title,
    isTransportGhost: true,
    arrivalCity: transport.destinationCity,
  }
}

// Get renderable items for a segment (items + ghosts)
export function getRenderableItemsForSegment(
  items: ItineraryItem[],
  dayIndex: number,
  segment: Segment
): RenderableItem[] {
  const regularItems = getItemsForDaySegment(items, dayIndex, segment)
  const dayTrips = getDayTripsForSegment(items, dayIndex, segment)
  const arrivingTransports = getArrivingTransports(items, dayIndex)
  const departingTransports = getDepartingTransports(items, dayIndex)
  const result: RenderableItem[] = [...regularItems]

  // Add dayTrip items or ghosts
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

  // Add transport ghosts for departing transports (from departure segment onwards)
  for (const transport of departingTransports) {
    if (transport.departureDateTime) {
      const departureTime = transport.departureDateTime.split("T")[1]
      const departureSegment = getSegmentFromTime(departureTime)

      // Show ghost if current segment is departure segment or after
      // But NOT on the segment where the transport card itself is shown
      if ((segment === departureSegment || isSegmentAfter(segment, departureSegment))
          && transport.segment !== segment) {
        result.push(createTransportGhost(transport, segment))
      }
    }
  }

  // Add transport ghosts for arriving transports (before arrival segment)
  for (const transport of arrivingTransports) {
    if (transport.arrivalDateTime) {
      const arrivalTime = transport.arrivalDateTime.split("T")[1]
      const arrivalSegment = getSegmentFromTime(arrivalTime)

      // Show ghost if current segment is before or equal to arrival segment
      if (segment === arrivalSegment || isSegmentBefore(segment, arrivalSegment)) {
        result.push(createTransportGhost(transport, segment))
      }
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

// Parse duration text to minutes (for calculations)
export function parseDurationText(text: string | undefined): number | null {
  if (!text) return null
  const match = text.match(/(\d+)/)
  return match ? parseInt(match[1]) : null
}

// Parse cost text to number (for calculations)
export function parseCostText(text: string | undefined): number | null {
  if (!text) return null
  const cleaned = text.replace(/[^\d.,]/g, "").replace(",", ".")
  const num = parseFloat(cleaned)
  return isNaN(num) ? null : num
}

// Calculate day duration (minutes)
export function calculateDayDuration(items: ItineraryItem[], dayIndex: number): number {
  return items
    .filter((item) => item.dayIndex === dayIndex && item.durationText)
    .reduce((sum, item) => sum + (parseDurationText(item.durationText) ?? 0), 0)
}

// Calculate trip cost
export function calculateTripCost(items: ItineraryItem[]): number {
  return items
    .filter((item) => item.costText)
    .reduce((sum, item) => sum + (parseCostText(item.costText) ?? 0), 0)
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
    itemType: "activity",
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

  // Calculate days based on date range
  let days: Day[]
  if (partial?.startDate && partial?.endDate) {
    const numDays = daysBetween(partial.startDate, partial.endDate)
    days = Array.from({ length: numDays }, (_, i) =>
      createDay(i, addDaysToDate(partial.startDate!, i))
    )
  } else {
    days = [createDay(0, partial?.startDate)]
  }

  return {
    id: generateId(),
    name,
    days,
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

// Build AMap URL (prefer coordinates, fallback to address text)
export function buildAMapUrl(item: ItineraryItem): string | null {
  if (item.lat !== undefined && item.lng !== undefined) {
    return `https://uri.amap.com/marker?position=${item.lng},${item.lat}`
  }
  if (item.addressText) {
    return `https://uri.amap.com/search?query=${encodeURIComponent(item.addressText)}`
  }
  return null
}

// Get unique key for renderable item (for React keys)
export function getRenderableItemKey(item: RenderableItem, index?: number): string {
  if ("isDayTripGhost" in item && item.isDayTripGhost === true) {
    return `ghost-daytrip-${item.parentId}-${index ?? 0}`
  }
  if ("isTransportGhost" in item && item.isTransportGhost === true) {
    return `ghost-transport-${item.parentId}-${index ?? 0}`
  }
  // At this point, TypeScript knows item is ItineraryItem
  return (item as ItineraryItem).id
}

// Copy to clipboard with fallback
export async function copyToClipboard(text: string): Promise<boolean> {
  // Modern API
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch (err) {
      console.warn("Clipboard API failed, trying fallback", err)
    }
  }

  // Fallback for older browsers
  try {
    const textarea = document.createElement("textarea")
    textarea.value = text
    textarea.style.position = "fixed"
    textarea.style.opacity = "0"
    document.body.appendChild(textarea)
    textarea.select()
    const success = document.execCommand("copy")
    document.body.removeChild(textarea)
    return success
  } catch (err) {
    console.error("Copy fallback failed", err)
    return false
  }
}
