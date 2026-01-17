"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { PlacesList } from "@/components/places-list"
import { AddPlaceSheet } from "@/components/add-place-sheet"
import { CategoryFilter } from "@/components/category-filter"
import { SearchBar } from "@/components/search-bar"
import { EmptyState } from "@/components/empty-state"
import { usePlaces } from "@/hooks/use-places"
import { useTheme } from "@/hooks/use-theme"

export default function Home() {
  const { places, addPlace, deletePlace, updatePlace } = usePlaces()
  const { theme, toggleTheme } = useTheme()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false)

  const filteredPlaces = places.filter((place) => {
    const matchesSearch =
      place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.note?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !selectedCategory || place.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <main className="min-h-screen flex flex-col bg-background safe-bottom">
      <Header theme={theme} onToggleTheme={toggleTheme} placesCount={places.length} />

      <div className="flex-1 px-4 pb-24">
        <div className="max-w-lg mx-auto">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          <CategoryFilter selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} places={places} />

          {filteredPlaces.length > 0 ? (
            <PlacesList places={filteredPlaces} onDelete={deletePlace} onUpdate={updatePlace} />
          ) : (
            <EmptyState hasPlaces={places.length > 0} searchQuery={searchQuery} selectedCategory={selectedCategory} />
          )}
        </div>
      </div>

      {/* Floating Add Button */}
      <button
        onClick={() => setIsAddSheetOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center tap-target hover:scale-105 active:scale-95 transition-transform z-50"
        aria-label="Add new place"
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
  )
}
