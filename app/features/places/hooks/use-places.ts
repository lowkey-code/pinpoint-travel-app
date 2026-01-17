"use client"

import { useState, useEffect, useCallback } from "react"
import type { Place } from "~/features/places/lib/types"

const STORAGE_KEY = "pinpoint_places"

export function usePlaces() {
  const [places, setPlaces] = useState<Place[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load places from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as Place[]
        // Sort by most recent first
        setPlaces(parsed.sort((a, b) => b.createdAt - a.createdAt))
      }
    } catch (err) {
      console.error("Failed to load places:", err)
    }
    setIsLoaded(true)
  }, [])

  // Save places to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(places))
      } catch (err) {
        console.error("Failed to save places:", err)
      }
    }
  }, [places, isLoaded])

  const addPlace = useCallback((place: Omit<Place, "id" | "createdAt">) => {
    const newPlace: Place = {
      ...place,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    }
    setPlaces((prev) => [newPlace, ...prev])
  }, [])

  const deletePlace = useCallback((id: string) => {
    setPlaces((prev) => prev.filter((p) => p.id !== id))
  }, [])

  const updatePlace = useCallback((id: string, updates: Partial<Place>) => {
    setPlaces((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)))
  }, [])

  return {
    places,
    addPlace,
    deletePlace,
    updatePlace,
    isLoaded,
  }
}
