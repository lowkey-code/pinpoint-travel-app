import { StateStorage } from 'zustand/middleware';
import { storage } from './universal-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

/**
 * Zustand-compatible storage adapter
 * Handles both sync (localStorage, MMKV) and async (AsyncStorage) backends
 */
export const zustandStorage: StateStorage = {
    getItem: async (name: string): Promise<string | null> => {
        // For web and MMKV (sync), use the universal storage
        if (Platform.OS === 'web') {
            const value = storage.getString(name);
            return value ?? null;
        }

        // For AsyncStorage (Expo Go), read directly to avoid cache timing issues
        try {
            // Try MMKV first
            const value = storage.getString(name);
            if (value !== null && value !== undefined) {
                return value;
            }

            // Fallback to AsyncStorage direct read
            const asyncValue = await AsyncStorage.getItem(name);
            return asyncValue;
        } catch (error) {
            console.error('[ZustandAdapter] Error reading:', error);
            return null;
        }
    },
    setItem: async (name: string, value: string): Promise<void> => {
        storage.set(name, value);
    },
    removeItem: async (name: string): Promise<void> => {
        storage.delete(name);
    },
};
