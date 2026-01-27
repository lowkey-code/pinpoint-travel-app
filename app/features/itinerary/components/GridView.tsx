import { useState } from "react"
import { useItinerary } from "~/features/itinerary"
import { GridDayColumn } from "./GridDayColumn"
import { Skeleton } from "~/components/ui/folio"

export function GridView() {
  const { days, isLoading } = useItinerary()
  const [reorderMode, setReorderMode] = useState(false)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Skeleton className="w-32 h-6" />
      </div>
    )
  }

  if (days.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-ink-secondary font-body">Nenhum dia criado ainda</p>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b border-paper-line bg-paper-base">
        <h2 className="text-lg font-sans font-bold">Visão Geral</h2>
        <button
          onClick={() => setReorderMode(!reorderMode)}
          className={`px-3 py-1.5 rounded-lg border text-sm transition-colors font-body ${
            reorderMode
              ? "bg-action-blue text-white border-action-blue"
              : "border-paper-line hover:bg-secondary"
          }`}
        >
          {reorderMode ? "Concluir" : "Reordenar"}
        </button>
      </div>

      {/* Grid - horizontal scroll */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <div className="flex gap-4 p-4 min-h-full">
          {days.map((day) => (
            <GridDayColumn
              key={day.index}
              day={day}
              dayIndex={day.index}
              reorderMode={reorderMode}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
