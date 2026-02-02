/**
 * Analytics Tracker - Camada de Abstração
 *
 * Esta camada isola a implementação específica (GA4, PostHog, etc.)
 * do resto do app. Para trocar de provider, basta alterar este arquivo.
 */

import type { AnalyticsEvent, AnalyticsEventMap } from "./types";
import {
  initGA4,
  injectGA4Script,
  sendGA4Event,
  sendGA4PageView,
  setGA4UserProperties,
} from "./ga4";

// ============================================
// Estado do Tracker
// ============================================
let isInitialized = false;
let isEnabled = true;

// ============================================
// Configuração
// ============================================
export interface TrackerConfig {
  /** Desabilita tracking (útil para testes) */
  disabled?: boolean;
  /** Modo debug - loga eventos no console */
  debug?: boolean;
}

/**
 * Inicializa o tracker de analytics
 * Deve ser chamado uma vez no carregamento do app
 */
export function initTracker(config?: TrackerConfig): void {
  if (isInitialized) return;

  isEnabled = !config?.disabled;

  if (!isEnabled) {
    if (config?.debug) {
      console.log("[Analytics] Tracker disabled");
    }
    return;
  }

  // Inicializa GA4
  initGA4();
  injectGA4Script();

  isInitialized = true;

  if (config?.debug || import.meta.env.DEV) {
    console.log("[Analytics] Tracker initialized");
  }
}

// ============================================
// API Pública
// ============================================

/**
 * Rastreia um evento tipado
 *
 * @example
 * track('trip_created', { has_dates: true, duration_days: 7 })
 */
export function track<E extends AnalyticsEvent>(
  event: E,
  properties: AnalyticsEventMap[E]
): void {
  if (!isEnabled) return;

  // Log em desenvolvimento
  if (import.meta.env.DEV) {
    console.log("[Analytics]", event, properties);
  }

  // Envia para GA4
  sendGA4Event(event, properties as Record<string, unknown>);
}

/**
 * Rastreia visualização de página
 *
 * @example
 * trackPageView('/itinerary', 'Minhas Viagens')
 */
export function trackPageView(path: string, title?: string): void {
  if (!isEnabled) return;

  if (import.meta.env.DEV) {
    console.log("[Analytics] page_view", { path, title });
  }

  sendGA4PageView(path, title);
}

/**
 * Define propriedades persistentes do usuário
 *
 * @example
 * setUserProperties({ theme_preference: 'dark', trips_count: 5 })
 */
export function setUserProperties(
  properties: Record<string, unknown>
): void {
  if (!isEnabled) return;

  if (import.meta.env.DEV) {
    console.log("[Analytics] user_properties", properties);
  }

  setGA4UserProperties(properties);
}

/**
 * Identifica o usuário (para analytics que suportam)
 * GA4 não usa user ID por padrão, mas mantemos para compatibilidade
 */
export function identify(_userId: string): void {
  if (!isEnabled) return;

  // GA4 não usa identificação de usuário por padrão
  // Se migrar para PostHog/Mixpanel, implementar aqui
  if (import.meta.env.DEV) {
    console.log("[Analytics] identify (no-op for GA4)");
  }
}

/**
 * Reseta o tracker (útil para logout)
 */
export function reset(): void {
  if (!isEnabled) return;

  // GA4 não tem reset nativo
  // Se migrar para outro provider, implementar aqui
  if (import.meta.env.DEV) {
    console.log("[Analytics] reset (no-op for GA4)");
  }
}

// ============================================
// Utilitários
// ============================================

/**
 * Verifica se o tracker está habilitado
 */
export function isTrackerEnabled(): boolean {
  return isEnabled;
}

/**
 * Verifica se está rodando como PWA instalado
 */
export function isPWA(): boolean {
  if (typeof window === "undefined") return false;

  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // @ts-expect-error - Safari iOS
    window.navigator.standalone === true
  );
}

/**
 * Detecta a plataforma do usuário
 */
export function getPlatform(): "ios" | "android" | "desktop" {
  if (typeof window === "undefined") return "desktop";

  const ua = navigator.userAgent.toLowerCase();

  if (/iphone|ipad|ipod/.test(ua)) return "ios";
  if (/android/.test(ua)) return "android";
  return "desktop";
}

/**
 * Obtém o tema atual
 */
export function getCurrentTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";

  return document.documentElement.classList.contains("dark")
    ? "dark"
    : "light";
}
