import { cn } from "~/lib/utils"
import { CaretRight } from "@phosphor-icons/react"
import { StampBadge } from "./StampBadge"

interface TicketStubProps {
  emoji: string
  dateLabel: string
  title: string
  meta: string
  completed?: boolean
  onClick?: () => void
  className?: string
}

export function TicketStub({
  emoji,
  dateLabel,
  title,
  meta,
  completed,
  onClick,
  className,
}: TicketStubProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full bg-paper-card rounded-xl border border-paper-line overflow-hidden flex card-interactive focus-ring text-left",
        completed && "opacity-70",
        className
      )}
    >
      {/* Stub left side */}
      <div
        className={cn(
          "w-20 p-3 flex flex-col items-center justify-center border-r border-dashed border-paper-line shrink-0 relative",
          completed ? "bg-stamp-sage/10" : "bg-stamp-amber/10"
        )}
      >
        <span className="text-2xl mb-1">{emoji}</span>
        <span className="font-mono text-[9px] text-ink-utility text-center uppercase">
          {dateLabel}
        </span>

        {/* Completed stamp */}
        {completed && (
          <div className="absolute inset-0 flex items-center justify-center">
            <StampBadge
              variant="sage"
              rotated
              size="sm"
              className="bg-paper-card/90 stamp-animated"
            >
              CONCLUÍDA
            </StampBadge>
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 p-3 flex items-center justify-between min-w-0">
        <div className="min-w-0">
          <h4 className="font-sans font-bold text-ink-primary truncate">
            {title}
          </h4>
          <p className="font-mono text-xs text-ink-utility tabular-nums">
            {meta}
          </p>
        </div>
        <CaretRight
          weight="bold"
          className="text-ink-utility shrink-0 ml-2 transition-transform duration-150 group-hover:translate-x-1"
        />
      </div>
    </button>
  )
}
