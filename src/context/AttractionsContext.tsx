import { createContext, useCallback, useContext, useMemo } from 'react';
import type { Attraction } from '@/types/attraction';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { seedAttractions } from '@/data/attractions';

type AttractionInput = Omit<Attraction, 'id'>;
type AttractionUpdate = Partial<AttractionInput>;

type AttractionsContextValue = {
  attractions: Attraction[];
  createAttraction: (input: AttractionInput) => Attraction;
  updateAttraction: (id: string, updates: AttractionUpdate) => Attraction | null;
  deleteAttraction: (id: string) => void;
  getAttractionById: (id: string) => Attraction | undefined;
};

const AttractionsContext = createContext<AttractionsContextValue | undefined>(
  undefined
);

const STORAGE_KEY = 'attractions';

function generateId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function AttractionsProvider({ children }: { children: React.ReactNode }) {
  const [attractions, setAttractions] = useLocalStorage<Attraction[]>(
    STORAGE_KEY,
    seedAttractions
  );

  const createAttraction = useCallback(
    (input: AttractionInput) => {
      const nextAttraction: Attraction = {
        id: generateId(),
        ...input,
      };
      setAttractions((prev) => [...prev, nextAttraction]);
      return nextAttraction;
    },
    [setAttractions]
  );

  const updateAttraction = useCallback(
    (id: string, updates: AttractionUpdate) => {
      let updated: Attraction | null = null;
      setAttractions((prev) =>
        prev.map((item) => {
          if (item.id !== id) {
            return item;
          }
          updated = { ...item, ...updates, id: item.id };
          return updated;
        })
      );
      return updated;
    },
    [setAttractions]
  );

  const deleteAttraction = useCallback(
    (id: string) => {
      setAttractions((prev) => prev.filter((item) => item.id !== id));
    },
    [setAttractions]
  );

  const value = useMemo(
    () => ({
      attractions,
      createAttraction,
      updateAttraction,
      deleteAttraction,
      getAttractionById: (id: string) => attractions.find((item) => item.id === id),
    }),
    [attractions, createAttraction, deleteAttraction, updateAttraction]
  );

  return (
    <AttractionsContext.Provider value={value}>
      {children}
    </AttractionsContext.Provider>
  );
}

export function useAttractions() {
  const context = useContext(AttractionsContext);
  if (!context) {
    throw new Error('useAttractions must be used within an AttractionsProvider');
  }
  return context;
}
