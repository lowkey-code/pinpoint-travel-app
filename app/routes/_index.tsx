import { useNavigate } from "react-router"
import { useState, useMemo } from "react"
import { useTrips } from "~/features/itinerary"
import { Plus, Bug, ArrowCounterClockwise, Trash, Archive } from "@phosphor-icons/react"
import { CreateTripDialog } from "~/features/itinerary/components/CreateTripDialog"
import { ConfirmDialog } from "~/components/ui/ConfirmDialog"
import {
  TripListSkeleton,
  DepartureBoard,
  TicketStub,
  InstallBanner,
  InstallInstructions,
  EmptyState,
  PerforatedDivider,
} from "~/components/ui/folio"
import { ThemeToggle } from "~/components/ui/ThemeToggle"
import { usePWAInstall } from "~/hooks/use-pwa-install"
import type { Trip } from "~/features/itinerary/lib/types"

function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00")
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }).toUpperCase()
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

function getTripDuration(trip: Trip): number {
  if (trip.startDate && trip.endDate) {
    const start = new Date(trip.startDate + "T00:00:00")
    const end = new Date(trip.endDate + "T00:00:00")
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
  }
  return trip.days.length
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
  if (lower.includes("tailândia") || lower.includes("thailand") || lower.includes("bangkok")) return "🇹🇭"
  if (lower.includes("coreia") || lower.includes("korea") || lower.includes("seul")) return "🇰🇷"
  return "✈️"
}

type TripStatus = "upcoming" | "ongoing" | "completed"

function getTripStatus(trip: Trip): { status: TripStatus; daysUntil: number; currentDay?: number } {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  if (!trip.startDate) {
    return { status: "upcoming", daysUntil: 0 }
  }

  const startDate = new Date(trip.startDate + "T00:00:00")
  const endDate = trip.endDate ? new Date(trip.endDate + "T00:00:00") : null

  const daysUntil = getDaysUntil(trip.startDate)

  if (today < startDate) {
    return { status: "upcoming", daysUntil }
  }

  if (endDate && today > endDate) {
    return { status: "completed", daysUntil: 0 }
  }

  const daysDiff = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
  const currentDay = daysDiff + 1

  return { status: "ongoing", daysUntil: 0, currentDay }
}

export default function Home() {
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
  const [showInstallInstructions, setShowInstallInstructions] = useState(false)

  const { canInstall, isIOS, isMobile, hasNativePrompt, install, dismiss } = usePWAInstall()

  const handleInstall = async () => {
    if (hasNativePrompt && !isIOS) {
      await install()
    } else {
      setShowInstallInstructions(true)
    }
  }

  const { heroTrip, otherTrips, heroStatus, heroCurrentDay } = useMemo(() => {
    if (activeTrips.length === 0) {
      return { heroTrip: null, otherTrips: [], heroStatus: "upcoming" as TripStatus }
    }

    for (const trip of activeTrips) {
      const { status, currentDay } = getTripStatus(trip)
      if (status === "ongoing") {
        const others = activeTrips.filter(t => t.id !== trip.id)
        return { heroTrip: trip, otherTrips: others, heroStatus: status, heroCurrentDay: currentDay }
      }
    }

    const upcomingTrips = activeTrips
      .filter(t => t.startDate)
      .map(t => ({ trip: t, daysUntil: getDaysUntil(t.startDate!) }))
      .filter(t => t.daysUntil >= 0)
      .sort((a, b) => a.daysUntil - b.daysUntil)

    if (upcomingTrips.length > 0) {
      const next = upcomingTrips[0].trip
      const others = activeTrips.filter(t => t.id !== next.id)
      return { heroTrip: next, otherTrips: others, heroStatus: "upcoming" as TripStatus }
    }

    return {
      heroTrip: activeTrips[0],
      otherTrips: activeTrips.slice(1),
      heroStatus: "upcoming" as TripStatus,
    }
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

  const hasAnyTrips = activeTrips.length > 0 || archivedTrips.length > 0

  if (isLoading) {
    return <TripListSkeleton />
  }

  return (
    <div className="min-h-screen bg-paper-base">
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
            <div className="flex items-center gap-1">
              <ThemeToggle />
              <a
                href="https://github.com/antropic/folio/issues/new"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-ink-utility/50 hover:text-ink-utility hover:bg-paper-line/50 rounded-lg transition-colors focus-ring"
                aria-label="Relatar bug"
                title="Relatar bug"
              >
                <Bug weight="bold" className="w-4 h-4" />
              </a>
            </div>
          </header>

          {/* Install PWA Banner */}
          {canInstall && (
            <InstallBanner
              isIOS={isIOS}
              hasNativePrompt={hasNativePrompt}
              onInstall={handleInstall}
              onDismiss={dismiss}
            />
          )}

          {/* Empty State */}
          {!hasAnyTrips && (
            <EmptyState onCreateTrip={() => setShowCreateDialog(true)} />
          )}

          {/* Hero Trip - Departure Board */}
          {heroTrip && (
            <div className="stagger-item">
              <DepartureBoard
                destination={heroTrip.name}
                route={heroTrip.description}
                status={heroStatus}
                daysUntil={heroTrip.startDate ? Math.max(0, getDaysUntil(heroTrip.startDate)) : 0}
                currentDay={heroCurrentDay}
                totalDays={getTripDuration(heroTrip)}
                departureDate={heroTrip.startDate ? formatDateShort(heroTrip.startDate) : "—"}
                returnDate={heroTrip.endDate ? formatDateShort(heroTrip.endDate) : "—"}
                duration={`${getTripDuration(heroTrip)} DIAS`}
                progress={getTripProgress(heroTrip)}
                onOpen={() => navigate(`/itinerary/${heroTrip.id}`)}
              />
            </div>
          )}

          {/* Other Trips */}
          {otherTrips.length > 0 && (
            <div className="stagger-item" style={{ animationDelay: "100ms" }}>
              <PerforatedDivider className="mb-4" />

              <h3 className="font-mono text-[10px] text-ink-utility tracking-widest mb-3">
                SUAS JORNADAS
              </h3>
              <div className="space-y-3">
                {otherTrips.map((trip) => (
                  <TicketStub
                    key={trip.id}
                    emoji={getCountryEmoji(trip.name)}
                    dateLabel={trip.startDate ? formatMonthYear(trip.startDate) : "—"}
                    title={trip.name}
                    meta={`${getTripDuration(trip)} dias · ${trip.items.length} itens`}
                    onClick={() => navigate(`/itinerary/${trip.id}`)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Create Trip Button */}
          {hasAnyTrips && (
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
                <p className="font-body font-medium text-ink-primary">Planejar Nova Viagem</p>
                <p className="font-body text-xs text-ink-secondary">Sua próxima aventura começa aqui</p>
              </div>
            </button>
          )}

          {/* Archived Trips */}
          {archivedTrips.length > 0 && (
            <div className="stagger-item" style={{ animationDelay: "200ms" }}>
              <PerforatedDivider className="mb-4" />

              <details className="group">
                <summary className="flex items-center gap-2 cursor-pointer list-none font-mono text-[10px] text-ink-utility tracking-widest mb-3 hover:text-ink-secondary transition-colors">
                  <Archive weight="bold" className="w-3.5 h-3.5" />
                  <span>MEMÓRIAS ({archivedTrips.length})</span>
                  <span className="ml-auto text-ink-utility/50 group-open:rotate-90 transition-transform">▶</span>
                </summary>

                <div className="space-y-3 mt-3">
                  {archivedTrips.map((trip) => (
                    <div key={trip.id} className="relative">
                      <TicketStub
                        emoji={getCountryEmoji(trip.name)}
                        dateLabel={trip.startDate ? formatMonthYear(trip.startDate) : "—"}
                        title={trip.name}
                        meta={`${getTripDuration(trip)} dias · ${trip.items.length} itens`}
                        completed
                        onClick={() => navigate(`/itinerary/${trip.id}`)}
                      />
                      <div className="flex gap-2 justify-end mt-2">
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

        <InstallInstructions
          open={showInstallInstructions}
          onClose={() => setShowInstallInstructions(false)}
          isIOS={isIOS}
          isMobile={isMobile}
        />
      </div>
    </div>
  )
}
