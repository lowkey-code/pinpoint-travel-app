import { useParams, Navigate } from "react-router"
import { useTrips, ItineraryProvider } from "~/features/itinerary"
import { GridView } from "~/features/itinerary/components/GridView"
import { GridViewSkeleton } from "~/components/ui/folio"

export default function TripGrid() {
  const { tripId } = useParams()
  const { trips, isLoading } = useTrips()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-paper-base pb-20">
        <div className="container max-w-6xl mx-auto px-4 py-6">
          <GridViewSkeleton />
        </div>
      </div>
    )
  }

  const trip = trips.find((t) => t.id === tripId)

  if (!trip) {
    return <Navigate to="/itinerary" replace />
  }

  return (
    <ItineraryProvider tripId={trip.id}>
      <div className="min-h-screen bg-paper-base pb-20">
        <main className="container max-w-6xl mx-auto px-4 pt-4">
          <GridView tripId={trip.id} />
        </main>
      </div>
    </ItineraryProvider>
  )
}
