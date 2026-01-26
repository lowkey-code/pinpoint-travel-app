import type { RenderableItem } from "~/features/itinerary"
import { isGhostItem, STATUS_COLORS, PRIORITY_COLORS } from "~/features/itinerary"
import { MapPin, Clock, DollarSign, MoreVertical } from "lucide-react"
import { cn } from "~/lib/utils"

interface ItineraryCardProps {
  item: RenderableItem
  compact?: boolean
}

export function ItineraryCard({ item, compact = false }: ItineraryCardProps) {
  // Ghost items (dayTrip coverage indicators)
  if (isGhostItem(item)) {
    return (
      <div
        className={cn(
          "border-2 border-dashed border-muted rounded-lg p-3 bg-muted/30 opacity-60",
          compact && "p-2"
        )}
      >
        <p className="text-sm text-muted-foreground italic">
          {item.title} (dia inteiro)
        </p>
      </div>
    )
  }

  // Regular items
  return (
    <div
      className={cn(
        "bg-card border border-border rounded-xl p-4 hover:shadow-md transition-shadow",
        compact && "p-3",
        item.priority > 0 && PRIORITY_COLORS[item.priority]
      )}
      data-testid={`itinerary-card-${item.id}`}
    >
      <div className="flex items-start gap-3">
        {/* City color indicator */}
        {item.city && (
          <div
            className="w-1 h-full bg-primary rounded-full self-stretch"
            title={item.city}
          />
        )}

        <div className="flex-1 min-w-0">
          {/* Title */}
          <h3 className={cn("font-semibold mb-1", compact ? "text-sm" : "text-base")}>
            {item.title || "Sem título"}
          </h3>

          {/* Meta row */}
          <div className={cn("flex flex-wrap gap-2 mb-2", compact ? "text-xs" : "text-sm")}>
            {item.timeLabel && (
              <span className="text-muted-foreground flex items-center gap-1">
                <Clock className={cn(compact ? "w-3 h-3" : "w-4 h-4")} />
                {item.timeLabel}
              </span>
            )}
            {item.city && (
              <span className="text-muted-foreground flex items-center gap-1">
                <MapPin className={cn(compact ? "w-3 h-3" : "w-4 h-4")} />
                {item.city}
              </span>
            )}
            {item.cost !== undefined && (
              <span className="text-muted-foreground flex items-center gap-1">
                <DollarSign className={cn(compact ? "w-3 h-3" : "w-4 h-4")} />
                {item.cost}
              </span>
            )}
          </div>

          {/* Status */}
          <span className={cn("text-xs font-medium", STATUS_COLORS[item.status])}>
            {item.status === "planned" && "Planejado"}
            {item.status === "done" && "Feito"}
            {item.status === "skipped" && "Pulado"}
          </span>
        </div>

        {/* Actions menu */}
        <button
          className="p-1 hover:bg-secondary rounded-lg transition-colors"
          aria-label="Mais ações"
          data-testid={`item-menu-${item.id}`}
        >
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
