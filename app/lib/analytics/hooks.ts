/**
 * Analytics React Hooks
 * Hooks para facilitar o uso do tracker em componentes React
 */

import { useCallback, useEffect, useRef } from "react";
import { useLocation } from "react-router";
import type { AnalyticsEvent, AnalyticsEventMap } from "./types";
import {
  track as trackerTrack,
  trackPageView,
  isPWA,
  getCurrentTheme,
} from "./tracker";

/**
 * Hook para rastrear eventos tipados
 *
 * @example
 * const track = useTrack();
 * track('trip_created', { has_dates: true, duration_days: 7 });
 */
export function useTrack() {
  return useCallback(
    <E extends AnalyticsEvent>(
      event: E,
      properties: AnalyticsEventMap[E]
    ): void => {
      trackerTrack(event, properties);
    },
    []
  );
}

/**
 * Hook para rastrear pageviews automaticamente
 * Deve ser usado uma vez no root do app
 *
 * @example
 * function App() {
 *   usePageView();
 *   return <Outlet />;
 * }
 */
export function usePageView(): void {
  const location = useLocation();
  const previousPath = useRef<string | null>(null);

  useEffect(() => {
    // Evita tracking duplicado da mesma página
    if (previousPath.current === location.pathname) return;

    previousPath.current = location.pathname;
    trackPageView(location.pathname);
  }, [location.pathname]);
}

/**
 * Hook para rastrear evento de app aberto
 * Deve ser usado uma vez no carregamento inicial
 *
 * @example
 * function App() {
 *   useAppOpened(tripsCount);
 *   return <Outlet />;
 * }
 */
export function useAppOpened(tripsCount: number): void {
  const hasTracked = useRef(false);

  useEffect(() => {
    if (hasTracked.current) return;
    hasTracked.current = true;

    trackerTrack("app_opened", {
      is_pwa: isPWA(),
      theme: getCurrentTheme(),
      trips_count: tripsCount,
    });
  }, [tripsCount]);
}

/**
 * Hook para rastrear mudança de tema
 *
 * @example
 * const trackThemeChange = useThemeChange();
 * trackThemeChange('light', 'dark');
 */
export function useThemeChange() {
  return useCallback(
    (
      from: "light" | "dark" | "system",
      to: "light" | "dark" | "system"
    ): void => {
      trackerTrack("theme_changed", { from, to });
    },
    []
  );
}

/**
 * Hook para rastrear navegação entre dias
 *
 * @example
 * const trackDayNav = useDayNavigation(tripId);
 * trackDayNav('next', 3);
 */
export function useDayNavigation(tripId: string) {
  return useCallback(
    (direction: "previous" | "next", dayIndex: number): void => {
      trackerTrack("day_navigated", {
        trip_id: tripId,
        direction,
        day_index: dayIndex,
      });
    },
    [tripId]
  );
}

/**
 * Hook para rastrear troca de segmento
 *
 * @example
 * const trackSegment = useSegmentSwitch();
 * trackSegment('afternoon');
 */
export function useSegmentSwitch() {
  return useCallback(
    (segment: "morning" | "afternoon" | "evening"): void => {
      trackerTrack("segment_switched", { segment });
    },
    []
  );
}

/**
 * Hook para rastrear troca de view (day/grid)
 *
 * @example
 * const trackView = useViewSwitch();
 * trackView('day', 'grid');
 */
export function useViewSwitch() {
  return useCallback(
    (from: "day" | "grid", to: "day" | "grid"): void => {
      trackerTrack("view_switched", { from, to });
    },
    []
  );
}
