import { useParams, Navigate } from "react-router"
import { useTrips } from "~/features/itinerary"

// This route can be used for deep-linking to specific days
// For now, redirect to main trip view and let DayView handle the day selection
export default function TripDayDetail() {
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

  // For now, redirect to main trip view
  // TODO: Add state parameter to pre-select the day
  return <Navigate to={`/itinerary/${tripId}`} replace />
}
