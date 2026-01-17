export interface Category {
  id: string
  label: string
  icon: string
}

export const CATEGORIES: Category[] = [
  { id: "food", label: "Food", icon: "🍜" },
  { id: "museum", label: "Museum", icon: "🏛️" },
  { id: "viewpoint", label: "View", icon: "🌄" },
  { id: "hotel", label: "Hotel", icon: "🏨" },
  { id: "shopping", label: "Shop", icon: "🛍️" },
  { id: "transport", label: "Transit", icon: "🚇" },
]

export const CATEGORIES_BY_ID = new Map(
  CATEGORIES.map((category) => [category.id, category])
)
