const DEFAULT_PREFIX = 'pinpoint';

type StorageOptions = {
  prefix?: string;
};

function getStorageKey(key: string, options?: StorageOptions) {
  const prefix = options?.prefix ?? DEFAULT_PREFIX;
  return `${prefix}:${key}`;
}

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

export function writeToStorage<T>(key: string, value: T, options?: StorageOptions) {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }
  const storageKey = getStorageKey(key, options);
  window.localStorage.setItem(storageKey, JSON.stringify(value));
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
