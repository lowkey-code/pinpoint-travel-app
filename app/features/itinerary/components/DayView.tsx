import { useState } from "react"
import { useItinerary, SEGMENTS, SEGMENT_LABELS, getRenderableItemsForSegment, getRenderableItemKey, getCitiesForDay } from "~/features/itinerary"
import { formatDatePtBR } from "~/features/itinerary/lib/dates"
import { ItineraryCard } from "./ItineraryCard"
import { ItemDrawer } from "./ItemDrawer"
import { Plus, CaretLeft, CaretRight, ArrowsDownUp } from "@phosphor-icons/react"
import type { Segment } from "~/features/itinerary"
import { DayViewSkeleton } from "~/components/ui/folio"

export function DayView() {
  const { trip, items, days, isLoading } = useItinerary()
  const [selectedDayIndex, setSelectedDayIndex] = useState(0)
  const [selectedSegment, setSelectedSegment] = useState<Segment>("morning")
  const [reorderMode, setReorderMode] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  if (isLoading || !trip) {
    return <DayViewSkeleton />
  }

  const currentDay = days[selectedDayIndex]
  const segmentItems = getRenderableItemsForSegment(items, selectedDayIndex, selectedSegment)
  const dayCities = getCitiesForDay(items, selectedDayIndex)

  return (
    <div className="space-y-4 pb-24 safe-bottom">
      {/* Day selector */}
      <div className="flex items-center justify-between sticky top-0 bg-paper-base z-10 py-2 safe-top">
        <button
          onClick={() => setSelectedDayIndex(Math.max(0, selectedDayIndex - 1))}
          disabled={selectedDayIndex === 0}
          className="p-3 rounded-lg hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed tap-target"
          aria-label="Dia anterior"
          data-testid="prev-day-button"
        >
          <CaretLeft className="w-5 h-5" weight="bold" />
        </button>

        <div className="text-center flex-1" data-testid="current-day-header">
          <h2 className="text-xl font-sans font-bold" data-testid="current-day-label">
            {currentDay?.label || `Dia ${selectedDayIndex + 1}`}
            {dayCities.length > 0 && (
              <span className="text-ink-secondary font-body font-normal"> - {dayCities.join(", ")}</span>
            )}
          </h2>
          {currentDay?.date && (
            <p className="text-xs text-ink-utility font-mono tabular-nums">{formatDatePtBR(currentDay.date)}</p>
          )}
        </div>

        <button
          onClick={() => setReorderMode(!reorderMode)}
          className={`p-3 rounded-lg tap-target transition-colors ${
            reorderMode ? "bg-action-blue text-white" : "hover:bg-secondary"
          }`}
          aria-label="Modo reordenar"
          data-testid="reorder-mode-toggle"
        >
          <ArrowsDownUp className="w-5 h-5" weight="bold" />
        </button>

        <button
          onClick={() => setSelectedDayIndex(Math.min(days.length - 1, selectedDayIndex + 1))}
          disabled={selectedDayIndex === days.length - 1}
          className="p-3 rounded-lg hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed tap-target"
          aria-label="Próximo dia"
          data-testid="next-day-button"
        >
          <CaretRight className="w-5 h-5" weight="bold" />
        </button>
      </div>

      {/* Segment tabs */}
      <div className="flex gap-2 border-b border-paper-line sticky top-16 bg-paper-base z-10">
        {SEGMENTS.map((segment) => (
          <button
            key={segment}
            onClick={() => setSelectedSegment(segment)}
            className={`flex-1 px-4 py-3 font-body font-medium transition-colors tap-target ${
              selectedSegment === segment
                ? "border-b-2 border-action-blue text-action-blue"
                : "text-ink-secondary hover:text-ink-primary"
            }`}
            data-testid={`segment-tab-${segment}`}
          >
            {SEGMENT_LABELS[segment]}
          </button>
        ))}
      </div>

      {/* Items list */}
      <div className="space-y-4 px-2">
        {segmentItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-ink-secondary text-sm font-body">Nenhum item neste período</p>
          </div>
        ) : (
          segmentItems.map((item, index) => (
            <ItineraryCard
              key={getRenderableItemKey(item, index)}
              item={item}
              reorderMode={reorderMode}
              dayIndex={selectedDayIndex}
              segment={selectedSegment}
              isFirst={index === 0}
              isLast={index === segmentItems.length - 1}
            />
          ))
        )}
      </div>

      {/* Floating add button */}
      <button
        onClick={() => setDrawerOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-action-blue text-white rounded-full shadow-lg hover:bg-action-hover transition-colors flex items-center justify-center tap-target z-20"
        style={{ bottom: "calc(1.5rem + var(--safe-bottom, 0px))" }}
        aria-label="Adicionar item"
        data-testid="add-item-button"
      >
        <Plus className="w-6 h-6" weight="bold" />
      </button>

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
