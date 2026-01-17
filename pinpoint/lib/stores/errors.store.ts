import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandStorage } from '../storage/zustand-adapter';

export interface AppError {
    id: string;
    message: string;
    stack?: string;
    source: 'javascript' | 'promise' | 'react' | 'app';
    timestamp: Date;
    context?: Record<string, unknown>;
}

interface ErrorsState {
    errors: AppError[];
}

interface ErrorsActions {
    addError: (error: AppError) => void;
    clearErrors: () => void;
    removeError: (id: string) => void;
}

type ErrorsStore = ErrorsState & ErrorsActions;

const generateErrorId = (): string => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const useErrorsStore = create<ErrorsStore>()(
    persist(
        (set, get) => ({
            errors: [],

            addError: (error) => {
                const errorWithId: AppError = {
                    ...error,
                    id: error.id || generateErrorId(),
                };

                set((state) => ({
                    errors: [errorWithId, ...state.errors].slice(0, 100),
                }));
            },

            removeError: (id) => {
                set((state) => ({
                    errors: state.errors.filter((err) => err.id !== id),
                }));
            },

            clearErrors: () => {
                set({ errors: [] });
            },
        }),
        {
            name: 'errors-storage',
            storage: createJSONStorage(() => zustandStorage, {
                reviver: (key, value) => {
                    if (key === 'timestamp' && typeof value === 'string') {
                        return new Date(value);
                    }
                    return value;
                },
            }),
        }
    )
);
