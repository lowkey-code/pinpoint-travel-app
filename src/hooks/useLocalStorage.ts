import { useCallback, useEffect, useState } from 'react';
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
  const [storedValue, setStoredValue] = useState<T>(() => {
    const existing = readFromStorage<T>(key, options);
    if (existing !== undefined) {
      return existing;
    }
    return initialValue;
  });

  useEffect(() => {
    const existing = readFromStorage<T>(key, options);
    if (existing === undefined) {
      writeToStorage(key, storedValue, options);
    } else {
      setStoredValue(existing);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const nextValue = value instanceof Function ? value(prev) : value;
        writeToStorage(key, nextValue, options);
        return nextValue;
      });
    },
    [key, options]
  );

  useEffect(() => {
    if (options?.sync === false) {
      return;
    }
    const storageKey = getStorageKeyForEvents(key, options);
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
  }, [initialValue, key, options]);

  return [storedValue, setValue] as const;
}
