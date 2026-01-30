import { describe, it, expect, vi } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { useUndoRedo, applyUndoAction, applyRedoAction } from "~/features/itinerary/hooks/useUndoRedo"
import type { Trip, ItineraryItem, UndoAction, UndoStack, Day } from "~/features/itinerary/lib/types"
import { MAX_UNDO_STEPS } from "~/features/itinerary/lib/constants"

// Helper to create a minimal valid trip
function createTestTrip(overrides: Partial<Trip> = {}): Trip {
  return {
    id: "trip-1",
    name: "Test Trip",
    days: [
      { index: 0, date: "2026-03-15" },
      { index: 1, date: "2026-03-16" },
    ],
    items: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
    archived: false,
    ...overrides,
  }
}

// Helper to create a minimal valid item
function createTestItem(overrides: Partial<ItineraryItem> = {}): ItineraryItem {
  return {
    id: "item-1",
    tripId: "trip-1",
    dayIndex: 0,
    segment: "morning",
    itemType: "activity",
    title: "Test Activity",
    status: "planned",
    priority: 0,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    ...overrides,
  }
}

describe("useUndoRedo hook", () => {
  const createHookProps = (stack: Partial<UndoStack> = {}) => {
    const undoStack: UndoStack = { past: [], future: [], ...stack }
    const onStackChange = vi.fn()
    return { undoStack, onStackChange }
  }

  describe("initial state", () => {
    it("returns canUndo false when past is empty", () => {
      const props = createHookProps({ past: [] })
      const { result } = renderHook(() => useUndoRedo(props))

      expect(result.current.canUndo).toBe(false)
    })

    it("returns canUndo true when past has actions", () => {
      const action: UndoAction = { type: "ADD_ITEM", item: createTestItem() }
      const props = createHookProps({ past: [action] })
      const { result } = renderHook(() => useUndoRedo(props))

      expect(result.current.canUndo).toBe(true)
    })

    it("returns canRedo false when future is empty", () => {
      const props = createHookProps({ future: [] })
      const { result } = renderHook(() => useUndoRedo(props))

      expect(result.current.canRedo).toBe(false)
    })

    it("returns canRedo true when future has actions", () => {
      const action: UndoAction = { type: "ADD_ITEM", item: createTestItem() }
      const props = createHookProps({ future: [action] })
      const { result } = renderHook(() => useUndoRedo(props))

      expect(result.current.canRedo).toBe(true)
    })

    it("returns correct undo count", () => {
      const action: UndoAction = { type: "ADD_ITEM", item: createTestItem() }
      const props = createHookProps({ past: [action, action, action] })
      const { result } = renderHook(() => useUndoRedo(props))

      expect(result.current.undoCount).toBe(3)
    })

    it("returns correct redo count", () => {
      const action: UndoAction = { type: "ADD_ITEM", item: createTestItem() }
      const props = createHookProps({ future: [action, action] })
      const { result } = renderHook(() => useUndoRedo(props))

      expect(result.current.redoCount).toBe(2)
    })
  })

  describe("pushAction", () => {
    it("adds action to past and clears future", () => {
      const existingAction: UndoAction = { type: "ADD_ITEM", item: createTestItem({ id: "old" }) }
      const newAction: UndoAction = { type: "ADD_ITEM", item: createTestItem({ id: "new" }) }
      const props = createHookProps({ past: [existingAction], future: [existingAction] })
      const { result } = renderHook(() => useUndoRedo(props))

      act(() => {
        result.current.pushAction(newAction)
      })

      expect(props.onStackChange).toHaveBeenCalledWith({
        past: [existingAction, newAction],
        future: [],
      })
    })

    it("limits past to MAX_UNDO_STEPS", () => {
      const actions = Array.from({ length: MAX_UNDO_STEPS + 5 }, (_, i) => ({
        type: "ADD_ITEM" as const,
        item: createTestItem({ id: `item-${i}` }),
      }))
      const props = createHookProps({ past: actions.slice(0, -1) })
      const { result } = renderHook(() => useUndoRedo(props))

      act(() => {
        result.current.pushAction(actions[actions.length - 1])
      })

      const call = props.onStackChange.mock.calls[0][0]
      expect(call.past.length).toBe(MAX_UNDO_STEPS)
    })
  })

  describe("undo", () => {
    it("returns null when past is empty", () => {
      const props = createHookProps({ past: [] })
      const { result } = renderHook(() => useUndoRedo(props))

      let action: UndoAction | null = null
      act(() => {
        action = result.current.undo()
      })

      expect(action).toBeNull()
      expect(props.onStackChange).not.toHaveBeenCalled()
    })

    it("moves action from past to future", () => {
      const action1: UndoAction = { type: "ADD_ITEM", item: createTestItem({ id: "1" }) }
      const action2: UndoAction = { type: "ADD_ITEM", item: createTestItem({ id: "2" }) }
      const props = createHookProps({ past: [action1, action2], future: [] })
      const { result } = renderHook(() => useUndoRedo(props))

      let returned: UndoAction | null = null
      act(() => {
        returned = result.current.undo()
      })

      expect(returned).toEqual(action2) // Last action in past
      expect(props.onStackChange).toHaveBeenCalledWith({
        past: [action1],
        future: [action2],
      })
    })

    it("prepends to existing future", () => {
      const pastAction: UndoAction = { type: "ADD_ITEM", item: createTestItem({ id: "past" }) }
      const futureAction: UndoAction = { type: "ADD_ITEM", item: createTestItem({ id: "future" }) }
      const props = createHookProps({ past: [pastAction], future: [futureAction] })
      const { result } = renderHook(() => useUndoRedo(props))

      act(() => {
        result.current.undo()
      })

      expect(props.onStackChange).toHaveBeenCalledWith({
        past: [],
        future: [pastAction, futureAction],
      })
    })

    it("limits future to MAX_UNDO_STEPS", () => {
      const futureActions = Array.from({ length: MAX_UNDO_STEPS }, (_, i) => ({
        type: "ADD_ITEM" as const,
        item: createTestItem({ id: `future-${i}` }),
      }))
      const pastAction: UndoAction = { type: "ADD_ITEM", item: createTestItem({ id: "past" }) }
      const props = createHookProps({ past: [pastAction], future: futureActions })
      const { result } = renderHook(() => useUndoRedo(props))

      act(() => {
        result.current.undo()
      })

      const call = props.onStackChange.mock.calls[0][0]
      expect(call.future.length).toBe(MAX_UNDO_STEPS)
    })
  })

  describe("redo", () => {
    it("returns null when future is empty", () => {
      const props = createHookProps({ future: [] })
      const { result } = renderHook(() => useUndoRedo(props))

      let action: UndoAction | null = null
      act(() => {
        action = result.current.redo()
      })

      expect(action).toBeNull()
      expect(props.onStackChange).not.toHaveBeenCalled()
    })

    it("moves action from future to past", () => {
      const action1: UndoAction = { type: "ADD_ITEM", item: createTestItem({ id: "1" }) }
      const action2: UndoAction = { type: "ADD_ITEM", item: createTestItem({ id: "2" }) }
      const props = createHookProps({ past: [], future: [action1, action2] })
      const { result } = renderHook(() => useUndoRedo(props))

      let returned: UndoAction | null = null
      act(() => {
        returned = result.current.redo()
      })

      expect(returned).toEqual(action1) // First action in future
      expect(props.onStackChange).toHaveBeenCalledWith({
        past: [action1],
        future: [action2],
      })
    })

    it("appends to existing past", () => {
      const pastAction: UndoAction = { type: "ADD_ITEM", item: createTestItem({ id: "past" }) }
      const futureAction: UndoAction = { type: "ADD_ITEM", item: createTestItem({ id: "future" }) }
      const props = createHookProps({ past: [pastAction], future: [futureAction] })
      const { result } = renderHook(() => useUndoRedo(props))

      act(() => {
        result.current.redo()
      })

      expect(props.onStackChange).toHaveBeenCalledWith({
        past: [pastAction, futureAction],
        future: [],
      })
    })
  })

  describe("clearHistory", () => {
    it("clears both past and future", () => {
      const action: UndoAction = { type: "ADD_ITEM", item: createTestItem() }
      const props = createHookProps({ past: [action], future: [action] })
      const { result } = renderHook(() => useUndoRedo(props))

      act(() => {
        result.current.clearHistory()
      })

      expect(props.onStackChange).toHaveBeenCalledWith({
        past: [],
        future: [],
      })
    })
  })
})

describe("applyUndoAction", () => {
  describe("ADD_ITEM", () => {
    it("removes the added item from trip", () => {
      const item = createTestItem({ id: "new-item" })
      const trip = createTestTrip({ items: [item] })
      const action: UndoAction = { type: "ADD_ITEM", item }

      const result = applyUndoAction(trip, action)

      expect(result.items).toHaveLength(0)
    })

    it("keeps other items", () => {
      const item1 = createTestItem({ id: "item-1" })
      const item2 = createTestItem({ id: "item-2" })
      const trip = createTestTrip({ items: [item1, item2] })
      const action: UndoAction = { type: "ADD_ITEM", item: item1 }

      const result = applyUndoAction(trip, action)

      expect(result.items).toHaveLength(1)
      expect(result.items[0].id).toBe("item-2")
    })

    it("updates trip updatedAt", () => {
      const item = createTestItem()
      const trip = createTestTrip({ items: [item], updatedAt: 1000 })
      const action: UndoAction = { type: "ADD_ITEM", item }

      const before = Date.now()
      const result = applyUndoAction(trip, action)
      const after = Date.now()

      expect(result.updatedAt).toBeGreaterThanOrEqual(before)
      expect(result.updatedAt).toBeLessThanOrEqual(after)
    })
  })

  describe("UPDATE_ITEM", () => {
    it("restores item to before state", () => {
      const before = createTestItem({ id: "item-1", title: "Before" })
      const after = createTestItem({ id: "item-1", title: "After" })
      const trip = createTestTrip({ items: [after] })
      const action: UndoAction = { type: "UPDATE_ITEM", before, after }

      const result = applyUndoAction(trip, action)

      expect(result.items[0].title).toBe("Before")
    })

    it("keeps other items unchanged", () => {
      const before = createTestItem({ id: "item-1", title: "Before" })
      const after = createTestItem({ id: "item-1", title: "After" })
      const other = createTestItem({ id: "item-2", title: "Other" })
      const trip = createTestTrip({ items: [after, other] })
      const action: UndoAction = { type: "UPDATE_ITEM", before, after }

      const result = applyUndoAction(trip, action)

      expect(result.items[1].title).toBe("Other")
    })
  })

  describe("DELETE_ITEM", () => {
    it("restores deleted item", () => {
      const item = createTestItem({ id: "deleted-item", title: "Deleted" })
      const trip = createTestTrip({ items: [] })
      const action: UndoAction = { type: "DELETE_ITEM", item }

      const result = applyUndoAction(trip, action)

      expect(result.items).toHaveLength(1)
      expect(result.items[0].title).toBe("Deleted")
    })

    it("appends restored item to existing items", () => {
      const existing = createTestItem({ id: "existing" })
      const deleted = createTestItem({ id: "deleted" })
      const trip = createTestTrip({ items: [existing] })
      const action: UndoAction = { type: "DELETE_ITEM", item: deleted }

      const result = applyUndoAction(trip, action)

      expect(result.items).toHaveLength(2)
    })
  })

  describe("MOVE_ITEM", () => {
    it("restores item to original position", () => {
      const item = createTestItem({ id: "moved", dayIndex: 1, segment: "evening" })
      const trip = createTestTrip({ items: [item] })
      const action: UndoAction = {
        type: "MOVE_ITEM",
        itemId: "moved",
        fromDay: 0,
        fromSegment: "morning",
        toDay: 1,
        toSegment: "evening",
      }

      const result = applyUndoAction(trip, action)

      expect(result.items[0].dayIndex).toBe(0)
      expect(result.items[0].segment).toBe("morning")
    })
  })

  describe("ADD_DAY", () => {
    it("removes the added day", () => {
      const day: Day = { index: 2, date: "2026-03-17" }
      const trip = createTestTrip({
        days: [
          { index: 0, date: "2026-03-15" },
          { index: 1, date: "2026-03-16" },
          { index: 2, date: "2026-03-17" },
        ],
      })
      const action: UndoAction = { type: "ADD_DAY", day }

      const result = applyUndoAction(trip, action)

      expect(result.days).toHaveLength(2)
    })

    it("reindexes remaining days", () => {
      const trip = createTestTrip({
        days: [
          { index: 0, date: "2026-03-15" },
          { index: 1, date: "2026-03-16" },
          { index: 2, date: "2026-03-17" },
        ],
      })
      const action: UndoAction = { type: "ADD_DAY", day: { index: 1, date: "2026-03-16" } }

      const result = applyUndoAction(trip, action)

      expect(result.days.map((d) => d.index)).toEqual([0, 1])
    })

    it("removes items from deleted day", () => {
      const item = createTestItem({ dayIndex: 2 })
      const trip = createTestTrip({
        days: [
          { index: 0 },
          { index: 1 },
          { index: 2 },
        ],
        items: [item],
      })
      const action: UndoAction = { type: "ADD_DAY", day: { index: 2 } }

      const result = applyUndoAction(trip, action)

      expect(result.items).toHaveLength(0)
    })

    it("adjusts dayIndex for items after deleted day", () => {
      const item = createTestItem({ dayIndex: 2 })
      const trip = createTestTrip({
        days: [{ index: 0 }, { index: 1 }, { index: 2 }],
        items: [item],
      })
      const action: UndoAction = { type: "ADD_DAY", day: { index: 1 } }

      const result = applyUndoAction(trip, action)

      expect(result.items[0].dayIndex).toBe(1) // Was 2, now 1
    })
  })

  describe("DELETE_DAY", () => {
    it("restores deleted day", () => {
      const trip = createTestTrip({
        days: [{ index: 0 }, { index: 1 }],
      })
      const action: UndoAction = { type: "DELETE_DAY", dayIndex: 1, items: [] }

      const result = applyUndoAction(trip, action)

      expect(result.days).toHaveLength(3)
    })

    it("restores items from deleted day", () => {
      const deletedItem = createTestItem({ id: "deleted", dayIndex: 1 })
      const trip = createTestTrip({
        days: [{ index: 0 }, { index: 1 }],
        items: [],
      })
      const action: UndoAction = { type: "DELETE_DAY", dayIndex: 1, items: [deletedItem] }

      const result = applyUndoAction(trip, action)

      expect(result.items).toHaveLength(1)
      expect(result.items[0].id).toBe("deleted")
    })

    it("adjusts dayIndex for items after restored day", () => {
      const item = createTestItem({ dayIndex: 1 }) // Was on day 2 before delete
      const trip = createTestTrip({
        days: [{ index: 0 }, { index: 1 }],
        items: [item],
      })
      const action: UndoAction = { type: "DELETE_DAY", dayIndex: 1, items: [] }

      const result = applyUndoAction(trip, action)

      expect(result.items[0].dayIndex).toBe(2) // Shifted back
    })
  })

  describe("UPDATE_TRIP", () => {
    it("restores trip to before state", () => {
      const trip = createTestTrip({ name: "After Name", description: "After" })
      const action: UndoAction = {
        type: "UPDATE_TRIP",
        before: { name: "Before Name", description: "Before" },
        after: { name: "After Name", description: "After" },
      }

      const result = applyUndoAction(trip, action)

      expect(result.name).toBe("Before Name")
      expect(result.description).toBe("Before")
    })
  })

  describe("unknown action", () => {
    it("returns trip unchanged", () => {
      const trip = createTestTrip()
      const action = { type: "UNKNOWN" } as unknown as UndoAction

      const result = applyUndoAction(trip, action)

      expect(result).toEqual(trip)
    })
  })
})

describe("applyRedoAction", () => {
  describe("ADD_ITEM", () => {
    it("adds the item back", () => {
      const item = createTestItem({ id: "new-item" })
      const trip = createTestTrip({ items: [] })
      const action: UndoAction = { type: "ADD_ITEM", item }

      const result = applyRedoAction(trip, action)

      expect(result.items).toHaveLength(1)
      expect(result.items[0].id).toBe("new-item")
    })
  })

  describe("UPDATE_ITEM", () => {
    it("applies after state", () => {
      const before = createTestItem({ id: "item-1", title: "Before" })
      const after = createTestItem({ id: "item-1", title: "After" })
      const trip = createTestTrip({ items: [before] })
      const action: UndoAction = { type: "UPDATE_ITEM", before, after }

      const result = applyRedoAction(trip, action)

      expect(result.items[0].title).toBe("After")
    })
  })

  describe("DELETE_ITEM", () => {
    it("removes the item", () => {
      const item = createTestItem({ id: "to-delete" })
      const trip = createTestTrip({ items: [item] })
      const action: UndoAction = { type: "DELETE_ITEM", item }

      const result = applyRedoAction(trip, action)

      expect(result.items).toHaveLength(0)
    })
  })

  describe("MOVE_ITEM", () => {
    it("moves item to target position", () => {
      const item = createTestItem({ id: "moved", dayIndex: 0, segment: "morning" })
      const trip = createTestTrip({ items: [item] })
      const action: UndoAction = {
        type: "MOVE_ITEM",
        itemId: "moved",
        fromDay: 0,
        fromSegment: "morning",
        toDay: 1,
        toSegment: "evening",
      }

      const result = applyRedoAction(trip, action)

      expect(result.items[0].dayIndex).toBe(1)
      expect(result.items[0].segment).toBe("evening")
    })
  })

  describe("ADD_DAY", () => {
    it("adds the day back", () => {
      const trip = createTestTrip({
        days: [{ index: 0 }],
      })
      const action: UndoAction = { type: "ADD_DAY", day: { index: 1, date: "2026-03-16" } }

      const result = applyRedoAction(trip, action)

      expect(result.days).toHaveLength(2)
    })

    it("adjusts dayIndex for items after added day", () => {
      const item = createTestItem({ dayIndex: 1 })
      const trip = createTestTrip({
        days: [{ index: 0 }, { index: 1 }],
        items: [item],
      })
      const action: UndoAction = { type: "ADD_DAY", day: { index: 1, date: "2026-03-16" } }

      const result = applyRedoAction(trip, action)

      expect(result.items[0].dayIndex).toBe(2) // Shifted forward
    })
  })

  describe("DELETE_DAY", () => {
    it("removes the day again", () => {
      const trip = createTestTrip({
        days: [{ index: 0 }, { index: 1 }, { index: 2 }],
      })
      const action: UndoAction = { type: "DELETE_DAY", dayIndex: 1, items: [] }

      const result = applyRedoAction(trip, action)

      expect(result.days).toHaveLength(2)
    })

    it("removes items from deleted day", () => {
      const item = createTestItem({ dayIndex: 1 })
      const trip = createTestTrip({
        days: [{ index: 0 }, { index: 1 }, { index: 2 }],
        items: [item],
      })
      const action: UndoAction = { type: "DELETE_DAY", dayIndex: 1, items: [item] }

      const result = applyRedoAction(trip, action)

      expect(result.items).toHaveLength(0)
    })

    it("adjusts dayIndex for items after deleted day", () => {
      const item = createTestItem({ dayIndex: 2 })
      const trip = createTestTrip({
        days: [{ index: 0 }, { index: 1 }, { index: 2 }],
        items: [item],
      })
      const action: UndoAction = { type: "DELETE_DAY", dayIndex: 1, items: [] }

      const result = applyRedoAction(trip, action)

      expect(result.items[0].dayIndex).toBe(1) // Shifted back
    })
  })

  describe("UPDATE_TRIP", () => {
    it("applies after state", () => {
      const trip = createTestTrip({ name: "Before Name" })
      const action: UndoAction = {
        type: "UPDATE_TRIP",
        before: { name: "Before Name" },
        after: { name: "After Name" },
      }

      const result = applyRedoAction(trip, action)

      expect(result.name).toBe("After Name")
    })
  })

  describe("unknown action", () => {
    it("returns trip unchanged", () => {
      const trip = createTestTrip()
      const action = { type: "UNKNOWN" } as unknown as UndoAction

      const result = applyRedoAction(trip, action)

      expect(result).toEqual(trip)
    })
  })
})
