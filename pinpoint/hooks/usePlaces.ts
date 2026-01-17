import { useEffect, useState } from 'react';
import { usePlacesStore } from '../lib/stores/places.store';
import type { Place, CreatePlace, UpdatePlace } from '../lib/schemas/place.schema';

/**
 * Compatibility hook that wraps the Zustand store
 * Maintains the same API as the original web hook for easier migration
 * 
 * Original web hook used: useState + localStorage
 * This hook uses: Zustand + MMKV/AsyncStorage/localStorage
 */
export function usePlaces() {
    // Track if store has been hydrated
    const [isLoaded, setIsLoaded] = useState(false);

    // Select state from Zustand store
    const places = usePlacesStore((state) => state.places);
    const addPlaceAction = usePlacesStore((state) => state.addPlace);
    const deletePlace = usePlacesStore((state) => state.deletePlace);
    const updatePlaceAction = usePlacesStore((state) => state.updatePlace);
    const isLoading = usePlacesStore((state) => state.isLoading);

    // Mark as loaded after initial render (simulates localStorage load)
    useEffect(() => {
        // Small delay to allow Zustand persist to hydrate
        const timer = setTimeout(() => {
            setIsLoaded(true);
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    /**
     * Add a new place
     * Compatible with web API: Omit<Place, "id" | "createdAt">
     */
    const addPlace = (place: CreatePlace) => {
        addPlaceAction(place);
    };

    /**
     * Update an existing place
     * Compatible with web API: (id: string, updates: Partial<Place>)
     */
    const updatePlace = (id: string, updates: UpdatePlace) => {
        updatePlaceAction(id, updates);
    };

    // Return same API as web hook for compatibility
    return {
        places,
        addPlace,
        deletePlace,
        updatePlace,
        isLoaded: isLoaded && !isLoading,
    };
}
