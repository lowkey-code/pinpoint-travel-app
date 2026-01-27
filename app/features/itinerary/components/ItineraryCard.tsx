import type { RenderableItem, Segment } from "~/features/itinerary"
import { isGhostItem, ITEM_TYPE_ICONS } from "~/features/itinerary"
import { cn } from "~/lib/utils"
import { CardActions } from "./CardActions"
import { ReorderControls } from "./ReorderControls"
import { AirplaneTakeoff, AirplaneLanding } from "@phosphor-icons/react"

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
  if (isGhostItem(item)) {
    const isTransport = item.isTransportGhost
    return (
      <div
        className={cn(
          "border-2 border-dashed rounded-xl",
          isTransport ? "border-action-blue/50 bg-action-blue/10" : "border-paper-line bg-secondary/30",
          compact ? "p-2" : "p-4"
        )}
        data-testid={`ghost-card-${item.parentId}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className={cn("italic font-body", isTransport ? "text-action-blue" : "text-ink-secondary", compact ? "text-xs mb-0.5" : "text-sm mb-1")}>
              {isTransport ? `Em trânsito` : item.title}
            </p>
            <span className={cn("text-xs px-2 py-0.5 rounded-full font-body", isTransport ? "bg-action-blue/20 text-action-blue" : "bg-secondary")}>
              {isTransport ? `Chegada em ${item.arrivalCity}` : "Dia Inteiro"}
            </span>
          </div>
          {!compact && (
            <button
              className="text-xs text-action-blue hover:underline font-body"
              aria-label="Ver item principal"
            >
              Ver principal →
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "bg-paper-card border border-paper-line rounded-xl shadow-sm hover:shadow-md transition-shadow relative",
        compact ? "p-3" : "p-4"
      )}
      data-testid={`itinerary-card-${item.id}`}
    >
      {/* City color indicator (left border) */}
      {item.city && (
        <div
          className="absolute left-0 top-0 bottom-0 w-1 bg-action-blue rounded-l-xl"
          title={item.city}
        />
      )}

      <div className={cn("flex", compact ? "gap-2" : "gap-3", item.city && "pl-2")}>
        {/* Icon or type indicator */}
        {!compact && (
          <div className="shrink-0 w-10 h-10 bg-secondary rounded-lg flex items-center justify-center text-lg">
            {item.icon || ITEM_TYPE_ICONS[item.itemType]}
          </div>
        )}

        {/* Content */}
        <div className={cn("flex-1 min-w-0", compact ? "space-y-2" : "space-y-3")}>
          {/* Title */}
          <div className="flex items-start gap-2">
            {compact && (
              <span className="shrink-0 text-base">
                {item.icon || ITEM_TYPE_ICONS[item.itemType]}
              </span>
            )}
            <h3 className={cn("font-sans font-semibold", compact ? "text-sm leading-tight" : "text-base")}>
              {item.title || "Sem título"}
            </h3>
          </div>

          {/* Transport multi-day info */}
          {item.itemType === "transport" && item.isMultiDayTransport && !compact && (
            <div className="space-y-2 text-sm font-body">
              <div className="flex items-start gap-2 text-ink-secondary">
                <AirplaneTakeoff className="w-4 h-4 mt-0.5" weight="bold" />
                <div>
                  <p className="font-medium text-ink-primary">{item.originCity}</p>
                  <p className="text-xs font-mono tabular-nums">
                    {item.departureDateTime && new Date(item.departureDateTime).toLocaleString("pt-BR", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2 text-ink-secondary">
                <AirplaneLanding className="w-4 h-4 mt-0.5" weight="bold" />
                <div>
                  <p className="font-medium text-ink-primary">{item.destinationCity}</p>
                  <p className="text-xs font-mono tabular-nums">
                    {item.arrivalDateTime && new Date(item.arrivalDateTime).toLocaleString("pt-BR", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Meta row */}
          {(item.timeLabel || item.durationText || item.costText) && (
            <div className={cn("flex flex-wrap text-ink-secondary font-body", compact ? "gap-2 text-xs" : "gap-3 text-sm")}>
              {item.timeLabel && (
                <span className="flex items-center gap-1 font-mono tabular-nums">
                  🕐 {item.timeLabel}
                </span>
              )}
              {item.durationText && (
                <span className="flex items-center gap-1 font-mono tabular-nums">
                  ⏱️ {item.durationText}
                </span>
              )}
              {item.costText && (
                <span className="flex items-center gap-1 font-mono tabular-nums">
                  💰 {item.costText}
                </span>
              )}
            </div>
          )}

          {/* City info */}
          {item.city && !compact && (
            <div className="text-xs text-ink-secondary space-y-1 font-body">
              <div className="flex items-center gap-1">
                <span className="bg-secondary px-2 py-0.5 rounded-full">
                  📍 {item.city}
                </span>
              </div>
            </div>
          )}

          {/* DayTrip badge */}
          {item.isDayTrip && !compact && (
            <span className="inline-block text-xs bg-action-blue/10 text-action-blue px-2 py-1 rounded-full font-medium font-body">
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
