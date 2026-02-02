/**
 * Analytics Event Helpers
 * Funções prontas para rastrear eventos específicos do domínio
 */

import { track } from "./tracker";
import type {
  ItemType,
  Segment,
  ItemStatus,
  ItemPriority,
} from "./types";

// ============================================
// Trip Events
// ============================================

export function trackTripCreated(
  hasDates: boolean,
  durationDays: number | null
): void {
  track("trip_created", {
    has_dates: hasDates,
    duration_days: durationDays,
  });
}

export function trackTripViewed(
  tripId: string,
  view: "day" | "grid"
): void {
  track("trip_viewed", { trip_id: tripId, view });
}

export function trackTripArchived(tripId: string, itemsCount: number): void {
  track("trip_archived", { trip_id: tripId, items_count: itemsCount });
}

export function trackTripRestored(tripId: string): void {
  track("trip_restored", { trip_id: tripId });
}

export function trackTripDeleted(tripId: string, wasArchived: boolean): void {
  track("trip_deleted", { trip_id: tripId, was_archived: wasArchived });
}

export function trackTripDuplicated(originalTripId: string): void {
  track("trip_duplicated", { original_trip_id: originalTripId });
}

export function trackTripExported(tripId: string, itemsCount: number): void {
  track("trip_exported", { trip_id: tripId, items_count: itemsCount });
}

export function trackTripImported(
  schemaVersion: number,
  itemsCount: number,
  migrated: boolean
): void {
  track("trip_imported", {
    schema_version: schemaVersion,
    items_count: itemsCount,
    migrated,
  });
}

// ============================================
// Item Events
// ============================================

export function trackItemCreated(
  itemType: ItemType,
  segment: Segment,
  dayIndex: number
): void {
  track("item_created", {
    item_type: itemType,
    segment,
    day_index: dayIndex,
  });
}

export function trackItemUpdated(
  itemId: string,
  fieldsChanged: string[]
): void {
  track("item_updated", {
    item_id: itemId,
    fields_changed: fieldsChanged,
  });
}

export function trackItemStatusChanged(
  itemId: string,
  from: ItemStatus,
  to: ItemStatus
): void {
  track("item_status_changed", { item_id: itemId, from, to });
}

export function trackItemPriorityChanged(
  itemId: string,
  from: ItemPriority,
  to: ItemPriority
): void {
  track("item_priority_changed", { item_id: itemId, from, to });
}

export function trackItemDeleted(itemId: string, itemType: ItemType): void {
  track("item_deleted", { item_id: itemId, item_type: itemType });
}

export function trackItemConverted(
  itemId: string,
  fromType: ItemType,
  toType: ItemType
): void {
  track("item_converted", {
    item_id: itemId,
    from_type: fromType,
    to_type: toType,
  });
}

export function trackItemReordered(
  itemId: string,
  fromSegment: Segment,
  toSegment: Segment
): void {
  track("item_reordered", {
    item_id: itemId,
    from_segment: fromSegment,
    to_segment: toSegment,
  });
}

// ============================================
// Engagement Events
// ============================================

export function trackAddressCopied(itemId: string): void {
  track("address_copied", { item_id: itemId });
}

export function trackMapOpened(itemId: string, hasCoords: boolean): void {
  track("map_opened", { item_id: itemId, has_coords: hasCoords });
}

export function trackUndoUsed(tripId: string, actionType: string): void {
  track("undo_used", { trip_id: tripId, action_type: actionType });
}

export function trackRedoUsed(tripId: string, actionType: string): void {
  track("redo_used", { trip_id: tripId, action_type: actionType });
}

// ============================================
// PWA Events
// ============================================

export function trackPWAInstallPrompted(
  source: "banner" | "settings"
): void {
  track("pwa_install_prompted", { source });
}

export function trackPWAInstalled(
  platform: "ios" | "android" | "desktop"
): void {
  track("pwa_installed", { platform });
}

// ============================================
// Onboarding Events
// ============================================

export function trackOnboardingCompleted(): void {
  track("onboarding_completed", {});
}
