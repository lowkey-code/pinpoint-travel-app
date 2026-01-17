import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { Header } from "~/components/header";
import { AddPlaceSheet } from "~/features/places/components/add-place-sheet";
import { CategoryFilter } from "~/features/places/components/category-filter";
import { EmptyState } from "~/features/places/components/empty-state";
import { PlacesList } from "~/features/places/components/places-list";
import { SearchBar } from "~/features/places/components/search-bar";
import { usePlaces } from "~/features/places/hooks/use-places";
import { useTheme } from "~/hooks/use-theme";

export default function IndexRoute() {
  const { places, addPlace, deletePlace, updatePlace } = usePlaces();
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);

  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.has("e2eError")) {
      throw new Error("E2E forced error");
    }
  }, [searchParams]);

  const normalizedQuery = useMemo(() => searchQuery.toLowerCase(), [searchQuery]);
  const filteredPlaces = useMemo(() => {
    return places.filter((place) => {
      const matchesSearch =
        place.name.toLowerCase().includes(normalizedQuery) ||
        place.address.toLowerCase().includes(normalizedQuery) ||
        place.note?.toLowerCase().includes(normalizedQuery);
      const matchesCategory = !selectedCategory || place.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [places, normalizedQuery, selectedCategory]);

  return (
    <main className="min-h-screen flex flex-col bg-background safe-bottom">
      <Header theme={theme} onToggleTheme={toggleTheme} placesCount={places.length} />

      <div className="flex-1 px-4 pb-24">
        <div className="max-w-lg mx-auto">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          <CategoryFilter
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            places={places}
          />

          {filteredPlaces.length > 0 ? (
            <PlacesList places={filteredPlaces} onDelete={deletePlace} onUpdate={updatePlace} />
          ) : (
            <EmptyState hasPlaces={places.length > 0} searchQuery={searchQuery} selectedCategory={selectedCategory} />
          )}
        </div>
      </div>

      <button
        onClick={() => setIsAddSheetOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center tap-target hover:scale-105 active:scale-95 transition-transform z-50"
        aria-label="Add new place"
        data-testid="add-place-button"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
      </button>

      <AddPlaceSheet isOpen={isAddSheetOpen} onClose={() => setIsAddSheetOpen(false)} onAdd={addPlace} />
    </main>
  );
}

export function ErrorBoundary() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background text-foreground p-6" data-testid="error-boundary">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-semibold mb-2">Algo deu errado</h1>
        <p className="text-muted-foreground">Tente recarregar a pagina ou voltar mais tarde.</p>
      </div>
    </main>
  );
}
