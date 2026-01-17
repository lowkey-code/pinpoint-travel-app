import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandStorage } from './zustand-adapter';

/**
 * Test store to validate storage functionality
 * This demonstrates how to use the universal storage with Zustand
 */
interface TestStore {
    testValue: string;
    counter: number;
    setTestValue: (value: string) => void;
    incrementCounter: () => void;
    reset: () => void;
}

export const useTestStore = create<TestStore>()(
    persist(
        (set) => ({
            testValue: '',
            counter: 0,
            setTestValue: (value: string) => set({ testValue: value }),
            incrementCounter: () => set((state) => ({ counter: state.counter + 1 })),
            reset: () => set({ testValue: '', counter: 0 }),
        }),
        {
            name: 'test-storage',
            storage: createJSONStorage(() => zustandStorage),
        }
    )
);
