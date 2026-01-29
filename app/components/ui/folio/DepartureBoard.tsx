import { cn } from "~/lib/utils"
import { ArrowRight, MapPin, Airplane } from "@phosphor-icons/react"
import { FlipCounter } from "./FlipCounter"

type BoardStatus = "upcoming" | "ongoing" | "completed"

interface DepartureBoardProps {
  destination: string
  route?: string
  status?: BoardStatus
  daysUntil?: number
  currentDay?: number
  totalDays?: number
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
  status = "upcoming",
  daysUntil = 0,
  currentDay,
  totalDays,
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

  const isOngoing = status === "ongoing"

  return (
    <div
      className={cn(
        // Light mode: dark navy board (contrasts with light paper-base)
        // Dark mode: elevated card with border (contrasts with dark paper-base)
        "rounded-2xl overflow-hidden shadow-lg card-interactive",
        "bg-[#0E1A2B] dark:bg-paper-card dark:border dark:border-paper-line",
        className
      )}
    >
      {/* Header */}
      <div className="px-4 py-2.5 bg-black/20 dark:bg-black/30 border-b border-white/10 dark:border-paper-line flex items-center justify-between">
        <span className="font-mono text-[10px] text-white/60 dark:text-ink-utility tracking-widest">
          {isOngoing ? "VIAGEM EM ANDAMENTO" : "PRÓXIMA PARTIDA"}
        </span>
        <span
          className={cn(
            "font-mono text-[10px] tracking-wider flex items-center gap-1.5",
            isOngoing ? "text-action-blue" : "text-stamp-sage"
          )}
        >
          <span
            className={cn(
              "w-2 h-2 rounded-full pulse-live",
              isOngoing ? "bg-action-blue" : "bg-stamp-sage"
            )}
          />
          {isOngoing ? "AGORA" : "AO VIVO"}
        </span>
      </div>

      {/* Main content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <p className="font-mono text-[10px] text-white/50 dark:text-ink-utility mb-1">
              {isOngoing ? "VOCÊ ESTÁ EM" : "DESTINO"}
            </p>
            <h2 className="font-sans font-bold text-3xl text-white dark:text-ink-primary leading-none tracking-tight uppercase truncate">
              {destination}
            </h2>
            {route && (
              <p className="font-body text-sm text-white/70 dark:text-ink-secondary mt-1 truncate">{route}</p>
            )}
          </div>
          <div className="text-right shrink-0 ml-4">
            {isOngoing ? (
              <>
                <p className="font-mono text-[10px] text-white/50 dark:text-ink-utility mb-1">DIA</p>
                <div className="flex items-baseline gap-1 justify-end">
                  <FlipCounter value={currentDay || 1} size="lg" className="text-action-blue" />
                  <span className="font-mono text-lg text-white/50 dark:text-ink-utility">/</span>
                  <span className="font-mono text-lg text-white/70 dark:text-ink-secondary">{totalDays}</span>
                </div>
              </>
            ) : (
              <>
                <p className="font-mono text-[10px] text-white/50 dark:text-ink-utility mb-1">EMBARQUE EM</p>
                <FlipCounter value={daysUntil || 0} size="lg" className="text-stamp-amber" />
                <p className="font-mono text-xs text-white/70 dark:text-ink-secondary">
                  {daysUntil === 1 ? "DIA" : "DIAS"}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Data pills */}
        <div className="flex gap-3">
          <div className="bg-white/10 dark:bg-paper-base/50 rounded-lg px-3 py-2.5 flex-1 transition-colors duration-150 hover:bg-white/15 dark:hover:bg-paper-base/70">
            <p className="font-mono text-[9px] text-white/50 dark:text-ink-utility">PARTIDA</p>
            <p className="font-mono text-sm text-white dark:text-ink-primary font-medium tabular-nums">
              {departureDate}
            </p>
          </div>
          <div className="bg-white/10 dark:bg-paper-base/50 rounded-lg px-3 py-2.5 flex-1 transition-colors duration-150 hover:bg-white/15 dark:hover:bg-paper-base/70">
            <p className="font-mono text-[9px] text-white/50 dark:text-ink-utility">RETORNO</p>
            <p className="font-mono text-sm text-white dark:text-ink-primary font-medium tabular-nums">
              {returnDate}
            </p>
          </div>
          <div className="bg-white/10 dark:bg-paper-base/50 rounded-lg px-3 py-2.5 transition-colors duration-150 hover:bg-white/15 dark:hover:bg-paper-base/70">
            <p className="font-mono text-[9px] text-white/50 dark:text-ink-utility">DURAÇÃO</p>
            <p className="font-mono text-sm text-white dark:text-ink-primary font-medium tabular-nums">
              {duration}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex justify-between text-[10px] font-mono text-white/50 dark:text-ink-utility mb-1.5">
            <span>{isOngoing ? "PROGRESSO" : "PLANEJAMENTO"}</span>
            <span className="tabular-nums">
              {progress.current}/{progress.total} itens
            </span>
          </div>
          <div className="h-1.5 bg-white/10 dark:bg-paper-base/50 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full progress-animated progress-glow",
                isOngoing ? "bg-action-blue" : "bg-stamp-amber"
              )}
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
        {isOngoing ? (
          <>
            <MapPin weight="fill" className="w-4 h-4" />
            <span>Ver Dia Atual</span>
          </>
        ) : (
          <>
            <span>Abrir Itinerário</span>
            <ArrowRight
              weight="bold"
              className="transition-transform duration-150 group-hover:translate-x-1"
            />
          </>
        )}
      </button>
    </div>
  )
}
