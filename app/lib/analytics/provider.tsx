/**
 * Analytics Provider
 * Inicializa o tracker e fornece contexto para o app
 */

import { useEffect, type ReactNode } from "react";
import { initTracker } from "./tracker";
import { usePageView } from "./hooks";

interface AnalyticsProviderProps {
  children: ReactNode;
  /** Desabilita tracking (útil para testes) */
  disabled?: boolean;
}

/**
 * Provider que inicializa o analytics e rastreia pageviews
 *
 * @example
 * <AnalyticsProvider>
 *   <App />
 * </AnalyticsProvider>
 */
export function AnalyticsProvider({
  children,
  disabled = false,
}: AnalyticsProviderProps) {
  // Inicializa o tracker uma vez
  useEffect(() => {
    initTracker({ disabled, debug: import.meta.env.DEV });
  }, [disabled]);

  // Rastreia pageviews automaticamente
  usePageView();

  return <>{children}</>;
}
