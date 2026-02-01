import { cn } from "~/lib/utils"
import { SunHorizon, Sun, MoonStars, Plus, Coffee, MapTrifold, Wine } from "@phosphor-icons/react"
import type { Segment } from "~/features/itinerary/lib/types"

interface SegmentEmptyStateProps {
  segment: Segment
  onAdd: () => void
  className?: string
}

const segmentConfig: Record<Segment, {
  icon: React.ReactNode
  title: string
  subtitle: string
  accentIcon: React.ReactNode
}> = {
  morning: {
    icon: <SunHorizon weight="duotone" className="w-12 h-12 text-stamp-amber" />,
    title: "Manhã livre",
    subtitle: "Que tal começar com calma?",
    accentIcon: <Coffee weight="fill" className="w-5 h-5 text-stamp-amber/60" />,
  },
  afternoon: {
    icon: <Sun weight="duotone" className="w-12 h-12 text-stamp-amber" />,
    title: "Tarde livre",
    subtitle: "Tempo para explorar",
    accentIcon: <MapTrifold weight="fill" className="w-5 h-5 text-stamp-sage/60" />,
  },
  evening: {
    icon: <MoonStars weight="duotone" className="w-12 h-12 text-stamp-navy" />,
    title: "Noite livre",
    subtitle: "Perfeita para descobertas",
    accentIcon: <Wine weight="fill" className="w-5 h-5 text-stamp-navy/60" />,
  },
}

export function SegmentEmptyState({ segment, onAdd, className }: SegmentEmptyStateProps) {
  const config = segmentConfig[segment]

  return (
    <div className={cn("text-center py-10 px-4", className)}>
      {/* Icon cluster */}
      <div className="relative w-20 h-20 mx-auto mb-4">
        <div className="absolute inset-0 bg-paper-line/30 rounded-full" />
        <div className="absolute inset-0 flex items-center justify-center">
          {config.icon}
        </div>
        <div className="absolute -bottom-1 -right-1">
          {config.accentIcon}
        </div>
      </div>

      {/* Text */}
      <h3 className="font-sans font-bold text-lg text-ink-primary mb-1">
        {config.title}
      </h3>
      <p className="font-body text-sm text-ink-secondary mb-6">
        {config.subtitle}
      </p>

      {/* CTA */}
      <button
        onClick={onAdd}
        className="inline-flex items-center gap-2 px-5 py-3 bg-action-blue text-white font-body font-medium rounded-xl hover:bg-action-hover btn-press focus-ring shadow-sm"
        data-testid="add-item-button"
      >
        <Plus weight="bold" className="w-5 h-5" />
        <span>Adicionar atividade</span>
      </button>
    </div>
  )
}
