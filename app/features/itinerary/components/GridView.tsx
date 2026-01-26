import { useActiveTrip, SEGMENTS, SEGMENT_LABELS, getRenderableItemsForSegment } from "~/features/itinerary"
import { ItineraryCard } from "./ItineraryCard"
import { Plus } from "lucide-react"

interface GridViewProps {
  tripId: string
}

export function GridView({ tripId }: GridViewProps) {
  const { trip, items, days, addItem } = useActiveTrip()

  if (!trip || trip.id !== tripId) {
    return <p className="text-muted-foreground">Carregando viagem...</p>
  }

  return (
    <div className="overflow-x-auto">
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${days.length}, minmax(280px, 1fr))` }}>
        {days.map((day) => (
          <div key={day.index} className="space-y-4">
            {/* Day header */}
            <div className="sticky top-0 bg-background p-3 border-b-2 border-primary rounded-t-lg">
              <h3 className="font-serif font-bold text-center">
                {day.label || `Dia ${day.index + 1}`}
              </h3>
              {day.date && (
                <p className="text-xs text-muted-foreground text-center">{day.date}</p>
              )}
            </div>

            {/* Segments for this day */}
            <div className="space-y-6">
              {SEGMENTS.map((segment) => {
                const segmentItems = getRenderableItemsForSegment(items, day.index, segment)
                return (
                  <div key={segment} className="bg-card border border-border rounded-lg p-3">
                    <h4 className="text-sm font-semibold mb-2 text-muted-foreground">
                      {SEGMENT_LABELS[segment]}
                    </h4>
                    <div className="space-y-2">
                      {segmentItems.map((item) => (
                        <ItineraryCard
                          key={"isDayTripGhost" in item ? item.parentId : item.id}
                          item={item}
                          compact
                        />
                      ))}
                      <button
                        onClick={() => {
                          const title = prompt("Título do item:")
                          if (title) {
                            addItem(day.index, segment, { title })
                          }
                        }}
                        className="w-full p-2 border border-dashed border-border rounded-lg hover:border-primary hover:bg-secondary/50 transition-colors flex items-center justify-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                        data-testid={`add-item-grid-${day.index}-${segment}`}
                      >
                        <Plus className="w-3 h-3" />
                        Adicionar
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
