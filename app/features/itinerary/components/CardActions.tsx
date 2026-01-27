import type { ItineraryItem } from "~/features/itinerary"
import { STATUS_LABELS, buildAMapUrl, copyToClipboard } from "~/features/itinerary"
import { Copy, MapPin } from "@phosphor-icons/react"
import { ItineraryMenu } from "./ItineraryMenu"
import { useToast } from "~/hooks/use-toast"
import { StampBadge } from "~/components/ui/folio"
import type { StampVariant } from "~/components/ui/folio"

interface CardActionsProps {
  item: ItineraryItem
}

const statusToStamp: Record<string, StampVariant> = {
  planned: "navy",
  done: "sage",
  skipped: "amber",
}

export function CardActions({ item }: CardActionsProps) {
  const toast = useToast()

  const handleCopy = async () => {
    if (!item.addressText) return
    const success = await copyToClipboard(item.addressText)
    if (success) {
      toast.success("Endereço copiado!")
    } else {
      toast.error("Erro ao copiar endereço")
    }
  }

  const handleOpenMap = () => {
    const url = buildAMapUrl(item)
    if (!url) {
      toast.error("Nenhum endereço ou coordenada disponível")
      return
    }
    if (!item.lat || !item.lng) {
      toast.info("Abrindo mapa com busca de texto")
    }
    window.open(url, "_blank", "noopener,noreferrer")
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Priority badge */}
      {item.priority > 0 && (
        <StampBadge variant={item.priority === 2 ? "brick" : "amber"} rotated>
          {item.priority === 1 ? "Importante" : "Imperdível"}
        </StampBadge>
      )}

      {/* Status badge */}
      <StampBadge variant={statusToStamp[item.status]}>
        {STATUS_LABELS[item.status]}
      </StampBadge>

      <div className="ml-auto flex items-center gap-1">
        {/* Copy button */}
        {item.addressText && (
          <button
            onClick={handleCopy}
            className="p-2 hover:bg-secondary rounded-lg transition-colors tap-target"
            aria-label="Copiar endereço"
            data-testid={`copy-${item.id}`}
          >
            <Copy className="w-4 h-4" weight="bold" />
          </button>
        )}

        {/* AMap button */}
        {(item.addressText || (item.lat && item.lng)) && (
          <button
            onClick={handleOpenMap}
            className="p-2 hover:bg-secondary rounded-lg transition-colors tap-target"
            aria-label="Abrir no mapa"
            data-testid={`amap-${item.id}`}
          >
            <MapPin className="w-4 h-4" weight="bold" />
          </button>
        )}

        {/* Menu */}
        <ItineraryMenu item={item} />
      </div>
    </div>
  )
}
