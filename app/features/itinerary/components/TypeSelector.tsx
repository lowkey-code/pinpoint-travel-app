import type { ItemType } from "~/features/itinerary"
import { ITEM_TYPES, ITEM_TYPE_LABELS, ITEM_TYPE_ICONS } from "~/features/itinerary"
import { RadioGroup } from "@ark-ui/react"

interface TypeSelectorProps {
  value: ItemType
  onChange: (value: ItemType) => void
  disabled?: boolean
}

export function TypeSelector({ value, onChange, disabled = false }: TypeSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">Tipo</label>
      <RadioGroup.Root
        value={value}
        onValueChange={(details) => onChange(details.value as ItemType)}
        disabled={disabled}
      >
        <div className="flex flex-wrap gap-2">
          {ITEM_TYPES.map((type) => (
            <RadioGroup.Item key={type} value={type} asChild>
              <button
                className={`px-3 py-2 rounded-lg border transition-colors text-sm flex items-center gap-2 ${
                  value === type
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border hover:bg-secondary"
                }`}
                disabled={disabled}
                data-testid={`item-type-${type}`}
              >
                <span>{ITEM_TYPE_ICONS[type]}</span>
                <span>{ITEM_TYPE_LABELS[type]}</span>
                <RadioGroup.ItemControl />
              </button>
            </RadioGroup.Item>
          ))}
        </div>
      </RadioGroup.Root>
    </div>
  )
}
