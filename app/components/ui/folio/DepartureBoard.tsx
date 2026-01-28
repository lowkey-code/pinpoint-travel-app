import { cn } from "~/lib/utils"
import { ArrowRight } from "@phosphor-icons/react"
import { FlipCounter } from "./FlipCounter"

interface DepartureBoardProps {
  destination: string
  route?: string
  daysUntil: number
  departureDate: string
  returnDate: string
  duration: string
  progress: { current: number; total: number }
  onOpen: () => void
  className?: string
}

export function DepartureBoard({
  destination,
  route,
  daysUntil,
  departureDate,
  returnDate,
  duration,
  progress,
  onOpen,
  className,
}: DepartureBoardProps) {
  const progressPercent = progress.total > 0
    ? Math.round((progress.current / progress.total) * 100)
    : 0

  return (
    <div
      className={cn(
        "bg-ink-primary rounded-2xl overflow-hidden shadow-lg card-interactive",
        className
      )}
    >
      {/* Header */}
      <div className="px-4 py-2.5 bg-ink-primary/80 border-b border-white/10 flex items-center justify-between">
        <span className="font-mono text-[10px] text-white/60 tracking-widest">
          PRÓXIMA PARTIDA
        </span>
        <span className="font-mono text-[10px] text-stamp-sage tracking-wider flex items-center gap-1.5">
          <span className="w-2 h-2 bg-stamp-sage rounded-full pulse-live" />
          AO VIVO
        </span>
      </div>

      {/* Main content */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="font-mono text-[10px] text-white/50 mb-1">DESTINO</p>
            <h2 className="font-sans font-bold text-3xl text-white leading-none tracking-tight uppercase">
              {destination}
            </h2>
            {route && (
              <p className="font-body text-sm text-white/70 mt-1">{route}</p>
            )}
          </div>
          <div className="text-right">
            <p className="font-mono text-[10px] text-white/50 mb-1">EMBARQUE EM</p>
            <FlipCounter
              value={daysUntil}
              size="lg"
              className="text-stamp-amber"
            />
            <p className="font-mono text-xs text-white/70">
              {daysUntil === 1 ? "DIA" : "DIAS"}
            </p>
          </div>
        </div>

        {/* Data pills */}
        <div className="flex gap-3">
          <div className="bg-white/10 rounded-lg px-3 py-2.5 flex-1 transition-colors duration-150 hover:bg-white/15">
            <p className="font-mono text-[9px] text-white/50">PARTIDA</p>
            <p className="font-mono text-sm text-white font-medium tabular-nums">
              {departureDate}
            </p>
          </div>
          <div className="bg-white/10 rounded-lg px-3 py-2.5 flex-1 transition-colors duration-150 hover:bg-white/15">
            <p className="font-mono text-[9px] text-white/50">RETORNO</p>
            <p className="font-mono text-sm text-white font-medium tabular-nums">
              {returnDate}
            </p>
          </div>
          <div className="bg-white/10 rounded-lg px-3 py-2.5 transition-colors duration-150 hover:bg-white/15">
            <p className="font-mono text-[9px] text-white/50">DURAÇÃO</p>
            <p className="font-mono text-sm text-white font-medium tabular-nums">
              {duration}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex justify-between text-[10px] font-mono text-white/50 mb-1.5">
            <span>PLANEJAMENTO</span>
            <span className="tabular-nums">
              {progress.current}/{progress.total} itens
            </span>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-stamp-amber rounded-full progress-animated progress-glow"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Action button */}
      <button
        onClick={onOpen}
        className="w-full py-3.5 bg-action-blue hover:bg-action-hover text-white font-body font-medium btn-press focus-ring flex items-center justify-center gap-2 group"
      >
        <span>Abrir Itinerário</span>
        <ArrowRight
          weight="bold"
          className="transition-transform duration-150 group-hover:translate-x-1"
        />
      </button>
    </div>
  )
}
