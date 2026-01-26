import { useState } from "react"
import { useActiveTrip, SEGMENTS, SEGMENT_LABELS, getRenderableItemsForSegment } from "~/features/itinerary"
import { ItineraryCard } from "./ItineraryCard"
import { Plus, ChevronLeft, ChevronRight } from "lucide-react"

interface DayViewProps {
  tripId: string
}

export function DayView({ tripId }: DayViewProps) {
  const { trip, items, days, addItem } = useActiveTrip()
  const [selectedDayIndex, setSelectedDayIndex] = useState(0)
  const [selectedSegment, setSelectedSegment] = useState<"morning" | "afternoon" | "evening">("morning")

  if (!trip || trip.id !== tripId) {
    return <p className="text-muted-foreground">Carregando viagem...</p>
  }

  const currentDay = days[selectedDayIndex]

  return (
    <div className="space-y-6">
      {/* Day selector */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setSelectedDayIndex(Math.max(0, selectedDayIndex - 1))}
          disabled={selectedDayIndex === 0}
          className="p-2 rounded-lg hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Dia anterior"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="text-center">
          <h2 className="text-2xl font-serif font-bold">
            {currentDay?.label || `Dia ${selectedDayIndex + 1}`}
          </h2>
          {currentDay?.date && (
            <p className="text-sm text-muted-foreground">{currentDay.date}</p>
          )}
        </div>

        <button
          onClick={() => setSelectedDayIndex(Math.min(days.length - 1, selectedDayIndex + 1))}
          disabled={selectedDayIndex === days.length - 1}
          className="p-2 rounded-lg hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Próximo dia"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Segment tabs */}
      <div className="flex gap-2 border-b border-border">
        {SEGMENTS.map((segment) => (
          <button
            key={segment}
            onClick={() => setSelectedSegment(segment)}
            className={`px-4 py-2 font-medium transition-colors ${
              selectedSegment === segment
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
            data-testid={`segment-tab-${segment}`}
          >
            {SEGMENT_LABELS[segment]}
          </button>
        ))}
      </div>

      {/* Items for current segment */}
      <div className="space-y-3">
        {getRenderableItemsForSegment(items, selectedDayIndex, selectedSegment).map((item) => (
          <ItineraryCard key={"isDayTripGhost" in item ? item.parentId : item.id} item={item} />
        ))}

        {/* Add item button */}
        <button
          onClick={() => {
            const title = prompt("Título do item:")
            if (title) {
              addItem(selectedDayIndex, selectedSegment, { title })
            }
          }}
          className="w-full p-4 border-2 border-dashed border-border rounded-xl hover:border-primary hover:bg-secondary/50 transition-colors flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground"
          data-testid="add-item-button"
        >
          <Plus className="w-5 h-5" />
          Adicionar Item
        </button>
      </div>
    </div>
  )
}
