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
      <label className="block text-sm font-medium mb-2 font-body text-ink-primary">Tipo</label>
      <RadioGroup.Root
        value={value}
        onValueChange={(details) => onChange(details.value as ItemType)}
        disabled={disabled}
      >
        <div className="flex flex-wrap gap-2">
          {ITEM_TYPES.map((type) => (
            <RadioGroup.Item
              key={type}
              value={type}
              className={`px-3 py-2 rounded-lg border transition-colors text-sm flex items-center gap-2 cursor-pointer font-body ${
                value === type
                  ? "bg-action-blue text-white border-action-blue"
                  : "border-paper-line hover:bg-secondary text-ink-primary"
              }`}
              disabled={disabled}
              data-testid={`item-type-${type}`}
            >
              <RadioGroup.ItemHiddenInput />
              <span>{ITEM_TYPE_ICONS[type]}</span>
              <RadioGroup.ItemText>{ITEM_TYPE_LABELS[type]}</RadioGroup.ItemText>
            </RadioGroup.Item>
          ))}
        </div>
      </RadioGroup.Root>
    </div>
  )
}
