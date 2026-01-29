import { useNavigate } from "react-router"
import { useState, useMemo } from "react"
import { useTrips } from "~/features/itinerary"
import { List, Plus, ChartBar, Airplane } from "@phosphor-icons/react"
import { CreateTripDialog } from "~/features/itinerary/components/CreateTripDialog"
import {
  TripListSkeleton,
  DepartureBoard,
  InstallBanner,
  InstallInstructions,
  EmptyState,
  PerforatedDivider,
  Greeting,
  NextActivityCard,
  QuickActions,
} from "~/components/ui/folio"
import { ThemeToggle } from "~/components/ui/ThemeToggle"
import { usePWAInstall } from "~/hooks/use-pwa-install"
import type { Trip, ItineraryItem } from "~/features/itinerary/lib/types"
import { ITEM_TYPE_ICONS } from "~/features/itinerary"

function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00")
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }).toUpperCase()
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

function getNextActivity(trip: Trip): ItineraryItem | null {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  if (!trip.startDate) return trip.items.find(i => i.status === "planned") || null

  const startDate = new Date(trip.startDate + "T00:00:00")
  const daysDiff = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
  const currentDayIndex = Math.max(0, daysDiff)

  // Find first planned item from current day onwards
  const plannedItems = trip.items
    .filter(item => item.status === "planned" && item.dayIndex >= currentDayIndex)
    .sort((a, b) => {
      if (a.dayIndex !== b.dayIndex) return a.dayIndex - b.dayIndex
      const segmentOrder = { morning: 0, afternoon: 1, evening: 2 }
      return segmentOrder[a.segment] - segmentOrder[b.segment]
    })

  return plannedItems[0] || null
}

function getActivityTimeLabel(item: ItineraryItem, trip: Trip): string {
  if (!trip.startDate) return item.timeLabel || "Em breve"

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const startDate = new Date(trip.startDate + "T00:00:00")
  const daysDiff = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
  const currentDayIndex = Math.max(0, daysDiff)

  const daysUntilActivity = item.dayIndex - currentDayIndex

  let dayLabel = ""
  if (daysUntilActivity === 0) {
    dayLabel = "HOJE"
  } else if (daysUntilActivity === 1) {
    dayLabel = "AMANHÃ"
  } else {
    dayLabel = `EM ${daysUntilActivity} DIAS`
  }

  if (item.timeLabel) {
    return `${dayLabel} · ${item.timeLabel}`
  }

  const segmentLabels = { morning: "Manhã", afternoon: "Tarde", evening: "Noite" }
  return `${dayLabel} · ${segmentLabels[item.segment]}`
}

export default function Home() {
  const navigate = useNavigate()
  const { activeTrips, archivedTrips, isLoading, createNewTrip } = useTrips()

  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showInstallInstructions, setShowInstallInstructions] = useState(false)

  const { canInstall, isIOS, isMobile, hasNativePrompt, install, dismiss } = usePWAInstall()

  const handleInstall = async () => {
    if (hasNativePrompt && !isIOS) {
      await install()
    } else {
      setShowInstallInstructions(true)
    }
  }

  // Find hero trip (ongoing or next upcoming)
  const { heroTrip, heroStatus, heroCurrentDay, nextActivity } = useMemo(() => {
    if (activeTrips.length === 0) {
      return { heroTrip: null, heroStatus: "upcoming" as TripStatus, nextActivity: null }
    }

    // First, check for ongoing trips
    for (const trip of activeTrips) {
      const { status, currentDay } = getTripStatus(trip)
      if (status === "ongoing") {
        const activity = getNextActivity(trip)
        return { heroTrip: trip, heroStatus: status, heroCurrentDay: currentDay, nextActivity: activity }
      }
    }

    // No ongoing trips, find the next upcoming one
    const upcomingTrips = activeTrips
      .filter(t => t.startDate)
      .map(t => ({ trip: t, daysUntil: getDaysUntil(t.startDate!) }))
      .filter(t => t.daysUntil >= 0)
      .sort((a, b) => a.daysUntil - b.daysUntil)

    if (upcomingTrips.length > 0) {
      const next = upcomingTrips[0].trip
      const activity = getNextActivity(next)
      return { heroTrip: next, heroStatus: "upcoming" as TripStatus, nextActivity: activity }
    }

    // No upcoming trips with dates, use first active trip
    const firstTrip = activeTrips[0]
    const activity = getNextActivity(firstTrip)
    return {
      heroTrip: firstTrip,
      heroStatus: "upcoming" as TripStatus,
      nextActivity: activity,
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

  const hasAnyTrips = activeTrips.length > 0 || archivedTrips.length > 0

  // Quick actions config
  const quickActions = [
    {
      icon: <List weight="bold" className="w-5 h-5 text-ink-utility group-hover:text-action-blue transition-colors" />,
      label: "Viagens",
      href: "/itinerary",
    },
    {
      icon: <Plus weight="bold" className="w-5 h-5 text-ink-utility group-hover:text-action-blue transition-colors" />,
      label: "Nova",
      onClick: () => setShowCreateDialog(true),
    },
    {
      icon: <ChartBar weight="bold" className="w-5 h-5 text-ink-utility group-hover:text-action-blue transition-colors" />,
      label: "Stats",
      href: "/settings",
    },
  ]

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
            <ThemeToggle />
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

          {/* Greeting */}
          <Greeting className="stagger-item" />

          {/* Empty State */}
          {!hasAnyTrips && (
            <EmptyState onCreateTrip={() => setShowCreateDialog(true)} />
          )}

          {/* Hero Trip - Departure Board */}
          {heroTrip && (
            <div className="stagger-item" style={{ animationDelay: "50ms" }}>
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

          {/* Next Activity Preview */}
          {heroTrip && nextActivity && (
            <div className="stagger-item" style={{ animationDelay: "100ms" }}>
              <PerforatedDivider className="mb-4" />

              <h3 className="font-mono text-[10px] text-ink-utility tracking-widest mb-3">
                PRÓXIMA ATIVIDADE
              </h3>

              <NextActivityCard
                icon={nextActivity.icon || ITEM_TYPE_ICONS[nextActivity.itemType]}
                title={nextActivity.title || "Sem título"}
                location={nextActivity.city}
                timeLabel={getActivityTimeLabel(nextActivity, heroTrip)}
                durationText={nextActivity.durationText}
                onClick={() => navigate(`/itinerary/${heroTrip.id}`)}
              />
            </div>
          )}

          {/* Quick Actions */}
          {hasAnyTrips && (
            <div className="stagger-item" style={{ animationDelay: "150ms" }}>
              <PerforatedDivider className="mb-4" />

              <h3 className="font-mono text-[10px] text-ink-utility tracking-widest mb-3">
                ATALHOS
              </h3>

              <QuickActions actions={quickActions} />
            </div>
          )}
        </section>

        <CreateTripDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
          onCreate={handleCreateTrip}
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
