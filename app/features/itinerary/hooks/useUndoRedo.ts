import { useCallback } from "react"
import type { UndoAction, UndoStack, Trip, Segment } from "../lib/types"
import { MAX_UNDO_STEPS } from "../lib/constants"

export interface UseUndoRedoReturn {
  canUndo: boolean
  canRedo: boolean
  undoCount: number
  redoCount: number
  pushAction: (action: UndoAction) => void
  undo: () => UndoAction | null
  redo: () => UndoAction | null
  clearHistory: () => void
}

export interface UseUndoRedoOptions {
  undoStack: UndoStack
  onStackChange: (stack: UndoStack) => void
}

export function useUndoRedo({ undoStack, onStackChange }: UseUndoRedoOptions): UseUndoRedoReturn {
  const canUndo = undoStack.past.length > 0
  const canRedo = undoStack.future.length > 0

  const pushAction = useCallback(
    (action: UndoAction): void => {
      const newPast = [...undoStack.past, action].slice(-MAX_UNDO_STEPS)
      onStackChange({ past: newPast, future: [] })
    },
    [undoStack.past, onStackChange]
  )

  const undo = useCallback((): UndoAction | null => {
    if (undoStack.past.length === 0) return null
    const newPast = [...undoStack.past]
    const action = newPast.pop()!
    const newFuture = [action, ...undoStack.future].slice(0, MAX_UNDO_STEPS)
    onStackChange({ past: newPast, future: newFuture })
    return action
  }, [undoStack, onStackChange])

  const redo = useCallback((): UndoAction | null => {
    if (undoStack.future.length === 0) return null
    const newFuture = [...undoStack.future]
    const action = newFuture.shift()!
    const newPast = [...undoStack.past, action].slice(-MAX_UNDO_STEPS)
    onStackChange({ past: newPast, future: newFuture })
    return action
  }, [undoStack, onStackChange])

  const clearHistory = useCallback((): void => {
    onStackChange({ past: [], future: [] })
  }, [onStackChange])

  return {
    canUndo,
    canRedo,
    undoCount: undoStack.past.length,
    redoCount: undoStack.future.length,
    pushAction,
    undo,
    redo,
    clearHistory,
  }
}

// Apply undo action to trip
export function applyUndoAction(trip: Trip, action: UndoAction): Trip {
  const now = Date.now()
  switch (action.type) {
    case "ADD_ITEM":
      return { ...trip, items: trip.items.filter((i) => i.id !== action.item.id), updatedAt: now }
    case "UPDATE_ITEM":
      return {
        ...trip,
        items: trip.items.map((i) => (i.id === action.before.id ? { ...action.before, updatedAt: now } : i)),
        updatedAt: now,
      }
    case "DELETE_ITEM":
      return { ...trip, items: [...trip.items, { ...action.item, updatedAt: now }], updatedAt: now }
    case "MOVE_ITEM":
      return {
        ...trip,
        items: trip.items.map((i) =>
          i.id === action.itemId
            ? { ...i, dayIndex: action.fromDay, segment: action.fromSegment, updatedAt: now }
            : i
        ),
        updatedAt: now,
      }
    case "ADD_DAY": {
      const filtered = trip.days.filter((d) => d.index !== action.day.index)
      return {
        ...trip,
        days: filtered.map((d, idx) => ({ ...d, index: idx })),
        items: trip.items
          .filter((i) => i.dayIndex !== action.day.index)
          .map((i) => ({
            ...i,
            dayIndex: i.dayIndex > action.day.index ? i.dayIndex - 1 : i.dayIndex,
            updatedAt: now,
          })),
        updatedAt: now,
      }
    }
    case "DELETE_DAY": {
      const restored = [...trip.days]
      restored.splice(action.dayIndex, 0, { index: action.dayIndex, label: `Dia ${action.dayIndex + 1}` })
      return {
        ...trip,
        days: restored.map((d, idx) => ({ ...d, index: idx })),
        items: [
          ...trip.items.map((i) => ({
            ...i,
            dayIndex: i.dayIndex >= action.dayIndex ? i.dayIndex + 1 : i.dayIndex,
            updatedAt: now,
          })),
          ...action.items.map((i) => ({ ...i, updatedAt: now })),
        ],
        updatedAt: now,
      }
    }
    case "UPDATE_TRIP":
      return { ...trip, ...action.before, updatedAt: now }
    default:
      return trip
  }
}

// Apply redo action to trip
export function applyRedoAction(trip: Trip, action: UndoAction): Trip {
  const now = Date.now()
  switch (action.type) {
    case "ADD_ITEM":
      return { ...trip, items: [...trip.items, { ...action.item, updatedAt: now }], updatedAt: now }
    case "UPDATE_ITEM":
      return {
        ...trip,
        items: trip.items.map((i) => (i.id === action.after.id ? { ...action.after, updatedAt: now } : i)),
        updatedAt: now,
      }
    case "DELETE_ITEM":
      return { ...trip, items: trip.items.filter((i) => i.id !== action.item.id), updatedAt: now }
    case "MOVE_ITEM":
      return {
        ...trip,
        items: trip.items.map((i) =>
          i.id === action.itemId
            ? { ...i, dayIndex: action.toDay, segment: action.toSegment, updatedAt: now }
            : i
        ),
        updatedAt: now,
      }
    case "ADD_DAY": {
      const newDays = [...trip.days]
      newDays.splice(action.day.index, 0, action.day)
      return {
        ...trip,
        days: newDays.map((d, idx) => ({ ...d, index: idx })),
        items: trip.items.map((i) => ({
          ...i,
          dayIndex: i.dayIndex >= action.day.index ? i.dayIndex + 1 : i.dayIndex,
          updatedAt: now,
        })),
        updatedAt: now,
      }
    }
    case "DELETE_DAY": {
      const filtered = trip.days.filter((d) => d.index !== action.dayIndex)
      return {
        ...trip,
        days: filtered.map((d, idx) => ({ ...d, index: idx })),
        items: trip.items
          .filter((i) => i.dayIndex !== action.dayIndex)
          .map((i) => ({
            ...i,
            dayIndex: i.dayIndex > action.dayIndex ? i.dayIndex - 1 : i.dayIndex,
            updatedAt: now,
          })),
        updatedAt: now,
      }
    }
    case "UPDATE_TRIP":
      return { ...trip, ...action.after, updatedAt: now }
    default:
      return trip
  }
}
