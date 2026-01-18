"use client"

import { useMemo } from "react"
import { RadioGroup } from "@ark-ui/react"
import { CATEGORIES } from "~/features/places/lib/categories"
import type { Place } from "~/features/places/lib/types"

interface CategoryFilterProps {
  selectedCategory: string | null
  onSelectCategory: (category: string | null) => void
  places: Place[]
}

export function CategoryFilter({ selectedCategory, onSelectCategory, places }: CategoryFilterProps) {
  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>()
    for (const place of places) {
      counts.set(place.category, (counts.get(place.category) ?? 0) + 1)
    }
    return counts
  }, [places])

  return (
    <div className="mt-4 -mx-4 px-4 overflow-x-auto scrollbar-hide">
      <RadioGroup.Root
        className="flex gap-2 pb-2"
        value={selectedCategory ?? "all"}
        onValueChange={(details) => {
          onSelectCategory(details.value === "all" ? null : details.value)
        }}
      >
        <RadioGroup.Label className="sr-only">Category</RadioGroup.Label>
        <RadioGroup.Item
          value="all"
          className="flex-shrink-0 px-4 py-2.5 rounded-full text-sm font-medium transition-colors tap-target bg-secondary text-secondary-foreground hover:bg-secondary/80 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
          data-testid="category-all"
        >
          <RadioGroup.ItemText>All ({places.length})</RadioGroup.ItemText>
        </RadioGroup.Item>
        {CATEGORIES.map((category) => {
          const count = categoryCounts.get(category.id) ?? 0
          if (count === 0) return null
          return (
            <RadioGroup.Item
              key={category.id}
              value={category.id}
              className="flex-shrink-0 px-4 py-2.5 rounded-full text-sm font-medium transition-colors tap-target flex items-center gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
              data-testid={`category-${category.id}`}
            >
              <span>{category.icon}</span>
              <RadioGroup.ItemText>{category.label}</RadioGroup.ItemText>
              <span className="opacity-70">({count})</span>
            </RadioGroup.Item>
          )
        })}
      </RadioGroup.Root>
    </div>
  )
}
