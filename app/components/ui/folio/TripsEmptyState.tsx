import { cn } from "~/lib/utils"
import { MapTrifold, MapPin, Plus } from "@phosphor-icons/react"

interface TripsEmptyStateProps {
  onCreateTrip: () => void
  className?: string
}

export function TripsEmptyState({ onCreateTrip, className }: TripsEmptyStateProps) {
  return (
    <div className={cn("text-center py-16 px-6", className)}>
      {/* Illustrated icon */}
      <div className="relative w-24 h-24 mx-auto mb-6">
        <div className="absolute inset-0 bg-paper-line/30 rounded-full" />
        <div className="absolute inset-0 flex items-center justify-center">
          <MapTrifold weight="duotone" className="w-12 h-12 text-ink-utility" />
        </div>
        <MapPin
          weight="fill"
          className="absolute -top-1 right-0 w-6 h-6 text-stamp-amber"
        />
        <MapPin
          weight="fill"
          className="absolute bottom-0 -left-1 w-5 h-5 text-action-blue"
        />
      </div>

      {/* Text */}
      <h3 className="font-sans font-bold text-xl text-ink-primary mb-2">
        Nenhuma jornada ainda
      </h3>
      <p className="font-body text-ink-secondary max-w-xs mx-auto mb-6">
        Comece a planejar sua primeira aventura
      </p>

      {/* CTA */}
      <button
        onClick={onCreateTrip}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-action-blue text-white font-body font-medium rounded-xl hover:bg-action-hover btn-press focus-ring"
      >
        <Plus weight="bold" className="w-5 h-5" />
        <span>Criar Viagem</span>
      </button>
    </div>
  )
}
