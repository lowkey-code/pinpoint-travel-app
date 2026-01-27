import { useParams, Link, Navigate } from "react-router"
import { useTrips, ItineraryProvider } from "~/features/itinerary"
import { ArrowLeft, Calendar, Grid3x3 } from "lucide-react"
import { GridView } from "~/features/itinerary/components/GridView"
import { UndoRedoBar } from "~/features/itinerary/components/UndoRedoBar"
import { ExportImport } from "~/features/itinerary/components/ExportImport"
import { ThemeToggle } from "~/components/ui/ThemeToggle"

export default function TripGrid() {
  const { tripId } = useParams()
  const { trips, isLoading } = useTrips()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    )
  }

  const trip = trips.find((t) => t.id === tripId)

  if (!trip) {
    return <Navigate to="/itinerary" replace />
  }

  return (
    <ItineraryProvider tripId={trip.id}>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
          <div className="container max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Link
                  to="/itinerary"
                  className="p-2 hover:bg-secondary rounded-lg transition-colors"
                  aria-label="Voltar"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                  <h1 className="text-xl font-serif font-bold">{trip.name}</h1>
                  {trip.description && (
                    <p className="text-sm text-muted-foreground">{trip.description}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <ThemeToggle />
                <ExportImport tripId={trip.id} />
                <UndoRedoBar />
              </div>
            </div>

            {/* View tabs */}
            <nav className="flex gap-2 mt-4">
              <Link
                to={`/itinerary/${tripId}`}
                className="px-4 py-2 rounded-lg hover:bg-secondary text-foreground font-medium"
              >
                <Calendar className="w-4 h-4 inline mr-2" />
                Dia a Dia
              </Link>
              <Link
                to={`/itinerary/${tripId}/grid`}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium"
              >
                <Grid3x3 className="w-4 h-4 inline mr-2" />
                Grade
              </Link>
            </nav>
          </div>
        </header>

        {/* Content */}
        <main className="container max-w-6xl mx-auto px-4 py-6">
          <GridView />
        </main>
      </div>
    </ItineraryProvider>
  )
}
