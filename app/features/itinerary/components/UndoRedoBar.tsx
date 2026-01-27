import { useItinerary } from "~/features/itinerary"
import { ArrowCounterClockwise, ArrowClockwise } from "@phosphor-icons/react"

export function UndoRedoBar() {
  const { canUndo, canRedo, undo, redo } = useItinerary()

  return (
    <div className="flex items-center gap-1 border border-paper-line rounded-lg p-1">
      <button
        onClick={undo}
        disabled={!canUndo}
        className="p-2 rounded hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        aria-label="Desfazer"
        data-testid="undo-button"
      >
        <ArrowCounterClockwise className="w-4 h-4" weight="bold" />
      </button>
      <button
        onClick={redo}
        disabled={!canRedo}
        className="p-2 rounded hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        aria-label="Refazer"
        data-testid="redo-button"
      >
        <ArrowClockwise className="w-4 h-4" weight="bold" />
      </button>
    </div>
  )
}
