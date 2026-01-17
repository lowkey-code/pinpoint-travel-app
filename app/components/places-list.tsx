"use client"

import { PlaceCard } from "~/components/place-card"
import type { Place } from "~/lib/types"

interface PlacesListProps {
  places: Place[]
  onDelete: (id: string) => void
  onUpdate: (id: string, updates: Partial<Place>) => void
}

export function PlacesList({ places, onDelete, onUpdate }: PlacesListProps) {
  return (
    <div className="mt-4 space-y-3" data-testid="places-list">
      {places.map((place) => (
        <PlaceCard key={place.id} place={place} onDelete={onDelete} onUpdate={onUpdate} />
      ))}
    </div>
  )
}
