const DEFAULT_PREFIX = 'pinpoint';

type StorageOptions = {
  prefix?: string;
};

function getStorageKey(key: string, options?: StorageOptions) {
  const prefix = options?.prefix ?? DEFAULT_PREFIX;
  return `${prefix}:${key}`;
}

/**
 * Read a JSON-serialized value from localStorage using a namespaced key.
 * Returns the parsed data or undefined if missing, unsupported, or on parse errors.
 */
export function readFromStorage<T>(key: string, options?: StorageOptions) {
  if (typeof window === 'undefined' || !window.localStorage) {
    return undefined;
  }
  const storageKey = getStorageKey(key, options);
  const raw = window.localStorage.getItem(storageKey);
  if (!raw) {
    return undefined;
  }
  try {
    return JSON.parse(raw) as T;
  } catch {
    return undefined;
  }
}

/**
 * Persist a value in localStorage under a namespaced key.
 * Serializes the value with JSON and swallows serialization/quota errors to avoid crashing callers.
 */
export function writeToStorage<T>(key: string, value: T, options?: StorageOptions) {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }
  const storageKey = getStorageKey(key, options);
  try {
    const serialized = JSON.stringify(value);
    window.localStorage.setItem(storageKey, serialized);
  } catch {
    // Swallow write errors (serialization or quota) to avoid crashing the app
  }
}

export function removeFromStorage(key: string, options?: StorageOptions) {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }
  const storageKey = getStorageKey(key, options);
  window.localStorage.removeItem(storageKey);
}

export function getStorageKeyForEvents(key: string, options?: StorageOptions) {
  return getStorageKey(key, options);
}
