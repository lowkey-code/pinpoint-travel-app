import { useState } from "react"
import type { Segment } from "~/features/itinerary"
import { useActiveTrip, getRenderableItemsForSegment, SEGMENT_LABELS } from "~/features/itinerary"
import { Plus } from "lucide-react"
import { ItineraryCard } from "./ItineraryCard"
import { ItemDrawer } from "./ItemDrawer"

interface GridSegmentSectionProps {
  dayIndex: number
  segment: Segment
  reorderMode: boolean
}

export function GridSegmentSection({ dayIndex, segment, reorderMode }: GridSegmentSectionProps) {
  const { items, days } = useActiveTrip()
  const [drawerOpen, setDrawerOpen] = useState(false)

  const renderableItems = getRenderableItemsForSegment(items, dayIndex, segment)
  const regularItems = renderableItems.filter((item) => !("isDayTripGhost" in item))

  return (
    <div className="bg-card border border-border rounded-lg p-3">
      {/* Segment header */}
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-muted-foreground">
          {SEGMENT_LABELS[segment]}
        </h4>
        {!reorderMode && (
          <button
            onClick={() => setDrawerOpen(true)}
            className="p-1 hover:bg-secondary rounded transition-colors"
            aria-label={`Adicionar item em ${SEGMENT_LABELS[segment]}`}
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Items */}
      <div className="space-y-2">
        {renderableItems.length === 0 ? (
          <p className="text-xs text-muted-foreground italic text-center py-4">
            Nenhum item
          </p>
        ) : (
          renderableItems.map((item, index) => (
            <ItineraryCard
              key={"isDayTripGhost" in item ? `ghost-${item.parentId}-${segment}` : item.id}
              item={item}
              reorderMode={reorderMode}
              dayIndex={dayIndex}
              segment={segment}
              isFirst={index === 0}
              isLast={index === renderableItems.length - 1}
              compact={true}
            />
          ))
        )}
      </div>

      {/* Add drawer */}
      <ItemDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        dayIndex={dayIndex}
        segment={segment}
      />
    </div>
  )
}
