import type { ItineraryItem, Segment } from "~/features/itinerary"
import { useItinerary } from "~/features/itinerary"
import { CaretUp, CaretDown, ArrowUp, ArrowDown } from "@phosphor-icons/react"

interface ReorderControlsProps {
  item: ItineraryItem
  dayIndex: number
  segment: Segment
  isFirst: boolean
  isLast: boolean
}

export function ReorderControls({ item, dayIndex, segment, isFirst, isLast }: ReorderControlsProps) {
  const { updateItem, moveItem, days } = useItinerary()

  const handleMoveUp = () => {
    const now = Date.now()
    updateItem(item.id, { updatedAt: now + 1 })
  }

  const handleMoveDown = () => {
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
      <button
        onClick={handleMoveUp}
        disabled={isFirst}
        className="p-2 hover:bg-secondary rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Mover para cima"
        data-testid={`move-up-${item.id}`}
      >
        <CaretUp className="w-4 h-4" weight="bold" />
      </button>

      <button
        onClick={handleMoveDown}
        disabled={isLast}
        className="p-2 hover:bg-secondary rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Mover para baixo"
        data-testid={`move-down-${item.id}`}
      >
        <CaretDown className="w-4 h-4" weight="bold" />
      </button>

      <div className="border-t border-paper-line my-1" />

      <button
        onClick={handleMoveToPrevDay}
        disabled={dayIndex === 0}
        className="p-2 hover:bg-secondary rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Mover para dia anterior"
        data-testid={`move-prev-day-${item.id}`}
      >
        <ArrowUp className="w-4 h-4" weight="bold" />
      </button>

      <button
        onClick={handleMoveToNextDay}
        disabled={dayIndex === days.length - 1}
        className="p-2 hover:bg-secondary rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Mover para próximo dia"
        data-testid={`move-next-day-${item.id}`}
      >
        <ArrowDown className="w-4 h-4" weight="bold" />
      </button>
    </div>
  )
}
