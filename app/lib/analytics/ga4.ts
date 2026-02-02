/**
 * Google Analytics 4 Implementation
 * Implementação específica do GA4 - isolada da camada de abstração
 */

const GA_MEASUREMENT_ID = "G-FZ7EYX0BHY";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

/**
 * Inicializa o script do GA4
 * Deve ser chamado uma vez no carregamento do app
 */
export function initGA4(): void {
  if (typeof window === "undefined") return;

  // Evita inicialização dupla
  if (typeof window.gtag === "function") return;

  // Inicializa dataLayer
  window.dataLayer = window.dataLayer || [];

  // Define gtag function
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer.push(args);
  };

  // Configura timestamps
  window.gtag("js", new Date());

  // Configura o GA4
  window.gtag("config", GA_MEASUREMENT_ID, {
    // Desabilita pageview automático (vamos controlar manualmente)
    send_page_view: false,
  });
}

/**
 * Injeta o script do GA4 no documento
 */
export function injectGA4Script(): void {
  if (typeof window === "undefined") return;

  // Verifica se já foi injetado
  if (document.querySelector(`script[src*="gtag"]`)) return;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);
}

/**
 * Envia um evento para o GA4
 */
export function sendGA4Event(
  eventName: string,
  params?: Record<string, unknown>
): void {
  if (typeof window === "undefined" || !window.gtag) {
    // Queue para quando o GA4 estiver pronto (em dev ou SSR)
    if (import.meta.env.DEV) {
      console.log("[Analytics]", eventName, params);
    }
    return;
  }

  window.gtag("event", eventName, params);
}

/**
 * Envia um pageview para o GA4
 */
export function sendGA4PageView(path: string, title?: string): void {
  if (typeof window === "undefined" || !window.gtag) {
    if (import.meta.env.DEV) {
      console.log("[Analytics] page_view", { path, title });
    }
    return;
  }

  window.gtag("event", "page_view", {
    page_path: path,
    page_title: title || document.title,
  });
}

/**
 * Define propriedades do usuário
 */
export function setGA4UserProperties(
  properties: Record<string, unknown>
): void {
  if (typeof window === "undefined" || !window.gtag) return;

  window.gtag("set", "user_properties", properties);
}

export { GA_MEASUREMENT_ID };
