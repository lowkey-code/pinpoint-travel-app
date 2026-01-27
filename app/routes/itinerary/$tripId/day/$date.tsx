import { useParams, Navigate } from "react-router"
import { useTrips } from "~/features/itinerary"
import { DayViewSkeleton } from "~/components/ui/folio"

// This route can be used for deep-linking to specific days
// For now, redirect to main trip view and let DayView handle the day selection
export default function TripDayDetail() {
  const { tripId } = useParams()
  const { trips, isLoading } = useTrips()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-paper-base">
        <div className="container max-w-6xl mx-auto px-4 py-6">
          <DayViewSkeleton />
        </div>
      </div>
    )
  }

  const trip = trips.find((t) => t.id === tripId)

  if (!trip) {
    return <Navigate to="/itinerary" replace />
  }

  // For now, redirect to main trip view
  // TODO: Add state parameter to pre-select the day
  return <Navigate to={`/itinerary/${tripId}`} replace />
}
