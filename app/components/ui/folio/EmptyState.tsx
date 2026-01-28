import { cn } from "~/lib/utils"
import { MapTrifold, Plus, Compass, Airplane } from "@phosphor-icons/react"

interface EmptyStateProps {
  onCreateTrip: () => void
  className?: string
}

export function EmptyState({ onCreateTrip, className }: EmptyStateProps) {
  return (
    <div className={cn("text-center py-12 px-6", className)}>
      {/* Illustrated icon cluster */}
      <div className="relative w-32 h-32 mx-auto mb-6">
        {/* Background circle */}
        <div className="absolute inset-0 bg-paper-line/30 rounded-full" />

        {/* Main icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <MapTrifold weight="duotone" className="w-16 h-16 text-ink-utility" />
        </div>

        {/* Floating accents */}
        <Compass
          weight="fill"
          className="absolute -top-1 -right-1 w-8 h-8 text-stamp-amber animate-pulse"
        />
        <Airplane
          weight="fill"
          className="absolute -bottom-2 -left-2 w-7 h-7 text-action-blue rotate-[-20deg]"
        />
      </div>

      {/* Text content */}
      <h2 className="font-sans font-bold text-2xl text-ink-primary mb-2">
        Sua próxima aventura
      </h2>
      <p className="font-body text-ink-secondary max-w-xs mx-auto mb-8">
        Comece a planejar sua viagem. Organize destinos, atividades e horários em um só lugar.
      </p>

      {/* CTA Button */}
      <button
        onClick={onCreateTrip}
        className="inline-flex items-center gap-2 px-6 py-3 bg-action-blue text-white font-body font-medium rounded-xl hover:bg-action-hover btn-press focus-ring shadow-lg shadow-action-blue/20"
      >
        <Plus weight="bold" className="w-5 h-5" />
        <span>Planejar Primeira Viagem</span>
      </button>

      {/* Subtle hint */}
      <p className="font-mono text-[10px] text-ink-utility/60 mt-6 tracking-wider">
        100% OFFLINE · SEUS DADOS FICAM NO SEU DISPOSITIVO
      </p>
    </div>
  )
}
