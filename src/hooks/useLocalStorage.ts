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

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options?: UseLocalStorageOptions
) {
  const normalizedOptions = useMemo(
    () => options ?? {},
    [options]
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
