import type { RenderableItem, Segment } from "~/features/itinerary"
import { isGhostItem, parseDurationText, formatDuration, parseCostText, formatCost, ITEM_TYPE_ICONS } from "~/features/itinerary"
import { cn } from "~/lib/utils"
import { CardActions } from "./CardActions"
import { ReorderControls } from "./ReorderControls"

interface ItineraryCardProps {
  item: RenderableItem
  reorderMode?: boolean
  dayIndex?: number
  segment?: Segment
  isFirst?: boolean
  isLast?: boolean
  compact?: boolean
}

export function ItineraryCard({
  item,
  reorderMode = false,
  dayIndex,
  segment,
  isFirst = false,
  isLast = false,
  compact = false,
}: ItineraryCardProps) {
  // Ghost items (dayTrip coverage indicators)
  if (isGhostItem(item)) {
    return (
      <div
        className={cn(
          "border-2 border-dashed border-muted rounded-xl bg-muted/30",
          compact ? "p-2" : "p-4"
        )}
        data-testid={`ghost-card-${item.parentId}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className={cn("text-muted-foreground italic", compact ? "text-xs mb-0.5" : "text-sm mb-1")}>
              {item.title}
            </p>
            <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
              Dia Inteiro
            </span>
          </div>
          {!compact && (
            <button
              className="text-xs text-primary hover:underline"
              aria-label="Ver item principal"
            >
              Ver principal →
            </button>
          )}
        </div>
      </div>
    )
  }

  // Regular items - Pinterest-style
  return (
    <div
      className={cn(
        "bg-card border border-border rounded-xl shadow-sm hover:shadow-md transition-shadow",
        compact ? "p-3" : "p-4"
      )}
      data-testid={`itinerary-card-${item.id}`}
    >
      {/* City color indicator (left border) */}
      {item.city && (
        <div
          className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-xl"
          title={item.city}
        />
      )}

      <div className={cn("flex", compact ? "gap-2" : "gap-3", item.city && "pl-2")}>
        {/* Icon or type indicator */}
        {!compact && (
          <div className="flex-shrink-0 w-10 h-10 bg-secondary rounded-lg flex items-center justify-center text-lg">
            {item.icon || ITEM_TYPE_ICONS[item.itemType]}
          </div>
        )}

        {/* Content */}
        <div className={cn("flex-1 min-w-0", compact ? "space-y-2" : "space-y-3")}>
          {/* Title */}
          <div className="flex items-start gap-2">
            {compact && (
              <span className="flex-shrink-0 text-base">
                {item.icon || ITEM_TYPE_ICONS[item.itemType]}
              </span>
            )}
            <h3 className={cn("font-semibold", compact ? "text-sm leading-tight" : "text-base")}>
              {item.title || "Sem título"}
            </h3>
          </div>

          {/* Meta row */}
          {(item.timeLabel || item.durationText || item.costText) && (
            <div className={cn("flex flex-wrap text-muted-foreground", compact ? "gap-2 text-xs" : "gap-3 text-sm")}>
              {item.timeLabel && (
                <span className="flex items-center gap-1">
                  🕐 {item.timeLabel}
                </span>
              )}
              {item.durationText && (
                <span className="flex items-center gap-1">
                  ⏱️ {item.durationText}
                </span>
              )}
              {item.costText && (
                <span className="flex items-center gap-1">
                  💰 {item.costText}
                </span>
              )}
            </div>
          )}

          {/* City info */}
          {item.city && !compact && (
            <div className="text-xs text-muted-foreground space-y-1">
              <div className="flex items-center gap-1">
                <span className="bg-secondary px-2 py-0.5 rounded-full">
                  📍 {item.city}
                </span>
              </div>
            </div>
          )}

          {/* DayTrip badge */}
          {item.isDayTrip && !compact && (
            <span className="inline-block text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
              Dia Inteiro
            </span>
          )}

          {/* Actions row */}
          {!reorderMode && (
            <CardActions item={item} />
          )}
        </div>

        {/* Reorder controls */}
        {reorderMode && dayIndex !== undefined && segment && (
          <ReorderControls
            item={item}
            dayIndex={dayIndex}
            segment={segment}
            isFirst={isFirst}
            isLast={isLast}
          />
        )}
      </div>
    </div>
  )
}
