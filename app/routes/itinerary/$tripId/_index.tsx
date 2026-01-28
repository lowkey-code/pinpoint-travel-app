import { useParams, Navigate, useSearchParams } from "react-router"
import { useTrips, ItineraryProvider } from "~/features/itinerary"
import { DayView } from "~/features/itinerary/components/DayView"
import { DayViewSkeleton } from "~/components/ui/folio"

export default function TripDetail() {
  const { tripId } = useParams()
  const [searchParams] = useSearchParams()
  const { trips, isLoading } = useTrips()

  // Get initial day from URL query param (for navigation from grid view)
  const initialDay = searchParams.get("day")
    ? parseInt(searchParams.get("day")!, 10)
    : 0

  if (isLoading) {
    return (
      <div className="min-h-screen bg-paper-base pb-20">
        <div className="container max-w-6xl mx-auto">
          <DayViewSkeleton />
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
        <main className="container max-w-6xl mx-auto pt-4">
          <DayView initialDayIndex={initialDay} tripId={trip.id} />
        </main>
      </div>
    </ItineraryProvider>
  )
}
