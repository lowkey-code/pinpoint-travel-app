import { useActiveTrip } from "~/features/itinerary"
import { Undo, Redo } from "lucide-react"

export function UndoRedoBar() {
  const { canUndo, canRedo, undo, redo } = useActiveTrip()

  return (
    <div className="flex items-center gap-1 border border-border rounded-lg p-1">
      <button
        onClick={undo}
        disabled={!canUndo}
        className="p-2 rounded hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        aria-label="Desfazer"
        data-testid="undo-button"
      >
        <Undo className="w-4 h-4" />
      </button>
      <button
        onClick={redo}
        disabled={!canRedo}
        className="p-2 rounded hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        aria-label="Refazer"
        data-testid="redo-button"
      >
        <Redo className="w-4 h-4" />
      </button>
    </div>
  )
}
