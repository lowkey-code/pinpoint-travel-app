import type { Segment, ItemStatus, ItemPriority, ItemType } from "./types"

// Segments (fixed order)
export const SEGMENTS: readonly Segment[] = ["morning", "afternoon", "evening"] as const

export const SEGMENT_LABELS: Record<Segment, string> = {
  morning: "Manhã",
  afternoon: "Tarde",
  evening: "Noite",
}

export const SEGMENT_ICONS: Record<Segment, string> = {
  morning: "Sunrise",
  afternoon: "Sun",
  evening: "Moon",
}

// Item types
export const ITEM_TYPES: readonly ItemType[] = ["activity", "dayTrip", "transport", "stay", "quick"] as const

export const ITEM_TYPE_LABELS: Record<ItemType, string> = {
  activity: "Atividade",
  dayTrip: "Dia Inteiro",
  transport: "Transporte",
  stay: "Hospedagem",
  quick: "Rápido",
}

export const ITEM_TYPE_ICONS: Record<ItemType, string> = {
  activity: "📍",
  dayTrip: "🌅",
  transport: "🚗",
  stay: "🏨",
  quick: "⚡",
}

// Status
export const STATUS_LABELS: Record<ItemStatus, string> = {
  planned: "Planejado",
  done: "Feito",
  skipped: "Pulado",
}

export const STATUS_COLORS: Record<ItemStatus, string> = {
  planned: "text-stamp-navy",
  done: "text-stamp-sage",
  skipped: "text-stamp-amber",
}

// Priority (0 = normal, 1 = important, 2 = must-do)
export const PRIORITY_LABELS: Record<ItemPriority, string> = {
  0: "Normal",
  1: "Importante",
  2: "Imperdível",
}

export const PRIORITY_COLORS: Record<ItemPriority, string> = {
  0: "bg-secondary",
  1: "bg-stamp-amber/10",
  2: "bg-stamp-brick/10",
}

// Storage
export const STORAGE_KEY = "pinpoint_itinerary"
export const CURRENT_SCHEMA_VERSION = 2

// Undo
export const MAX_UNDO_STEPS = 10

// Debounce
export const STORAGE_DEBOUNCE_MS = 500

// Defaults
export const DEFAULT_CURRENCY = "BRL"
export const DAY_LABEL_PREFIX = "Dia"
