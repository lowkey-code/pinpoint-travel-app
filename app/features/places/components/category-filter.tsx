"use client"

import { CATEGORIES } from "~/features/places/lib/categories"
import type { Place } from "~/features/places/lib/types"

interface CategoryFilterProps {
  selectedCategory: string | null
  onSelectCategory: (category: string | null) => void
  places: Place[]
}

export function CategoryFilter({ selectedCategory, onSelectCategory, places }: CategoryFilterProps) {
  const getCategoryCount = (categoryId: string) => {
    return places.filter((p) => p.category === categoryId).length
  }

  return (
    <div className="mt-4 -mx-4 px-4 overflow-x-auto scrollbar-hide">
      <div className="flex gap-2 pb-2">
        <button
          onClick={() => onSelectCategory(null)}
          className={`flex-shrink-0 px-4 py-2.5 rounded-full text-sm font-medium transition-colors tap-target ${
            selectedCategory === null
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          }`}
          data-testid="category-all"
        >
          All ({places.length})
        </button>
        {CATEGORIES.map((category) => {
          const count = getCategoryCount(category.id)
          if (count === 0) return null
          return (
            <button
              key={category.id}
              onClick={() => onSelectCategory(selectedCategory === category.id ? null : category.id)}
              className={`flex-shrink-0 px-4 py-2.5 rounded-full text-sm font-medium transition-colors tap-target flex items-center gap-2 ${
                selectedCategory === category.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
              data-testid={`category-${category.id}`}
            >
              <span>{category.icon}</span>
              <span>{category.label}</span>
              <span className="opacity-70">({count})</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
