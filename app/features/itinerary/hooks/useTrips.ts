import { useState, useEffect, useCallback, useMemo } from "react"
import type { Trip, ItineraryState, ExportedTrip } from "../lib/types"
import {
  loadState,
  saveStateDebounced,
  flushPendingWrites,
  generateId,
  exportTrip as exportTripToJson,
  importTrip as importTripFromJson,
  parseImportedTrip,
} from "../lib/storage"
import { createTrip } from "../lib/utils"

export interface UseTripsReturn {
  trips: Trip[]
  activeTripId: string | null
  activeTrip: Trip | null
  activeTrips: Trip[]
  archivedTrips: Trip[]
  isLoading: boolean
  createNewTrip: (name: string, partial?: Partial<Trip>) => Trip
  updateTrip: (tripId: string, updates: Partial<Trip>) => void
  deleteTrip: (tripId: string) => void
  archiveTrip: (tripId: string) => void
  restoreTrip: (tripId: string) => void
  duplicateTrip: (tripId: string, newName?: string) => Trip | null
  setActiveTrip: (tripId: string | null) => void
  exportTrip: (tripId: string) => ExportedTrip | null
  importTrip: (json: string) => Trip | null
}

export function useTrips(): UseTripsReturn {
  const [state, setState] = useState<ItineraryState | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loaded = loadState()
    setState(loaded)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (state && !isLoading) saveStateDebounced(state)
  }, [state, isLoading])

  useEffect(() => () => flushPendingWrites(), [])

  const trips = state?.trips ?? []
  const activeTripId = state?.activeTripId ?? null
  const activeTrip = useMemo(() => trips.find((t) => t.id === activeTripId) ?? null, [trips, activeTripId])
  const activeTrips = useMemo(() => trips.filter((t) => !t.archived), [trips])
  const archivedTrips = useMemo(() => trips.filter((t) => t.archived), [trips])

  const createNewTrip = useCallback((name: string, partial?: Partial<Trip>): Trip => {
    const newTrip = createTrip(name, partial)
    setState((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        trips: [...prev.trips, newTrip],
        activeTripId: newTrip.id,
        undoStacks: { ...prev.undoStacks, [newTrip.id]: { past: [], future: [] } },
      }
    })
    return newTrip
  }, [])

  const updateTrip = useCallback((tripId: string, updates: Partial<Trip>): void => {
    setState((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        trips: prev.trips.map((t) => (t.id === tripId ? { ...t, ...updates, updatedAt: Date.now() } : t)),
      }
    })
  }, [])

  const deleteTrip = useCallback((tripId: string): void => {
    setState((prev) => {
      if (!prev) return prev
      const newTrips = prev.trips.filter((t) => t.id !== tripId)
      const newUndoStacks = { ...prev.undoStacks }
      delete newUndoStacks[tripId]
      return {
        ...prev,
        trips: newTrips,
        activeTripId: prev.activeTripId === tripId ? (newTrips.find((t) => !t.archived)?.id ?? null) : prev.activeTripId,
        undoStacks: newUndoStacks,
      }
    })
  }, [])

  const archiveTrip = useCallback((tripId: string): void => {
    setState((prev) => {
      if (!prev) return prev
      const newTrips = prev.trips.map((t) => (t.id === tripId ? { ...t, archived: true, updatedAt: Date.now() } : t))
      return {
        ...prev,
        trips: newTrips,
        activeTripId: prev.activeTripId === tripId ? (newTrips.find((t) => !t.archived)?.id ?? null) : prev.activeTripId,
      }
    })
  }, [])

  const restoreTrip = useCallback((tripId: string): void => {
    updateTrip(tripId, { archived: false })
  }, [updateTrip])

  const duplicateTrip = useCallback((tripId: string, newName?: string): Trip | null => {
    const original = trips.find((t) => t.id === tripId)
    if (!original) return null
    const now = Date.now()
    const newTripId = generateId()
    const newTrip: Trip = {
      ...original,
      id: newTripId,
      name: newName ?? `${original.name} (cópia)`,
      items: original.items.map((item) => ({ ...item, id: generateId(), tripId: newTripId, createdAt: now, updatedAt: now })),
      createdAt: now,
      updatedAt: now,
      archived: false,
    }
    setState((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        trips: [...prev.trips, newTrip],
        undoStacks: { ...prev.undoStacks, [newTripId]: { past: [], future: [] } },
      }
    })
    return newTrip
  }, [trips])

  const setActiveTrip = useCallback((tripId: string | null): void => {
    setState((prev) => (prev ? { ...prev, activeTripId: tripId } : prev))
  }, [])

  const exportTripHandler = useCallback((tripId: string): ExportedTrip | null => {
    const trip = trips.find((t) => t.id === tripId)
    return trip ? exportTripToJson(trip) : null
  }, [trips])

  const importTripHandler = useCallback((json: string): Trip | null => {
    const exported = parseImportedTrip(json)
    if (!exported) return null
    const newTrip = importTripFromJson(exported, trips)
    setState((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        trips: [...prev.trips, newTrip],
        activeTripId: newTrip.id,
        undoStacks: { ...prev.undoStacks, [newTrip.id]: { past: [], future: [] } },
      }
    })
    return newTrip
  }, [trips])

  return {
    trips,
    activeTripId,
    activeTrip,
    activeTrips,
    archivedTrips,
    isLoading,
    createNewTrip,
    updateTrip,
    deleteTrip,
    archiveTrip,
    restoreTrip,
    duplicateTrip,
    setActiveTrip,
    exportTrip: exportTripHandler,
    importTrip: importTripHandler,
  }
}
