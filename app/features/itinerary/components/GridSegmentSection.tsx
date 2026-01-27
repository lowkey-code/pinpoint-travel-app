import { useState } from "react"
import type { Segment } from "~/features/itinerary"
import { useItinerary, getRenderableItemsForSegment, getRenderableItemKey, SEGMENT_LABELS } from "~/features/itinerary"
import { Plus } from "@phosphor-icons/react"
import { ItineraryCard } from "./ItineraryCard"
import { ItemDrawer } from "./ItemDrawer"

interface GridSegmentSectionProps {
  dayIndex: number
  segment: Segment
  reorderMode: boolean
}

export function GridSegmentSection({ dayIndex, segment, reorderMode }: GridSegmentSectionProps) {
  const { items } = useItinerary()
  const [drawerOpen, setDrawerOpen] = useState(false)

  const renderableItems = getRenderableItemsForSegment(items, dayIndex, segment)

  return (
    <div className="bg-paper-card border border-paper-line rounded-lg p-3">
      {/* Segment header */}
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-ink-secondary font-body">
          {SEGMENT_LABELS[segment]}
        </h4>
        {!reorderMode && (
          <button
            onClick={() => setDrawerOpen(true)}
            className="p-1 hover:bg-secondary rounded transition-colors"
            aria-label={`Adicionar item em ${SEGMENT_LABELS[segment]}`}
          >
            <Plus className="w-4 h-4" weight="bold" />
          </button>
        )}
      </div>

      {/* Items */}
      <div className="space-y-2">
        {renderableItems.length === 0 ? (
          <p className="text-xs text-ink-utility italic text-center py-4 font-body">
            Nenhum item
          </p>
        ) : (
          renderableItems.map((item, index) => (
            <ItineraryCard
              key={getRenderableItemKey(item, index)}
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
