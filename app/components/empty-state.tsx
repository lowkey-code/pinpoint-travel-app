"use client"

import { MapPin, Search, Filter } from "lucide-react"

interface EmptyStateProps {
  hasPlaces: boolean
  searchQuery: string
  selectedCategory: string | null
}

export function EmptyState({ hasPlaces, searchQuery, selectedCategory }: EmptyStateProps) {
  if (hasPlaces && (searchQuery || selectedCategory)) {
    return (
      <div className="mt-16 text-center px-4" data-testid="empty-state">
        <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
          {searchQuery ? (
            <Search className="w-8 h-8 text-muted-foreground" />
          ) : (
            <Filter className="w-8 h-8 text-muted-foreground" />
          )}
        </div>
        <h3 className="font-serif font-semibold text-lg text-foreground mb-2">No matching places</h3>
        <p className="text-muted-foreground text-sm">
          {searchQuery ? `No places found for "${searchQuery}"` : "No places in this category yet"}
        </p>
      </div>
    )
  }

  return (
    <div className="mt-16 text-center px-4" data-testid="empty-state">
      <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <MapPin className="w-10 h-10 text-primary" />
      </div>
      <h3 className="font-serif font-semibold text-xl text-foreground mb-2">Start your journey</h3>
      <p className="text-muted-foreground text-base mb-6 max-w-xs mx-auto">
        Save places you want to visit or remember. They'll be available even offline!
      </p>
      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <span>Tap the</span>
        <span className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-primary-foreground"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
        </span>
        <span>button to add a place</span>
      </div>
    </div>
  )
}
