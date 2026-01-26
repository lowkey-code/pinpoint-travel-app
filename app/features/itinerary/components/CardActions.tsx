import type { ItineraryItem } from "~/features/itinerary"
import { STATUS_LABELS, STATUS_COLORS, PRIORITY_COLORS } from "~/features/itinerary"
import { Copy, MapPin } from "lucide-react"
import { ItineraryMenu } from "./ItineraryMenu"

interface CardActionsProps {
  item: ItineraryItem
}

export function CardActions({ item }: CardActionsProps) {
  const handleCopy = async () => {
    if (!item.address) return
    try {
      await navigator.clipboard.writeText(item.address)
      // TODO: Show toast notification
      console.log("Endereço copiado!")
    } catch (err) {
      console.error("Erro ao copiar:", err)
    }
  }

  const handleOpenMap = () => {
    if (!item.address) return
    const url = `https://uri.amap.com/search?query=${encodeURIComponent(item.address)}`
    window.open(url, "_blank", "noopener,noreferrer")
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Priority badge */}
      {item.priority > 0 && (
        <span
          className={`text-xs px-2 py-1 rounded-full font-medium ${PRIORITY_COLORS[item.priority]}`}
        >
          {item.priority === 1 ? "⚠️ Importante" : "⭐ Imperdível"}
        </span>
      )}

      {/* Status badge */}
      <span className={`text-xs font-medium ${STATUS_COLORS[item.status]}`}>
        {STATUS_LABELS[item.status]}
      </span>

      <div className="ml-auto flex items-center gap-1">
        {/* Copy button */}
        {item.address && (
          <button
            onClick={handleCopy}
            className="p-2 hover:bg-secondary rounded-lg transition-colors tap-target"
            aria-label="Copiar endereço"
            data-testid={`copy-${item.id}`}
          >
            <Copy className="w-4 h-4" />
          </button>
        )}

        {/* AMap button */}
        {item.address && (
          <button
            onClick={handleOpenMap}
            className="p-2 hover:bg-secondary rounded-lg transition-colors tap-target"
            aria-label="Abrir no mapa"
            data-testid={`amap-${item.id}`}
          >
            <MapPin className="w-4 h-4" />
          </button>
        )}

        {/* Menu */}
        <ItineraryMenu item={item} />
      </div>
    </div>
  )
}
