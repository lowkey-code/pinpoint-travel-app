import { useState, useMemo } from "react"
import { useNavigate } from "react-router"
import { useItinerary, SEGMENTS, SEGMENT_LABELS, getRenderableItemsForSegment, getRenderableItemKey, getCitiesForDay } from "~/features/itinerary"
import { formatDatePtBR, getWeekdayPtBR } from "~/features/itinerary/lib/dates"
import { ItineraryCard } from "./ItineraryCard"
import { ItemDrawer } from "./ItemDrawer"
import { TripActionsMenu } from "./TripActionsMenu"
import type { Segment } from "~/features/itinerary"
import { DayViewSkeleton, GateHeader, SegmentTabs, SegmentEmptyState, AddItemButton } from "~/components/ui/folio"

interface DayViewProps {
  initialDayIndex?: number
  tripId: string
}

export function DayView({ initialDayIndex = 0, tripId }: DayViewProps) {
  const navigate = useNavigate()
  const { trip, items, days, isLoading } = useItinerary()
  const [selectedDayIndex, setSelectedDayIndex] = useState(initialDayIndex)
  const [selectedSegment, setSelectedSegment] = useState<Segment>("morning")
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Calculate stats and segment counts
  const { dayStats, segmentCounts } = useMemo(() => {
    const dayItems = items.filter(item => item.dayIndex === selectedDayIndex)
    const done = dayItems.filter(item => item.status === "done").length
    const planned = dayItems.filter(item => item.status === "planned").length

    const counts: Record<Segment, number> = {
      morning: getRenderableItemsForSegment(items, selectedDayIndex, "morning").length,
      afternoon: getRenderableItemsForSegment(items, selectedDayIndex, "afternoon").length,
      evening: getRenderableItemsForSegment(items, selectedDayIndex, "evening").length,
    }

    return {
      dayStats: { done, planned },
      segmentCounts: counts,
    }
  }, [items, selectedDayIndex])

  if (isLoading || !trip) {
    return <DayViewSkeleton />
  }

  const currentDay = days[selectedDayIndex]
  const segmentItems = getRenderableItemsForSegment(items, selectedDayIndex, selectedSegment)
  const dayCities = getCitiesForDay(items, selectedDayIndex)
  const primaryCity = dayCities[0] || trip.name

  const handleViewPrimary = (parentId: string) => {
    const primaryItem = items.find(i => i.id === parentId)
    if (primaryItem) {
      setSelectedDayIndex(primaryItem.dayIndex)
      setSelectedSegment(primaryItem.segment)
    }
  }

  // Segment data for tabs
  const segmentsData = SEGMENTS.map(seg => ({
    id: seg,
    label: SEGMENT_LABELS[seg],
    count: segmentCounts[seg],
  }))

  return (
    <div className="space-y-4 pb-24 px-4">
      {/* Gate Header */}
      <div className="stagger-item">
        <GateHeader
          dayNumber={selectedDayIndex + 1}
          cityName={primaryCity}
          weekday={currentDay?.date ? getWeekdayPtBR(currentDay.date) : ""}
          date={currentDay?.date ? formatDatePtBR(currentDay.date) : ""}
          stats={dayStats}
          onPrevDay={() => setSelectedDayIndex(Math.max(0, selectedDayIndex - 1))}
          onNextDay={() => setSelectedDayIndex(Math.min(days.length - 1, selectedDayIndex + 1))}
          onGrid={() => navigate(`/itinerary/${trip.id}/grid`)}
          hasPrev={selectedDayIndex > 0}
          hasNext={selectedDayIndex < days.length - 1}
        />
      </div>

      {/* Bookmark menu - fixed to right edge of screen */}
      <TripActionsMenu tripId={tripId} />

      {/* Segment Tabs */}
      <div className="stagger-item" style={{ animationDelay: "50ms" }}>
        <SegmentTabs
          segments={segmentsData}
          activeId={selectedSegment}
          onChange={(id) => setSelectedSegment(id)}
        />
      </div>

      {/* Items list */}
      <div className="space-y-4">
        {segmentItems.length === 0 ? (
          <div className="stagger-item" style={{ animationDelay: "100ms" }}>
            <SegmentEmptyState
              segment={selectedSegment}
              onAdd={() => setDrawerOpen(true)}
            />
          </div>
        ) : (
          <>
            {segmentItems.map((item, index) => (
              <div
                key={getRenderableItemKey(item, index)}
                className="stagger-item"
                style={{ animationDelay: `${100 + index * 50}ms` }}
              >
                <ItineraryCard
                  item={item}
                  reorderMode={false}
                  dayIndex={selectedDayIndex}
                  segment={selectedSegment}
                  isFirst={index === 0}
                  isLast={index === segmentItems.length - 1}
                  onViewPrimary={handleViewPrimary}
                />
              </div>
            ))}

            {/* Inline add button */}
            <div
              className="stagger-item"
              style={{ animationDelay: `${100 + segmentItems.length * 50}ms` }}
            >
              <AddItemButton
                onClick={() => setDrawerOpen(true)}
                label="Adicionar atividade"
                data-testid="add-item-button"
              />
            </div>
          </>
        )}
      </div>

      {/* Add/Edit drawer */}
      <ItemDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        dayIndex={selectedDayIndex}
        segment={selectedSegment}
      />
    </div>
  )
}
