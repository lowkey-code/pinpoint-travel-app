"use client"

import { MapPin, Sun, Moon } from "lucide-react"

interface HeaderProps {
  theme: "light" | "dark"
  onToggleTheme: () => void
  placesCount: number
}

export function Header({ theme, onToggleTheme, placesCount }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <MapPin className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-serif font-bold text-xl text-foreground">TripStash</h1>
            <p className="text-xs text-muted-foreground">
              {placesCount} {placesCount === 1 ? "place" : "places"} saved
            </p>
          </div>
        </div>

        <button
          onClick={onToggleTheme}
          className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center tap-target hover:bg-secondary/80 transition-colors"
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? (
            <Moon className="w-5 h-5 text-secondary-foreground" />
          ) : (
            <Sun className="w-5 h-5 text-secondary-foreground" />
          )}
        </button>
      </div>
    </header>
  )
}
