/**
 * Analytics Event Types
 * Definições tipadas de todos os eventos rastreados no app
 */

// ============================================
// Session & App Events
// ============================================
export interface AppOpenedEvent {
  is_pwa: boolean;
  theme: "light" | "dark";
  trips_count: number;
}

export interface OnboardingCompletedEvent {
  // Sem propriedades adicionais
}

export interface PWAInstallPromptedEvent {
  source: "banner" | "settings";
}

export interface PWAInstalledEvent {
  platform: "ios" | "android" | "desktop";
}

export interface ThemeChangedEvent {
  from: "light" | "dark" | "system";
  to: "light" | "dark" | "system";
}

// ============================================
// Trip Events
// ============================================
export interface TripCreatedEvent {
  has_dates: boolean;
  duration_days: number | null;
}

export interface TripViewedEvent {
  trip_id: string;
  view: "day" | "grid";
}

export interface TripArchivedEvent {
  trip_id: string;
  items_count: number;
}

export interface TripRestoredEvent {
  trip_id: string;
}

export interface TripDeletedEvent {
  trip_id: string;
  was_archived: boolean;
}

export interface TripDuplicatedEvent {
  original_trip_id: string;
}

export interface TripExportedEvent {
  trip_id: string;
  items_count: number;
}

export interface TripImportedEvent {
  schema_version: number;
  items_count: number;
  migrated: boolean;
}

// ============================================
// Item Events
// ============================================
export type ItemType =
  | "activity"
  | "dayTrip"
  | "transport"
  | "stay"
  | "quick";

export type Segment = "morning" | "afternoon" | "evening";

export type ItemStatus = "planned" | "done" | "skipped";

export type ItemPriority = 0 | 1 | 2;

export interface ItemCreatedEvent {
  item_type: ItemType;
  segment: Segment;
  day_index: number;
}

export interface ItemUpdatedEvent {
  item_id: string;
  fields_changed: string[];
}

export interface ItemStatusChangedEvent {
  item_id: string;
  from: ItemStatus;
  to: ItemStatus;
}

export interface ItemPriorityChangedEvent {
  item_id: string;
  from: ItemPriority;
  to: ItemPriority;
}

export interface ItemDeletedEvent {
  item_id: string;
  item_type: ItemType;
}

export interface ItemConvertedEvent {
  item_id: string;
  from_type: ItemType;
  to_type: ItemType;
}

export interface ItemReorderedEvent {
  item_id: string;
  from_segment: Segment;
  to_segment: Segment;
}

// ============================================
// Navigation Events
// ============================================
export interface PageViewedEvent {
  path: string;
  referrer?: string;
}

export interface DayNavigatedEvent {
  trip_id: string;
  direction: "previous" | "next";
  day_index: number;
}

export interface SegmentSwitchedEvent {
  segment: Segment;
}

export interface ViewSwitchedEvent {
  from: "day" | "grid";
  to: "day" | "grid";
}

// ============================================
// Engagement Events
// ============================================
export interface AddressCopiedEvent {
  item_id: string;
}

export interface MapOpenedEvent {
  item_id: string;
  has_coords: boolean;
}

export interface UndoUsedEvent {
  trip_id: string;
  action_type: string;
}

export interface RedoUsedEvent {
  trip_id: string;
  action_type: string;
}

// ============================================
// Event Map (para tipagem do tracker)
// ============================================
export interface AnalyticsEventMap {
  // Session
  app_opened: AppOpenedEvent;
  onboarding_completed: OnboardingCompletedEvent;
  pwa_install_prompted: PWAInstallPromptedEvent;
  pwa_installed: PWAInstalledEvent;
  theme_changed: ThemeChangedEvent;

  // Trips
  trip_created: TripCreatedEvent;
  trip_viewed: TripViewedEvent;
  trip_archived: TripArchivedEvent;
  trip_restored: TripRestoredEvent;
  trip_deleted: TripDeletedEvent;
  trip_duplicated: TripDuplicatedEvent;
  trip_exported: TripExportedEvent;
  trip_imported: TripImportedEvent;

  // Items
  item_created: ItemCreatedEvent;
  item_updated: ItemUpdatedEvent;
  item_status_changed: ItemStatusChangedEvent;
  item_priority_changed: ItemPriorityChangedEvent;
  item_deleted: ItemDeletedEvent;
  item_converted: ItemConvertedEvent;
  item_reordered: ItemReorderedEvent;

  // Navigation
  page_viewed: PageViewedEvent;
  day_navigated: DayNavigatedEvent;
  segment_switched: SegmentSwitchedEvent;
  view_switched: ViewSwitchedEvent;

  // Engagement
  address_copied: AddressCopiedEvent;
  map_opened: MapOpenedEvent;
  undo_used: UndoUsedEvent;
  redo_used: RedoUsedEvent;
}

export type AnalyticsEvent = keyof AnalyticsEventMap;
