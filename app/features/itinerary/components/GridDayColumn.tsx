import { useNavigate } from "react-router"
import type { Day } from "~/features/itinerary"
import { SEGMENTS, getCitiesForDay, useItinerary } from "~/features/itinerary"
import { formatDatePtBR } from "~/features/itinerary/lib/dates"
import { GridSegmentSection } from "./GridSegmentSection"
import { ArrowsOutSimple } from "@phosphor-icons/react"

interface GridDayColumnProps {
  day: Day
  dayIndex: number
  tripId: string
  reorderMode: boolean
}

export function GridDayColumn({ day, dayIndex, tripId, reorderMode }: GridDayColumnProps) {
  const navigate = useNavigate()
  const { items } = useItinerary()
  const dayCities = getCitiesForDay(items, dayIndex)

  const handleExpandDay = () => {
    navigate(`/itinerary/${tripId}?day=${dayIndex}`)
  }

  return (
    <div className="flex-shrink-0 w-80 flex flex-col gap-3">
      {/* Day header */}
      <button
        onClick={handleExpandDay}
        className="bg-paper-card border border-paper-line rounded-lg p-3 sticky top-0 z-10 text-left group hover:border-action-blue transition-colors card-interactive"
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-sans font-bold text-base">
              {day.label || `Dia ${dayIndex + 1}`}
              {dayCities.length > 0 && (
                <span className="text-ink-secondary font-body font-normal text-sm"> - {dayCities.join(", ")}</span>
              )}
            </h3>
            {day.date && (
              <p className="text-xs text-ink-utility mt-1 font-mono tabular-nums">
                {formatDatePtBR(day.date, { short: true })}
              </p>
            )}
          </div>
          <ArrowsOutSimple
            weight="bold"
            className="w-4 h-4 text-ink-utility opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-0.5"
          />
        </div>
      </button>

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
