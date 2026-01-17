import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Universal storage adapter interface
 * Works across iOS, Android, and Web
 */
export interface StorageAdapter {
    getString: (key: string) => string | null | undefined;
    set: (key: string, value: string) => void;
    delete: (key: string) => void;
    contains: (key: string) => boolean;
    clearAll?: () => void;
}

/**
 * Creates a storage adapter based on the platform
 * Priority:
 * 1. Web: localStorage
 * 2. Native (Production): MMKV
 * 3. Native (Expo Go): AsyncStorage
 */
const createStorage = (): StorageAdapter => {
    if (Platform.OS === 'web') {
        // Web implementation using localStorage
        console.log('[Storage] Using localStorage for web');
        return {
            getString: (key: string) => {
                try {
                    return localStorage.getItem(key);
                } catch (error) {
                    console.error('[Storage] Error reading from localStorage:', error);
                    return null;
                }
            },
            set: (key: string, value: string) => {
                try {
                    localStorage.setItem(key, value);
                } catch (error) {
                    console.error('[Storage] Error writing to localStorage:', error);
                }
            },
            delete: (key: string) => {
                try {
                    localStorage.removeItem(key);
                } catch (error) {
                    console.error('[Storage] Error deleting from localStorage:', error);
                }
            },
            contains: (key: string) => {
                try {
                    return localStorage.getItem(key) !== null;
                } catch (error) {
                    console.error('[Storage] Error checking localStorage:', error);
                    return false;
                }
            },
            clearAll: () => {
                try {
                    localStorage.clear();
                } catch (error) {
                    console.error('[Storage] Error clearing localStorage:', error);
                }
            },
        };
    }

    // Try MMKV first (production builds)
    try {
        const { MMKV } = require('react-native-mmkv');
        const mmkv = new MMKV();

        // Test if MMKV actually works
        mmkv.set('__test__', 'test');
        const testValue = mmkv.getString('__test__');
        mmkv.delete('__test__');

        if (testValue !== 'test') {
            throw new Error('MMKV test failed');
        }

        console.log('[Storage] Using MMKV for native (production)');

        return {
            getString: (key: string) => {
                try {
                    return mmkv.getString(key);
                } catch (error) {
                    console.error('[Storage] Error reading from MMKV:', error);
                    return undefined;
                }
            },
            set: (key: string, value: string) => {
                try {
                    mmkv.set(key, value);
                } catch (error) {
                    console.error('[Storage] Error writing to MMKV:', error);
                }
            },
            delete: (key: string) => {
                try {
                    mmkv.delete(key);
                } catch (error) {
                    console.error('[Storage] Error deleting from MMKV:', error);
                }
            },
            contains: (key: string) => {
                try {
                    return mmkv.contains(key);
                } catch (error) {
                    console.error('[Storage] Error checking MMKV:', error);
                    return false;
                }
            },
            clearAll: () => {
                try {
                    mmkv.clearAll();
                } catch (error) {
                    console.error('[Storage] Error clearing MMKV:', error);
                }
            },
        };
    } catch (mmkvError) {
        // Fallback to AsyncStorage (Expo Go)
        console.warn('[Storage] MMKV not available, using AsyncStorage (Expo Go fallback)');

        // AsyncStorage is async, but Zustand needs sync API
        // We use a cache that's populated on first access
        const cache = new Map<string, string>();
        let isHydrating = false;
        let isHydrated = false;

        // Synchronously load from AsyncStorage (blocking)
        const hydrateCache = () => {
            if (isHydrated || isHydrating) return;
            isHydrating = true;

            // Use a synchronous approach: we'll load all keys immediately
            // This is a workaround since AsyncStorage is async but we need sync reads
            AsyncStorage.getAllKeys()
                .then((keys) => AsyncStorage.multiGet(keys))
                .then((items) => {
                    items.forEach(([key, value]) => {
                        if (value) cache.set(key, value);
                    });
                    isHydrated = true;
                    isHydrating = false;
                    console.log('[Storage] AsyncStorage cache hydrated with', cache.size, 'items');
                })
                .catch((error) => {
                    console.error('[Storage] Error hydrating AsyncStorage cache:', error);
                    isHydrating = false;
                });
        };

        // Start hydration immediately
        hydrateCache();

        return {
            getString: (key: string) => {
                // If not hydrated yet, return null (will be populated on next read after hydration)
                if (!isHydrated) {
                    console.warn('[Storage] Cache not yet hydrated, returning null for key:', key);
                    return null;
                }
                return cache.get(key) ?? null;
            },
            set: (key: string, value: string) => {
                cache.set(key, value);
                // Persist async (fire and forget)
                AsyncStorage.setItem(key, value).catch((error) =>
                    console.error('[Storage] Error persisting to AsyncStorage:', error)
                );
            },
            delete: (key: string) => {
                cache.delete(key);
                // Persist async (fire and forget)
                AsyncStorage.removeItem(key).catch((error) =>
                    console.error('[Storage] Error deleting from AsyncStorage:', error)
                );
            },
            contains: (key: string) => {
                if (!isHydrated) return false;
                return cache.has(key);
            },
            clearAll: () => {
                cache.clear();
                // Persist async (fire and forget)
                AsyncStorage.clear().catch((error) =>
                    console.error('[Storage] Error clearing AsyncStorage:', error)
                );
            },
        };
    }
};

/**
 * Universal storage singleton
 * Use this throughout the app for persistent storage
 */
export const storage = createStorage();
