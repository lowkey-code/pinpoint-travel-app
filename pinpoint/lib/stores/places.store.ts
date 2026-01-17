import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandStorage } from '../storage/zustand-adapter';
import {
    Place,
    CreatePlace,
    UpdatePlace,
    PlaceSchema,
    CreatePlaceSchema,
    UpdatePlaceSchema,
} from '../schemas/place.schema';

/**
 * Places Store State
 */
interface PlacesState {
    places: Place[];
    isLoading: boolean;
    error: string | null;
}

/**
 * Places Store Actions
 */
interface PlacesActions {
    addPlace: (place: CreatePlace) => void;
    updatePlace: (id: string, updates: UpdatePlace) => void;
    deletePlace: (id: string) => void;
    loadPlaces: () => void;
    clearError: () => void;
}

/**
 * Combined Store Type
 */
type PlacesStore = PlacesState & PlacesActions;

/**
 * Helper to generate UUID v4 (simple implementation)
 */
const generateUUID = (): string => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};

/**
 * Helper to sort places by creation date (most recent first)
 */
const sortPlacesByDate = (places: Place[]): Place[] => {
    return [...places].sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
};

/**
 * Places Zustand Store with Persist Middleware
 */
export const usePlacesStore = create<PlacesStore>()(
    persist(
        (set, get) => ({
            // Initial State
            places: [],
            isLoading: false,
            error: null,

            // Actions
            addPlace: (placeData) => {
                try {
                    set({ isLoading: true, error: null });

                    // Validate input data
                    const validatedData = CreatePlaceSchema.parse(placeData);

                    // Create new place with generated ID and timestamp
                    const newPlace: Place = {
                        ...validatedData,
                        id: generateUUID(),
                        createdAt: new Date(),
                    };

                    // Validate complete place object
                    PlaceSchema.parse(newPlace);

                    // Add to store and sort
                    const updatedPlaces = sortPlacesByDate([...get().places, newPlace]);

                    set({
                        places: updatedPlaces,
                        isLoading: false,
                    });
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Erro ao adicionar lugar';
                    console.error('[PlacesStore] Error adding place:', error);
                    set({
                        error: errorMessage,
                        isLoading: false,
                    });
                }
            },

            updatePlace: (id, updates) => {
                try {
                    set({ isLoading: true, error: null });

                    // Validate update data
                    const validatedUpdates = UpdatePlaceSchema.parse(updates);

                    // Find and update the place
                    const updatedPlaces = get().places.map((place) =>
                        place.id === id ? { ...place, ...validatedUpdates } : place
                    );

                    // Validate all places still conform to schema
                    updatedPlaces.forEach((place) => PlaceSchema.parse(place));

                    // Sort after update
                    const sortedPlaces = sortPlacesByDate(updatedPlaces);

                    set({
                        places: sortedPlaces,
                        isLoading: false,
                    });
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar lugar';
                    console.error('[PlacesStore] Error updating place:', error);
                    set({
                        error: errorMessage,
                        isLoading: false,
                    });
                }
            },

            deletePlace: (id) => {
                try {
                    set({ isLoading: true, error: null });

                    const updatedPlaces = get().places.filter((place) => place.id !== id);

                    set({
                        places: updatedPlaces,
                        isLoading: false,
                    });
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Erro ao deletar lugar';
                    console.error('[PlacesStore] Error deleting place:', error);
                    set({
                        error: errorMessage,
                        isLoading: false,
                    });
                }
            },

            loadPlaces: () => {
                try {
                    set({ isLoading: true, error: null });

                    // In this implementation, places are automatically loaded from persist
                    // This action could be used to reload from external source if needed
                    const sortedPlaces = sortPlacesByDate(get().places);

                    set({
                        places: sortedPlaces,
                        isLoading: false,
                    });
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Erro ao carregar lugares';
                    console.error('[PlacesStore] Error loading places:', error);
                    set({
                        error: errorMessage,
                        isLoading: false,
                    });
                }
            },

            clearError: () => {
                set({ error: null });
            },
        }),
        {
            name: 'places-storage',
            storage: createJSONStorage(() => zustandStorage, {
                reviver: (key, value) => {
                    if (key === 'createdAt' && typeof value === 'string') {
                        return new Date(value);
                    }
                    return value;
                },
            }),
        }
    )
);
