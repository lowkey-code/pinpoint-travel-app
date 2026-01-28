import { useNavigate } from "react-router"
import { useState, useMemo } from "react"
import { useTrips } from "~/features/itinerary"
import { Plus, Gear, Archive, Trash } from "@phosphor-icons/react"
import { CreateTripDialog } from "~/features/itinerary/components/CreateTripDialog"
import { ConfirmDialog } from "~/components/ui/ConfirmDialog"
import { TripListSkeleton, DepartureBoard, TicketStub } from "~/components/ui/folio"
import { ThemeToggle } from "~/components/ui/ThemeToggle"
import type { Trip } from "~/features/itinerary/lib/types"

function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00")
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase()
}

function formatMonthYear(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00")
  return date.toLocaleDateString("pt-BR", { month: "short", year: "numeric" }).toUpperCase()
}

function getDaysUntil(dateStr: string): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(dateStr + "T00:00:00")
  const diff = target.getTime() - today.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

function getTripDuration(trip: Trip): string {
  if (trip.startDate && trip.endDate) {
    const start = new Date(trip.startDate + "T00:00:00")
    const end = new Date(trip.endDate + "T00:00:00")
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
    return `${days} DIAS`
  }
  return `${trip.days.length} DIAS`
}

function getTripProgress(trip: Trip): { current: number; total: number } {
  const total = trip.items.length
  const current = trip.items.filter(item => item.status === "done").length
  return { current, total }
}

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
  return "✈️"
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

  // Find the next upcoming trip (has startDate in the future or closest)
  const { nextTrip, otherTrips } = useMemo(() => {
    if (activeTrips.length === 0) return { nextTrip: null, otherTrips: [] }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const tripsWithDates = activeTrips
      .filter(t => t.startDate)
      .map(t => ({
        trip: t,
        daysUntil: getDaysUntil(t.startDate!),
      }))
      .sort((a, b) => a.daysUntil - b.daysUntil)

    // Find first trip that hasn't ended yet
    const upcoming = tripsWithDates.find(t => {
      if (!t.trip.endDate) return t.daysUntil >= -7 // Show trips up to 7 days past start if no end date
      const endDate = new Date(t.trip.endDate + "T00:00:00")
      return endDate >= today
    })

    if (upcoming) {
      const others = activeTrips.filter(t => t.id !== upcoming.trip.id)
      return { nextTrip: upcoming.trip, otherTrips: others }
    }

    // No upcoming trips with dates, use first active trip
    return { nextTrip: activeTrips[0], otherTrips: activeTrips.slice(1) }
  }, [activeTrips])

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

  if (isLoading) {
    return <TripListSkeleton />
  }

  return (
    <div className="max-w-md mx-auto pb-24">
      <section className="p-4 space-y-6">
        {/* Header */}
        <header className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-3">
            <img
              src="/logo.svg"
              alt="Folio"
              className="w-10 h-10 rounded-lg transition-transform duration-150 ease-out hover:scale-105"
            />
            <div>
              <h1 className="font-sans font-bold text-xl text-ink-primary leading-none">Folio</h1>
              <p className="font-mono text-[10px] text-ink-utility tracking-widest">TRAVEL PLANNER</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => navigate("/settings")}
              className="touch-target bg-paper-card border border-paper-line rounded-xl btn-press focus-ring"
              aria-label="Configurações"
            >
              <Gear weight="bold" className="text-ink-utility" />
            </button>
          </div>
        </header>

        {/* Next Trip - Departure Board */}
        {nextTrip && (
          <div className="stagger-item">
            <DepartureBoard
              destination={nextTrip.name}
              route={nextTrip.description}
              daysUntil={nextTrip.startDate ? Math.max(0, getDaysUntil(nextTrip.startDate)) : 0}
              departureDate={nextTrip.startDate ? formatDateShort(nextTrip.startDate) : "—"}
              returnDate={nextTrip.endDate ? formatDateShort(nextTrip.endDate) : "—"}
              duration={getTripDuration(nextTrip)}
              progress={getTripProgress(nextTrip)}
              onOpen={() => navigate(`/itinerary/${nextTrip.id}`)}
            />
          </div>
        )}

        {/* Other Trips */}
        {otherTrips.length > 0 && (
          <div className="stagger-item" style={{ animationDelay: "100ms" }}>
            <h3 className="font-mono text-[10px] text-ink-utility tracking-widest mb-3">
              OUTRAS VIAGENS
            </h3>
            <div className="space-y-3">
              {otherTrips.map((trip) => (
                <TicketStub
                  key={trip.id}
                  emoji={getCountryEmoji(trip.name)}
                  dateLabel={trip.startDate ? formatMonthYear(trip.startDate) : "—"}
                  title={trip.name}
                  meta={`${trip.days.length} dias · ${trip.items.length} itens`}
                  onClick={() => navigate(`/itinerary/${trip.id}`)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Create Trip Button */}
        <button
          onClick={() => setShowCreateDialog(true)}
          className="w-full py-4 bg-paper-card border-2 border-dashed border-paper-line rounded-xl hover:border-action-blue hover:bg-action-blue/5 btn-press focus-ring flex items-center justify-center gap-3 group stagger-item"
          style={{ animationDelay: "150ms" }}
          data-testid="create-trip-button"
        >
          <div className="w-12 h-12 bg-paper-line/50 rounded-full flex items-center justify-center group-hover:bg-action-blue/10 transition-colors duration-150">
            <Plus weight="bold" className="text-xl text-ink-utility group-hover:text-action-blue icon-rotate" />
          </div>
          <div className="text-left">
            <p className="font-body font-medium text-ink-primary">Criar Nova Viagem</p>
            <p className="font-body text-xs text-ink-secondary">Planeje sua próxima aventura</p>
          </div>
        </button>

        {/* Empty State */}
        {activeTrips.length === 0 && archivedTrips.length === 0 && (
          <div className="text-center py-8">
            <p className="text-ink-secondary font-body">Nenhuma viagem criada ainda.</p>
          </div>
        )}

        {/* Archived Trips */}
        {archivedTrips.length > 0 && (
          <div className="stagger-item" style={{ animationDelay: "200ms" }}>
            <h3 className="font-mono text-[10px] text-ink-utility tracking-widest mb-3">
              ARQUIVADAS
            </h3>
            <div className="space-y-3">
              {archivedTrips.map((trip) => (
                <TicketStub
                  key={trip.id}
                  emoji={getCountryEmoji(trip.name)}
                  dateLabel={trip.startDate ? formatMonthYear(trip.startDate) : "—"}
                  title={trip.name}
                  meta={`${trip.days.length} dias · ${trip.items.length} itens`}
                  completed
                  onClick={() => {
                    // Show options for archived trips
                  }}
                />
              ))}
            </div>
            <div className="mt-3 flex gap-2 justify-end">
              {archivedTrips.length > 0 && (
                <>
                  <button
                    onClick={() => restoreTrip(archivedTrips[0].id)}
                    className="px-3 py-1.5 text-xs font-mono text-ink-utility hover:bg-paper-line rounded-lg btn-press focus-ring flex items-center gap-1.5"
                  >
                    <Archive weight="bold" className="w-3.5 h-3.5" />
                    Restaurar
                  </button>
                  <button
                    onClick={() => setDeleteConfirm({ open: true, tripId: archivedTrips[0].id })}
                    className="px-3 py-1.5 text-xs font-mono text-stamp-brick hover:bg-stamp-brick/10 rounded-lg btn-press focus-ring flex items-center gap-1.5"
                  >
                    <Trash weight="bold" className="w-3.5 h-3.5" />
                    Deletar
                  </button>
                </>
              )}
            </div>
          </div>
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
  )
}
