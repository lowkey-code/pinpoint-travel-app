import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  getStorageKeyForEvents,
  readFromStorage,
  writeToStorage,
} from '@/lib/localStorage';

type UseLocalStorageOptions = {
  prefix?: string;
  sync?: boolean;
};

const DEFAULT_OPTIONS: UseLocalStorageOptions = {};

/**
 * React hook to persist state in localStorage with optional namespacing and cross-tab sync.
 *
 * @param key Storage key (namespaced via `prefix`).
 * @param initialValue Value to seed when no storage entry exists.
 * @param options Optional prefix override and cross-tab sync toggle (`sync === false` disables listeners).
 * @returns Tuple with current value and a setter that also writes to localStorage.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options?: UseLocalStorageOptions
) {
  const { prefix, sync } = options ?? DEFAULT_OPTIONS;
  const normalizedOptions = useMemo(
    () => ({ prefix, sync }),
    [prefix, sync]
  );

  const [storedValue, setStoredValue] = useState<T>(() => {
    const existing = readFromStorage<T>(key, normalizedOptions);
    if (existing !== undefined) {
      return existing;
    }
    writeToStorage(key, initialValue, normalizedOptions);
    return initialValue;
  });

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const nextValue = value instanceof Function ? value(prev) : value;
        writeToStorage(key, nextValue, normalizedOptions);
        return nextValue;
      });
    },
    [key, normalizedOptions]
  );

  useEffect(() => {
    if (normalizedOptions.sync === false) {
      return;
    }
    const storageKey = getStorageKeyForEvents(key, normalizedOptions);
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== storageKey) {
        return;
      }
      if (event.newValue === null) {
        setStoredValue(initialValue);
        return;
      }
      try {
        setStoredValue(JSON.parse(event.newValue) as T);
      } catch {
        setStoredValue(initialValue);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [initialValue, key, normalizedOptions]);

  return [storedValue, setValue] as const;
}
