import { cn } from "~/lib/utils"
import { Clock, MapPin, ArrowRight } from "@phosphor-icons/react"

interface NextActivityCardProps {
  icon: React.ReactNode
  title: string
  location?: string
  timeLabel: string
  durationText?: string
  onClick?: () => void
  className?: string
}

export function NextActivityCard({
  icon,
  title,
  location,
  timeLabel,
  durationText,
  onClick,
  className,
}: NextActivityCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full bg-paper-card border border-paper-line rounded-xl p-4 text-left card-interactive focus-ring",
        className
      )}
    >
      <div className="flex items-center gap-2 mb-3">
        <Clock weight="bold" className="w-4 h-4 text-action-blue" />
        <span className="font-mono text-xs text-action-blue font-medium tracking-wide">
          {timeLabel}
        </span>
      </div>

      <div className="flex items-start gap-3">
        <span className="text-2xl shrink-0">{icon}</span>
        <div className="flex-1 min-w-0">
          <h4 className="font-sans font-bold text-lg text-ink-primary truncate">
            {title}
          </h4>
          {location && (
            <p className="flex items-center gap-1 text-sm text-ink-secondary mt-0.5">
              <MapPin weight="bold" className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{location}</span>
            </p>
          )}
          {durationText && (
            <p className="font-mono text-xs text-ink-utility mt-1">
              {durationText}
            </p>
          )}
        </div>
        <ArrowRight
          weight="bold"
          className="w-5 h-5 text-ink-utility shrink-0 self-center"
        />
      </div>
    </button>
  )
}
