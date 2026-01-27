import type { Day } from "~/features/itinerary"
import { SEGMENTS } from "~/features/itinerary"
import { formatDatePtBR } from "~/features/itinerary/lib/dates"
import { GridSegmentSection } from "./GridSegmentSection"

interface GridDayColumnProps {
  day: Day
  dayIndex: number
  reorderMode: boolean
}

export function GridDayColumn({ day, dayIndex, reorderMode }: GridDayColumnProps) {
  return (
    <div className="flex-shrink-0 w-80 flex flex-col gap-3">
      {/* Day header */}
      <div className="bg-card border border-border rounded-lg p-3 sticky top-0 z-10">
        <h3 className="font-serif font-bold text-base">
          {day.label || `Dia ${dayIndex + 1}`}
        </h3>
        {day.date && (
          <p className="text-xs text-muted-foreground mt-1">
            {formatDatePtBR(day.date, { short: true })}
          </p>
        )}
      </div>

      {/* Segments */}
      <div className="flex flex-col gap-3">
        {SEGMENTS.map((segment) => (
          <GridSegmentSection
            key={segment}
            dayIndex={dayIndex}
            segment={segment}
            reorderMode={reorderMode}
          />
        ))}
      </div>
    </div>
  )
}
