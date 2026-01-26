import { useState, useEffect, useCallback, useMemo } from "react"
import type { Trip, ItineraryItem, Day, Segment, UndoStack, ItineraryState } from "../lib/types"
import { loadState, saveStateDebounced, flushPendingWrites } from "../lib/storage"
import { createItem, createDay, reindexDays, updateItemDayIndices } from "../lib/utils"
import { useUndoRedo, applyUndoAction, applyRedoAction } from "./useUndoRedo"

export interface UseActiveTripReturn {
  trip: Trip | null
  items: ItineraryItem[]
  days: Day[]
  isLoading: boolean
  addItem: (dayIndex: number, segment: Segment, data: Partial<ItineraryItem>) => ItineraryItem
  updateItem: (itemId: string, updates: Partial<ItineraryItem>) => void
  deleteItem: (itemId: string) => void
  moveItem: (itemId: string, toDay: number, toSegment: Segment) => void
  convertQuickToActivity: (itemId: string) => void
  addDay: (date?: string) => Day
  deleteDay: (dayIndex: number) => void
  updateDay: (dayIndex: number, updates: Partial<Day>) => void
  canUndo: boolean
  canRedo: boolean
  undo: () => void
  redo: () => void
  refresh: () => void
}

export function useActiveTrip(): UseActiveTripReturn {
  const [state, setState] = useState<ItineraryState | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setState(loadState())
    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (state && !isLoading) saveStateDebounced(state)
  }, [state, isLoading])

  useEffect(() => () => flushPendingWrites(), [])

  const activeTripId = state?.activeTripId ?? null
  const trip = useMemo(() => state?.trips.find((t) => t.id === activeTripId) ?? null, [state?.trips, activeTripId])
  const items = trip?.items ?? []
  const days = trip?.days ?? []

  const undoStack: UndoStack = useMemo(() => {
    if (!activeTripId || !state?.undoStacks) return { past: [], future: [] }
    return state.undoStacks[activeTripId] ?? { past: [], future: [] }
  }, [activeTripId, state?.undoStacks])

  const onStackChange = useCallback((newStack: UndoStack) => {
    if (!activeTripId) return
    setState((prev) => prev ? { ...prev, undoStacks: { ...prev.undoStacks, [activeTripId]: newStack } } : prev)
  }, [activeTripId])

  const { canUndo, canRedo, pushAction, undo: undoAction, redo: redoAction } = useUndoRedo({ undoStack, onStackChange })

  const updateActiveTrip = useCallback((updater: (trip: Trip) => Trip) => {
    if (!activeTripId) return
    setState((prev) => prev ? { ...prev, trips: prev.trips.map((t) => (t.id === activeTripId ? updater(t) : t)) } : prev)
  }, [activeTripId])

  const addItem = useCallback((dayIndex: number, segment: Segment, data: Partial<ItineraryItem>): ItineraryItem => {
    if (!activeTripId) throw new Error("No active trip")
    const newItem = createItem(activeTripId, dayIndex, segment, data)
    pushAction({ type: "ADD_ITEM", item: newItem })
    updateActiveTrip((t) => ({ ...t, items: [...t.items, newItem], updatedAt: Date.now() }))
    return newItem
  }, [activeTripId, pushAction, updateActiveTrip])

  const updateItem = useCallback((itemId: string, updates: Partial<ItineraryItem>): void => {
    if (!trip) return
    const existing = trip.items.find((i) => i.id === itemId)
    if (!existing) return
    const updated = { ...existing, ...updates, updatedAt: Date.now() }
    pushAction({ type: "UPDATE_ITEM", before: existing, after: updated })
    updateActiveTrip((t) => ({ ...t, items: t.items.map((i) => (i.id === itemId ? updated : i)), updatedAt: Date.now() }))
  }, [trip, pushAction, updateActiveTrip])

  const deleteItem = useCallback((itemId: string): void => {
    if (!trip) return
    const existing = trip.items.find((i) => i.id === itemId)
    if (!existing) return
    pushAction({ type: "DELETE_ITEM", item: existing })
    updateActiveTrip((t) => ({ ...t, items: t.items.filter((i) => i.id !== itemId), updatedAt: Date.now() }))
  }, [trip, pushAction, updateActiveTrip])

  const moveItem = useCallback((itemId: string, toDay: number, toSegment: Segment): void => {
    if (!trip) return
    const existing = trip.items.find((i) => i.id === itemId)
    if (!existing) return
    pushAction({ type: "MOVE_ITEM", itemId, fromDay: existing.dayIndex, fromSegment: existing.segment, toDay, toSegment })
    updateActiveTrip((t) => ({
      ...t,
      items: t.items.map((i) => (i.id === itemId ? { ...i, dayIndex: toDay, segment: toSegment, updatedAt: Date.now() } : i)),
      updatedAt: Date.now(),
    }))
  }, [trip, pushAction, updateActiveTrip])

  const convertQuickToActivity = useCallback((itemId: string): void => {
    if (!trip) return
    const existing = trip.items.find((i) => i.id === itemId)
    if (!existing || existing.itemType !== "quick") return
    const updated = { ...existing, itemType: "activity" as const, updatedAt: Date.now() }
    pushAction({ type: "UPDATE_ITEM", before: existing, after: updated })
    updateActiveTrip((t) => ({ ...t, items: t.items.map((i) => (i.id === itemId ? updated : i)), updatedAt: Date.now() }))
  }, [trip, pushAction, updateActiveTrip])

  const addDay = useCallback((date?: string): Day => {
    if (!trip) throw new Error("No active trip")
    const newDay = createDay(trip.days.length, date)
    pushAction({ type: "ADD_DAY", day: newDay })
    updateActiveTrip((t) => ({ ...t, days: [...t.days, newDay], updatedAt: Date.now() }))
    return newDay
  }, [trip, pushAction, updateActiveTrip])

  const deleteDay = useCallback((dayIndex: number): void => {
    if (!trip || trip.days.length <= 1) return
    const itemsInDay = trip.items.filter((i) => i.dayIndex === dayIndex)
    pushAction({ type: "DELETE_DAY", dayIndex, items: itemsInDay })
    updateActiveTrip((t) => ({
      ...t,
      days: reindexDays(t.days.filter((d) => d.index !== dayIndex)),
      items: updateItemDayIndices(t.items, dayIndex),
      updatedAt: Date.now(),
    }))
  }, [trip, pushAction, updateActiveTrip])

  const updateDay = useCallback((dayIndex: number, updates: Partial<Day>): void => {
    updateActiveTrip((t) => ({
      ...t,
      days: t.days.map((d) => (d.index === dayIndex ? { ...d, ...updates } : d)),
      updatedAt: Date.now(),
    }))
  }, [updateActiveTrip])

  const undo = useCallback((): void => {
    const action = undoAction()
    if (!action || !trip) return
    updateActiveTrip(() => applyUndoAction(trip, action))
  }, [undoAction, trip, updateActiveTrip])

  const redo = useCallback((): void => {
    const action = redoAction()
    if (!action || !trip) return
    updateActiveTrip(() => applyRedoAction(trip, action))
  }, [redoAction, trip, updateActiveTrip])

  const refresh = useCallback((): void => setState(loadState()), [])

  return { trip, items, days, isLoading, addItem, updateItem, deleteItem, moveItem, convertQuickToActivity, addDay, deleteDay, updateDay, canUndo, canRedo, undo, redo, refresh }
}
