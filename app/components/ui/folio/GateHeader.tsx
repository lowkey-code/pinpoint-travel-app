import { cn } from "~/lib/utils"
import { CaretLeft, CaretRight, CalendarBlank, SquaresFour, CheckCircle, Clock } from "@phosphor-icons/react"

interface GateHeaderProps {
  dayNumber: number
  cityName: string
  weekday: string
  date: string
  stats: { done: number; planned: number }
  onPrevDay?: () => void
  onNextDay?: () => void
  onCalendar?: () => void
  onGrid?: () => void
  hasPrev?: boolean
  hasNext?: boolean
  className?: string
}

export function GateHeader({
  dayNumber,
  cityName,
  weekday,
  date,
  stats,
  onPrevDay,
  onNextDay,
  onCalendar,
  onGrid,
  hasPrev = true,
  hasNext = true,
  className,
}: GateHeaderProps) {
  return (
    <div
      className={cn(
        "bg-paper-card rounded-2xl border border-paper-line overflow-hidden shadow-sm paper-texture",
        className
      )}
    >
      {/* Navigation bar */}
      <div className="flex items-center justify-between px-1 py-1 bg-paper-base/50 border-b border-paper-line">
        <button
          onClick={onPrevDay}
          disabled={!hasPrev}
          className="touch-target hover:bg-paper-line rounded-lg btn-press focus-ring disabled:opacity-30"
          aria-label="Dia anterior"
        >
          <CaretLeft weight="bold" className="text-ink-utility" />
        </button>

        <div className="flex items-center gap-1">
          {onCalendar && (
            <button
              onClick={onCalendar}
              className="px-3 py-2 hover:bg-paper-line rounded-lg font-mono text-xs text-ink-utility btn-press focus-ring flex items-center gap-1.5"
            >
              <CalendarBlank weight="bold" />
              <span className="hidden sm:inline">Calendário</span>
            </button>
          )}
          {onGrid && (
            <button
              onClick={onGrid}
              className="px-3 py-2 hover:bg-paper-line rounded-lg font-mono text-xs text-ink-utility btn-press focus-ring flex items-center gap-1.5"
            >
              <SquaresFour weight="bold" />
              <span className="hidden sm:inline">Grade</span>
            </button>
          )}
        </div>

        <button
          onClick={onNextDay}
          disabled={!hasNext}
          className="touch-target hover:bg-paper-line rounded-lg btn-press focus-ring disabled:opacity-30"
          aria-label="Próximo dia"
        >
          <CaretRight weight="bold" className="text-ink-utility" />
        </button>
      </div>

      {/* Main display */}
      <div className="p-4 text-center">
        <div className="inline-flex items-center gap-4">
          {/* Day number */}
          <div className="relative" data-testid="current-day-label">
            <span className="font-mono text-6xl font-bold text-action-blue leading-none tabular-nums">
              {String(dayNumber).padStart(2, "0")}
            </span>
            <span className="absolute -top-1 -right-2 font-mono text-[9px] bg-action-blue text-white px-1.5 py-0.5 rounded">
              DIA
            </span>
          </div>

          {/* Vertical divider */}
          <div className="w-px h-16 bg-paper-line" />

          {/* Day info */}
          <div className="text-left">
            <h2 className="font-sans font-bold text-2xl text-ink-primary">
              {cityName}
            </h2>
            <p className="font-mono text-xs text-ink-utility uppercase tracking-wider">
              {weekday}
            </p>
            <p className="font-mono text-sm text-ink-secondary tabular-nums">
              {date}
            </p>
          </div>
        </div>

        {/* Mini progress */}
        <div className="mt-4 flex items-center justify-center gap-6 text-xs font-mono">
          <span className="text-stamp-sage flex items-center gap-1">
            <CheckCircle weight="fill" />
            <span className="tabular-nums">{stats.done}</span> feitos
          </span>
          <span className="text-stamp-navy flex items-center gap-1">
            <Clock weight="fill" />
            <span className="tabular-nums">{stats.planned}</span> planejados
          </span>
        </div>
      </div>
    </div>
  )
}
