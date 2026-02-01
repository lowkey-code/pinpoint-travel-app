import type { RenderableItem, Segment, ItemStatus } from "~/features/itinerary"
import { isGhostItem, ITEM_TYPE_ICONS, ITEM_TYPE_LABELS, STATUS_LABELS } from "~/features/itinerary"
import { cn } from "~/lib/utils"
import { CardActions } from "./CardActions"
import { ReorderControls } from "./ReorderControls"
import { AirplaneTakeoff, AirplaneLanding } from "@phosphor-icons/react"
import { BoardingPassCard, StampBadge } from "~/components/ui/folio"
import type { StampVariant } from "~/components/ui/folio"

interface ItineraryCardProps {
  item: RenderableItem
  reorderMode?: boolean
  dayIndex?: number
  segment?: Segment
  isFirst?: boolean
  isLast?: boolean
  compact?: boolean
  onViewPrimary?: (parentId: string) => void
}

const STATUS_TO_STAMP: Record<ItemStatus, StampVariant> = {
  planned: "navy",
  done: "sage",
  skipped: "amber",
}

export function ItineraryCard({
  item,
  reorderMode = false,
  dayIndex,
  segment,
  isFirst = false,
  isLast = false,
  compact = false,
  onViewPrimary,
}: ItineraryCardProps) {
  // Ghost cards have different rendering
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
              {isTransport ? "Em trânsito" : item.title}
            </p>
            <span className={cn("text-xs px-2 py-0.5 rounded-full font-body", isTransport ? "bg-action-blue/20 text-action-blue" : "bg-secondary")}>
              {isTransport ? `Chegada em ${item.arrivalCity}` : "Dia Inteiro"}
            </span>
          </div>
          {!compact && onViewPrimary && (
            <button
              className="text-xs text-action-blue hover:underline font-body"
              aria-label="Ver item principal"
              onClick={() => onViewPrimary(item.parentId)}
            >
              Ver principal →
            </button>
          )}
        </div>
      </div>
    )
  }

  // Build data items for the card
  const dataItems: Array<{ label: string; value: string; mono?: boolean }> = []

  if (item.timeLabel) {
    dataItems.push({ label: "Horário", value: item.timeLabel, mono: true })
  }
  if (item.durationText) {
    dataItems.push({ label: "Duração", value: item.durationText, mono: true })
  }
  if (item.costText) {
    dataItems.push({ label: "Custo", value: item.costText, mono: true })
  }
  if (item.addressText) {
    dataItems.push({ label: "Endereço", value: item.addressText })
  }
  if (item.city) {
    dataItems.push({ label: "Cidade", value: item.city })
  }

  // Compact mode uses simpler card
  if (compact) {
    return (
      <div
        className="bg-paper-card border border-paper-line rounded-lg p-2 flex items-center gap-2"
        data-testid={`itinerary-card-${item.id}`}
      >
        <span className="text-base shrink-0">
          {item.icon || ITEM_TYPE_ICONS[item.itemType]}
        </span>
        <span className="text-sm font-sans font-medium truncate flex-1">
          {item.title || "Sem título"}
        </span>
        <StampBadge variant={STATUS_TO_STAMP[item.status]} size="sm">
          {STATUS_LABELS[item.status]}
        </StampBadge>
      </div>
    )
  }

  // Full card with BoardingPassCard
  return (
    <div data-testid={`itinerary-card-${item.id}`}>
      <BoardingPassCard
        typeLabel={ITEM_TYPE_LABELS[item.itemType]}
        typeIcon={item.icon || ITEM_TYPE_ICONS[item.itemType]}
        title={item.title || "Sem título"}
        stampBadge={{
          variant: STATUS_TO_STAMP[item.status],
          label: STATUS_LABELS[item.status],
          rotated: true,
        }}
        accentColor={item.city ? "var(--action-blue)" : undefined}
        dataItems={dataItems.length > 0 ? dataItems : undefined}
        showBarcode={dataItems.length > 0}
        actions={
          reorderMode && dayIndex !== undefined && segment ? (
            <ReorderControls
              item={item}
              dayIndex={dayIndex}
              segment={segment}
              isFirst={isFirst}
              isLast={isLast}
            />
          ) : (
            <CardActions item={item} />
          )
        }
      >
        {/* Multi-day transport info */}
        {item.itemType === "transport" && item.isMultiDayTransport && (
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <AirplaneTakeoff className="w-5 h-5 text-ink-secondary mt-0.5" weight="bold" />
              <div>
                <p className="font-medium text-ink-primary">{item.originCity}</p>
                <p className="text-xs font-mono tabular-nums text-ink-secondary">
                  {item.departureDateTime && new Date(item.departureDateTime).toLocaleString("pt-BR", {
                    day: "2-digit",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <AirplaneLanding className="w-5 h-5 text-ink-secondary mt-0.5" weight="bold" />
              <div>
                <p className="font-medium text-ink-primary">{item.destinationCity}</p>
                <p className="text-xs font-mono tabular-nums text-ink-secondary">
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

        {/* DayTrip badge */}
        {item.isDayTrip && (
          <div className="mt-2">
            <StampBadge variant="navy" size="sm">
              Dia Inteiro
            </StampBadge>
          </div>
        )}
      </BoardingPassCard>
    </div>
  )
}
