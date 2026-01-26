import type { ItineraryItem, Segment } from "~/features/itinerary"
import { useActiveTrip } from "~/features/itinerary"
import { ChevronUp, ChevronDown, ArrowUp, ArrowDown } from "lucide-react"

interface ReorderControlsProps {
  item: ItineraryItem
  dayIndex: number
  segment: Segment
  isFirst: boolean
  isLast: boolean
}

export function ReorderControls({ item, dayIndex, segment, isFirst, isLast }: ReorderControlsProps) {
  const { updateItem, moveItem, days } = useActiveTrip()

  const handleMoveUp = () => {
    // Swap with previous item by updating timestamps
    const now = Date.now()
    updateItem(item.id, { updatedAt: now + 1 })
  }

  const handleMoveDown = () => {
    // Swap with next item by updating timestamps
    const now = Date.now()
    updateItem(item.id, { updatedAt: now - 1 })
  }

  const handleMoveToPrevDay = () => {
    if (dayIndex > 0) {
      moveItem(item.id, dayIndex - 1, segment)
    }
  }

  const handleMoveToNextDay = () => {
    if (dayIndex < days.length - 1) {
      moveItem(item.id, dayIndex + 1, segment)
    }
  }

  return (
    <div className="flex flex-col gap-1">
      {/* Move up within segment */}
      <button
        onClick={handleMoveUp}
        disabled={isFirst}
        className="p-2 hover:bg-secondary rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Mover para cima"
        data-testid={`move-up-${item.id}`}
      >
        <ChevronUp className="w-4 h-4" />
      </button>

      {/* Move down within segment */}
      <button
        onClick={handleMoveDown}
        disabled={isLast}
        className="p-2 hover:bg-secondary rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Mover para baixo"
        data-testid={`move-down-${item.id}`}
      >
        <ChevronDown className="w-4 h-4" />
      </button>

      <div className="border-t border-border my-1" />

      {/* Move to previous day */}
      <button
        onClick={handleMoveToPrevDay}
        disabled={dayIndex === 0}
        className="p-2 hover:bg-secondary rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Mover para dia anterior"
        data-testid={`move-prev-day-${item.id}`}
      >
        <ArrowUp className="w-4 h-4" />
      </button>

      {/* Move to next day */}
      <button
        onClick={handleMoveToNextDay}
        disabled={dayIndex === days.length - 1}
        className="p-2 hover:bg-secondary rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Mover para próximo dia"
        data-testid={`move-next-day-${item.id}`}
      >
        <ArrowDown className="w-4 h-4" />
      </button>
    </div>
  )
}
