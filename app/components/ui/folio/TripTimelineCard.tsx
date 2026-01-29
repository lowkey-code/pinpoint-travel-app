import { cn } from "~/lib/utils"
import { CaretRight, Check } from "@phosphor-icons/react"

type TimelinePosition = "first" | "middle" | "last" | "only"
type TripState = "active" | "completed" | "archived"

interface TripTimelineCardProps {
  emoji: string
  title: string
  dateRange: string
  duration: string
  progress?: { current: number; total: number }
  statusLabel?: string
  state?: TripState
  position?: TimelinePosition
  onClick?: () => void
  className?: string
}

export function TripTimelineCard({
  emoji,
  title,
  dateRange,
  duration,
  progress,
  statusLabel,
  state = "active",
  position = "middle",
  onClick,
  className,
}: TripTimelineCardProps) {
  const isArchived = state === "archived"
  const isCompleted = state === "completed"
  const showLine = position !== "only"
  const isLast = position === "last" || position === "only"

  const progressPercent = progress && progress.total > 0
    ? Math.round((progress.current / progress.total) * 100)
    : 0

  return (
    <div className={cn("flex gap-3", className)}>
      {/* Timeline connector */}
      <div className="flex flex-col items-center w-6 shrink-0">
        {/* Top line */}
        {(position === "middle" || position === "last") && (
          <div
            className={cn(
              "w-0.5 h-3 -mt-3",
              isArchived ? "bg-paper-line" : "bg-action-blue/30"
            )}
          />
        )}

        {/* Dot */}
        <div
          className={cn(
            "w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0",
            isArchived || isCompleted
              ? "border-stamp-sage bg-stamp-sage/10"
              : "border-action-blue bg-action-blue/10"
          )}
        >
          {(isArchived || isCompleted) && (
            <Check weight="bold" className="w-2.5 h-2.5 text-stamp-sage" />
          )}
        </div>

        {/* Bottom line */}
        {showLine && !isLast && (
          <div
            className={cn(
              "w-0.5 flex-1 min-h-[2rem]",
              isArchived ? "bg-paper-line" : "bg-action-blue/30"
            )}
          />
        )}
      </div>

      {/* Card content */}
      <button
        onClick={onClick}
        className={cn(
          "flex-1 bg-paper-card border border-paper-line rounded-xl p-3 text-left card-interactive focus-ring mb-3",
          isArchived && "opacity-60"
        )}
      >
        <div className="flex items-start gap-3">
          {/* Emoji */}
          <span className="text-2xl shrink-0">{emoji}</span>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h4 className="font-sans font-bold text-ink-primary truncate">
              {title}
            </h4>
            <p className="font-mono text-xs text-ink-utility mt-0.5">
              {dateRange} · {duration}
            </p>

            {/* Progress bar or status */}
            {progress && progress.total > 0 && !isArchived ? (
              <div className="mt-2">
                <div className="h-1.5 bg-paper-line rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      progressPercent === 100 ? "bg-stamp-sage" : "bg-action-blue"
                    )}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <p className="font-mono text-[10px] text-ink-utility mt-1 tabular-nums">
                  {progress.current}/{progress.total} itens · {progressPercent}%
                </p>
              </div>
            ) : statusLabel ? (
              <p className="font-mono text-[10px] text-ink-utility mt-1.5 uppercase tracking-wider">
                {statusLabel}
              </p>
            ) : null}
          </div>

          {/* Arrow */}
          <CaretRight
            weight="bold"
            className="w-5 h-5 text-ink-utility shrink-0 self-center"
          />
        </div>
      </button>
    </div>
  )
}
