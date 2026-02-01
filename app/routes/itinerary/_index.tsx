import { useNavigate } from "react-router"
import { useState } from "react"
import { useTrips } from "~/features/itinerary"
import { Plus, Archive, ArrowCounterClockwise, Trash } from "@phosphor-icons/react"
import { CreateTripDialog } from "~/features/itinerary/components/CreateTripDialog"
import { ConfirmDialog } from "~/components/ui/ConfirmDialog"
import {
  TripListSkeleton,
  TripTimelineCard,
  TripsEmptyState,
  PerforatedDivider,
} from "~/components/ui/folio"
import type { Trip } from "~/features/itinerary/lib/types"
import { formatDateRange, getTripDuration, getTripProgress } from "~/features/itinerary/lib/utils"

function getCountryEmoji(name: string): string {
  const lower = name.toLowerCase()
  if (lower.includes("japão") || lower.includes("japan") || lower.includes("tóquio") || lower.includes("kyoto")) return "🇯🇵"
  if (lower.includes("portugal") || lower.includes("lisboa")) return "🇵🇹"
  if (lower.includes("brasil") || lower.includes("brazil") || lower.includes("serra") || lower.includes("rio")) return "🇧🇷"
  if (lower.includes("italia") || lower.includes("italy") || lower.includes("roma") || lower.includes("veneza")) return "🇮🇹"
  if (lower.includes("espanha") || lower.includes("spain") || lower.includes("madrid") || lower.includes("barcelona")) return "🇪🇸"
  if (lower.includes("frança") || lower.includes("france") || lower.includes("paris")) return "🇫🇷"
  if (lower.includes("alemanha") || lower.includes("germany") || lower.includes("berlim")) return "🇩🇪"
  if (lower.includes("eua") || lower.includes("usa") || lower.includes("estados unidos") || lower.includes("new york")) return "🇺🇸"
  if (lower.includes("argentina") || lower.includes("buenos aires")) return "🇦🇷"
  if (lower.includes("chile") || lower.includes("santiago")) return "🇨🇱"
  if (lower.includes("peru") || lower.includes("lima") || lower.includes("machu")) return "🇵🇪"
  if (lower.includes("méxico") || lower.includes("mexico")) return "🇲🇽"
  if (lower.includes("canadá") || lower.includes("canada")) return "🇨🇦"
  if (lower.includes("reino unido") || lower.includes("uk") || lower.includes("londres") || lower.includes("london")) return "🇬🇧"
  if (lower.includes("grécia") || lower.includes("greece") || lower.includes("atenas")) return "🇬🇷"
  if (lower.includes("tailândia") || lower.includes("thailand") || lower.includes("bangkok")) return "🇹🇭"
  if (lower.includes("coreia") || lower.includes("korea") || lower.includes("seul")) return "🇰🇷"
  return "✈️"
}

function getTripStatusLabel(trip: Trip): string | undefined {
  if (trip.items.length === 0) return "Planejamento"

  const progress = getTripProgress(trip)
  if (progress.current === progress.total && progress.total > 0) return undefined // Show progress bar instead
  if (progress.current === 0) return "Planejamento"

  return undefined // Show progress bar
}

type TimelinePosition = "first" | "middle" | "last" | "only"

function getTimelinePosition(index: number, total: number): TimelinePosition {
  if (total === 1) return "only"
  if (index === 0) return "first"
  if (index === total - 1) return "last"
  return "middle"
}

export default function ItineraryIndex() {
  const navigate = useNavigate()
  const {
    activeTrips,
    archivedTrips,
    isLoading,
    createNewTrip,
    restoreTrip,
    deleteTrip,
  } = useTrips()

  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; tripId: string | null }>({
    open: false,
    tripId: null,
  })

  const handleCreateTrip = (data: { name: string; description?: string; startDate?: string; endDate?: string }) => {
    const trip = createNewTrip(data.name, {
      description: data.description,
      startDate: data.startDate,
      endDate: data.endDate,
    })
    navigate(`/itinerary/${trip.id}`)
  }

  const handleDeleteConfirm = () => {
    if (deleteConfirm.tripId) {
      deleteTrip(deleteConfirm.tripId)
    }
  }

  const hasAnyTrips = activeTrips.length > 0 || archivedTrips.length > 0

  if (isLoading) {
    return <TripListSkeleton />
  }

  return (
    <div className="min-h-screen bg-paper-base">
      <div className="max-w-md mx-auto pb-24">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-paper-base/95 backdrop-blur-sm border-b border-paper-line">
          <div className="flex items-center justify-between p-4">
            <h1 className="font-sans font-bold text-xl text-ink-primary">
              Minhas Jornadas
            </h1>
            <button
              onClick={() => setShowCreateDialog(true)}
              className="p-2 bg-action-blue text-white rounded-lg hover:bg-action-hover btn-press focus-ring"
              aria-label="Criar viagem"
            >
              <Plus weight="bold" className="w-5 h-5" />
            </button>
          </div>
        </header>

        <section className="p-4">
          {/* Empty State */}
          {!hasAnyTrips && (
            <TripsEmptyState onCreateTrip={() => setShowCreateDialog(true)} />
          )}

          {/* Active Trips */}
          {activeTrips.length > 0 && (
            <div className="mb-6">
              <h2 className="font-mono text-[10px] text-ink-utility tracking-widest mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-action-blue rounded-full" />
                ATIVAS ({activeTrips.length})
              </h2>

              <div className="stagger-item">
                {activeTrips.map((trip, index) => (
                  <TripTimelineCard
                    key={trip.id}
                    emoji={getCountryEmoji(trip.name)}
                    title={trip.name}
                    dateRange={formatDateRange(trip.startDate, trip.endDate)}
                    duration={`${getTripDuration(trip)} dias`}
                    progress={trip.items.length > 0 ? getTripProgress(trip) : undefined}
                    statusLabel={getTripStatusLabel(trip)}
                    state="active"
                    position={getTimelinePosition(index, activeTrips.length)}
                    onClick={() => navigate(`/itinerary/${trip.id}`)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Archived Trips */}
          {archivedTrips.length > 0 && (
            <div>
              {activeTrips.length > 0 && <PerforatedDivider className="mb-6" />}

              <details className="group" open={activeTrips.length === 0}>
                <summary className="font-mono text-[10px] text-ink-utility tracking-widest mb-4 flex items-center gap-2 cursor-pointer list-none hover:text-ink-secondary transition-colors">
                  <Archive weight="bold" className="w-3.5 h-3.5" />
                  <span>MEMÓRIAS ({archivedTrips.length})</span>
                  <span className="ml-auto text-ink-utility/50 group-open:rotate-90 transition-transform">
                    ▶
                  </span>
                </summary>

                <div className="stagger-item">
                  {archivedTrips.map((trip, index) => (
                    <div key={trip.id}>
                      <TripTimelineCard
                        emoji={getCountryEmoji(trip.name)}
                        title={trip.name}
                        dateRange={formatDateRange(trip.startDate, trip.endDate)}
                        duration={`${getTripDuration(trip)} dias`}
                        statusLabel="Concluída"
                        state="archived"
                        position={getTimelinePosition(index, archivedTrips.length)}
                        onClick={() => navigate(`/itinerary/${trip.id}`)}
                      />

                      {/* Actions for archived trips */}
                      <div className="flex gap-2 justify-end -mt-1 mb-4 ml-9">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            restoreTrip(trip.id)
                          }}
                          className="px-3 py-1.5 text-xs font-mono text-ink-utility hover:bg-paper-line rounded-lg btn-press focus-ring flex items-center gap-1.5"
                        >
                          <ArrowCounterClockwise weight="bold" className="w-3.5 h-3.5" />
                          Restaurar
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setDeleteConfirm({ open: true, tripId: trip.id })
                          }}
                          className="px-3 py-1.5 text-xs font-mono text-stamp-brick hover:bg-stamp-brick/10 rounded-lg btn-press focus-ring flex items-center gap-1.5"
                        >
                          <Trash weight="bold" className="w-3.5 h-3.5" />
                          Deletar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </details>
            </div>
          )}

          {/* Create Trip Button (when there are trips) */}
          {hasAnyTrips && (
            <button
              onClick={() => setShowCreateDialog(true)}
              className="w-full mt-6 py-4 bg-paper-card border-2 border-dashed border-paper-line rounded-xl hover:border-action-blue hover:bg-action-blue/5 btn-press focus-ring flex items-center justify-center gap-2 group"
              data-testid="create-trip-button"
            >
              <Plus
                weight="bold"
                className="w-5 h-5 text-ink-utility group-hover:text-action-blue transition-colors"
              />
              <span className="font-body font-medium text-ink-primary group-hover:text-action-blue transition-colors">
                Planejar Nova Viagem
              </span>
            </button>
          )}
        </section>

        <CreateTripDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
          onCreate={handleCreateTrip}
        />

        <ConfirmDialog
          open={deleteConfirm.open}
          onOpenChange={(open) => setDeleteConfirm({ open, tripId: open ? deleteConfirm.tripId : null })}
          title="Deletar Viagem"
          description="Esta viagem será deletada permanentemente. Esta ação não pode ser desfeita."
          confirmLabel="Deletar"
          cancelLabel="Cancelar"
          variant="danger"
          onConfirm={handleDeleteConfirm}
        />
      </div>
    </div>
  )
}
