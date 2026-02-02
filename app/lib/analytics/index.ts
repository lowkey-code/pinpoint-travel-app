/**
 * Analytics Module
 * Exporta toda a API pública de analytics
 */

// Provider
export { AnalyticsProvider } from "./provider";

// Tracker API
export {
  track,
  trackPageView,
  setUserProperties,
  identify,
  reset,
  isTrackerEnabled,
  isPWA,
  getPlatform,
  getCurrentTheme,
} from "./tracker";

// React Hooks
export {
  useTrack,
  usePageView,
  useAppOpened,
  useThemeChange,
  useDayNavigation,
  useSegmentSwitch,
  useViewSwitch,
} from "./hooks";

// Event Helpers
export {
  // Trips
  trackTripCreated,
  trackTripViewed,
  trackTripArchived,
  trackTripRestored,
  trackTripDeleted,
  trackTripDuplicated,
  trackTripExported,
  trackTripImported,
  // Items
  trackItemCreated,
  trackItemUpdated,
  trackItemStatusChanged,
  trackItemPriorityChanged,
  trackItemDeleted,
  trackItemConverted,
  trackItemReordered,
  // Engagement
  trackAddressCopied,
  trackMapOpened,
  trackUndoUsed,
  trackRedoUsed,
  // PWA
  trackPWAInstallPrompted,
  trackPWAInstalled,
  // Onboarding
  trackOnboardingCompleted,
} from "./events";

// Types
export type {
  AnalyticsEvent,
  AnalyticsEventMap,
  // Session events
  AppOpenedEvent,
  OnboardingCompletedEvent,
  PWAInstallPromptedEvent,
  PWAInstalledEvent,
  ThemeChangedEvent,
  // Trip events
  TripCreatedEvent,
  TripViewedEvent,
  TripArchivedEvent,
  TripRestoredEvent,
  TripDeletedEvent,
  TripDuplicatedEvent,
  TripExportedEvent,
  TripImportedEvent,
  // Item events
  ItemType,
  Segment,
  ItemStatus,
  ItemPriority,
  ItemCreatedEvent,
  ItemUpdatedEvent,
  ItemStatusChangedEvent,
  ItemPriorityChangedEvent,
  ItemDeletedEvent,
  ItemConvertedEvent,
  ItemReorderedEvent,
  // Navigation events
  PageViewedEvent,
  DayNavigatedEvent,
  SegmentSwitchedEvent,
  ViewSwitchedEvent,
  // Engagement events
  AddressCopiedEvent,
  MapOpenedEvent,
  UndoUsedEvent,
  RedoUsedEvent,
} from "./types";
