import { cn } from "~/lib/utils"
import { SunHorizon, Sun, MoonStars } from "@phosphor-icons/react"
import type { Segment } from "~/features/itinerary/lib/types"

interface SegmentTabsProps {
  segments: Array<{
    id: Segment
    label: string
    count: number
  }>
  activeId: Segment
  onChange: (id: Segment) => void
  className?: string
}

const segmentIcons: Record<Segment, React.ReactNode> = {
  morning: <SunHorizon weight="fill" className="text-xl" />,
  afternoon: <Sun weight="fill" className="text-xl" />,
  evening: <MoonStars weight="fill" className="text-xl" />,
}

export function SegmentTabs({
  segments,
  activeId,
  onChange,
  className,
}: SegmentTabsProps) {
  return (
    <div className={cn("grid grid-cols-3 gap-2", className)}>
      {segments.map((segment) => {
        const isActive = segment.id === activeId

        return (
          <button
            key={segment.id}
            onClick={() => onChange(segment.id)}
            data-testid={`segment-tab-${segment.id}`}
            className={cn(
              "rounded-xl p-3 text-center focus-ring btn-press transition-colors duration-150",
              isActive
                ? "bg-action-blue text-white shadow-sm"
                : "bg-paper-card border border-paper-line hover:bg-paper-line/30 text-ink-secondary"
            )}
          >
            <div className={cn("mb-1", !isActive && "text-ink-utility")}>
              {segmentIcons[segment.id]}
            </div>
            <p className="font-body text-xs font-medium">{segment.label}</p>
            <p
              className={cn(
                "font-mono text-[10px] tabular-nums",
                isActive ? "opacity-70" : "text-ink-utility"
              )}
            >
              {segment.count} {segment.count === 1 ? "item" : "itens"}
            </p>
          </button>
        )
      })}
    </div>
  )
}
