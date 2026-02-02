/**
 * Google Analytics 4 Implementation
 * Implementação específica do GA4 - isolada da camada de abstração
 */

const GA_MEASUREMENT_ID = "G-FZ7EYX0BHY";

// Estado do GA4
let isScriptLoaded = false;
let isScriptLoading = false;
const eventQueue: Array<{ type: "event" | "page_view" | "user_properties"; args: unknown[] }> = [];

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

/**
 * Log seguro para desenvolvimento
 */
function devLog(...args: unknown[]): void {
  if (import.meta.env.DEV) {
    console.log("[Analytics]", ...args);
  }
}

/**
 * Processa a fila de eventos pendentes
 */
function flushEventQueue(): void {
  if (!isScriptLoaded || typeof window.gtag !== "function") return;

  while (eventQueue.length > 0) {
    const item = eventQueue.shift();
    if (!item) continue;

    try {
      switch (item.type) {
        case "event":
          window.gtag("event", ...(item.args as [string, Record<string, unknown>?]));
          break;
        case "page_view":
          window.gtag("event", "page_view", item.args[0]);
          break;
        case "user_properties":
          window.gtag("set", "user_properties", item.args[0]);
          break;
      }
    } catch (error) {
      devLog("Error flushing queued event:", error);
    }
  }
}

/**
 * Inicializa o dataLayer e a função gtag
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
  if (isScriptLoading || isScriptLoaded) return;

  // Verifica se já foi injetado por outro meio
  const existingScript = document.querySelector<HTMLScriptElement>(`script[src*="googletagmanager"]`);
  if (existingScript) {
    // Script existe - verifica se já carregou
    if (existingScript.dataset.loaded === "true") {
      isScriptLoaded = true;
      flushEventQueue();
      return;
    }
    // Aguarda o script existente carregar
    existingScript.addEventListener("load", handleScriptLoad);
    existingScript.addEventListener("error", handleScriptError);
    isScriptLoading = true;
    return;
  }

  isScriptLoading = true;
  devLog("Injecting GA4 script...");

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;

  script.addEventListener("load", handleScriptLoad);
  script.addEventListener("error", handleScriptError);

  document.head.appendChild(script);
  devLog("GA4 script element added to head");
}

function handleScriptLoad(): void {
  isScriptLoaded = true;
  isScriptLoading = false;
  devLog("GA4 script loaded, flushing", eventQueue.length, "queued events");
  flushEventQueue();
}

function handleScriptError(): void {
  isScriptLoading = false;
  devLog("GA4 script failed to load");
}

/**
 * Envia um evento para o GA4
 */
export function sendGA4Event(
  eventName: string,
  params?: Record<string, unknown>
): void {
  if (typeof window === "undefined") return;

  // Se o script ainda não carregou, adiciona na fila
  if (!isScriptLoaded) {
    eventQueue.push({ type: "event", args: [eventName, params] });
    devLog("Event queued:", eventName, params);
    return;
  }

  if (typeof window.gtag !== "function") {
    devLog("gtag not available:", eventName, params);
    return;
  }

  try {
    window.gtag("event", eventName, params);
    devLog("Event sent:", eventName, params);
  } catch (error) {
    devLog("Error sending event:", eventName, error);
  }
}

/**
 * Envia um pageview para o GA4
 */
export function sendGA4PageView(path: string, title?: string): void {
  if (typeof window === "undefined") return;

  const params = {
    page_path: path,
    page_title: title || document.title,
  };

  // Se o script ainda não carregou, adiciona na fila
  if (!isScriptLoaded) {
    eventQueue.push({ type: "page_view", args: [params] });
    devLog("Page view queued:", path);
    return;
  }

  if (typeof window.gtag !== "function") {
    devLog("gtag not available for page view:", path);
    return;
  }

  try {
    window.gtag("event", "page_view", params);
    devLog("Page view sent:", path);
  } catch (error) {
    devLog("Error sending page view:", path, error);
  }
}

/**
 * Define propriedades do usuário
 */
export function setGA4UserProperties(
  properties: Record<string, unknown>
): void {
  if (typeof window === "undefined") return;

  // Se o script ainda não carregou, adiciona na fila
  if (!isScriptLoaded) {
    eventQueue.push({ type: "user_properties", args: [properties] });
    devLog("User properties queued:", properties);
    return;
  }

  if (typeof window.gtag !== "function") return;

  try {
    window.gtag("set", "user_properties", properties);
  } catch (error) {
    devLog("Error setting user properties:", error);
  }
}

/**
 * Verifica se o GA4 está pronto
 */
export function isGA4Ready(): boolean {
  return isScriptLoaded && typeof window.gtag === "function";
}

export { GA_MEASUREMENT_ID };
