// Types
export type {
  Segment,
  ItemStatus,
  ItemPriority,
  ItemType,
  ItineraryItem,
  Day,
  Trip,
  UndoAction,
  UndoStack,
  ItineraryState,
  GhostItem,
  RenderableItem,
  ExportedTrip,
} from "./lib/types"

export { isGhostItem } from "./lib/types"

// Constants
export {
  SEGMENTS,
  SEGMENT_LABELS,
  SEGMENT_ICONS,
  ITEM_TYPES,
  ITEM_TYPE_LABELS,
  ITEM_TYPE_ICONS,
  STATUS_LABELS,
  STATUS_COLORS,
  PRIORITY_LABELS,
  PRIORITY_COLORS,
  STORAGE_KEY,
  CURRENT_SCHEMA_VERSION,
  MAX_UNDO_STEPS,
  DEFAULT_CURRENCY,
  DAY_LABEL_PREFIX,
  STORAGE_DEBOUNCE_MS,
} from "./lib/constants"

// Storage
export {
  createEmptyState,
  loadState,
  saveStateImmediate,
  saveStateDebounced,
  flushPendingWrites,
  generateId,
  exportTrip,
  importTrip,
  validateExportedTrip,
  parseImportedTrip,
} from "./lib/storage"

// Utils
export {
  getItemsForDaySegment,
  getDayTripsForSegment,
  createGhostItems,
  getRenderableItemsForSegment,
  filterByCity,
  filterByStatus,
  getUniqueCities,
  parseDurationText,
  parseCostText,
  calculateDayDuration,
  calculateTripCost,
  formatDuration,
  formatCost,
  buildAMapUrl,
  copyToClipboard,
  createItem,
  createDay,
  createTrip,
  reindexDays,
  updateItemDayIndices,
  sortItemsBySegment,
  isDayTripCoveringSegment,
  getDayTripCoveredSegments,
} from "./lib/utils"

// Hooks
export { useTrips } from "./hooks/useTrips"
export type { UseTripsReturn } from "./hooks/useTrips"

export { useActiveTrip } from "./hooks/useActiveTrip"
export type { UseActiveTripReturn } from "./hooks/useActiveTrip"

export { useUndoRedo, applyUndoAction, applyRedoAction } from "./hooks/useUndoRedo"
export type { UseUndoRedoReturn, UseUndoRedoOptions } from "./hooks/useUndoRedo"
