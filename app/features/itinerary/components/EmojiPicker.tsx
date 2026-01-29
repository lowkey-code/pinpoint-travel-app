import { useState } from "react"
import type { ItemType } from "../lib/types"
import { cn } from "~/lib/utils"

interface EmojiPickerProps {
  value: string
  onChange: (emoji: string) => void
  itemType: ItemType
}

const EMOJI_SUGGESTIONS: Record<ItemType, string[]> = {
  activity: ["🎯", "🏛️", "🎭", "🎨", "📸", "🏖️", "🍕", "☕", "🛍️", "🎢"],
  transport: ["✈️", "🚗", "🚆", "🚌", "🚢", "🚕", "🚇", "🛫", "🚐", "🚀"],
  stay: ["🏨", "🏠", "⛺", "🛏️", "🏡", "🏰", "🏕️", "🛖", "🏘️", "🌴"],
  dayTrip: ["🗺️", "🧭", "🎒", "🚶", "🏔️", "🌲", "🏞️", "🌊", "🌅", "⛰️"],
  quick: ["⭐", "📌", "💡", "🔖", "📍", "✨", "💫", "🎯", "📝", "🔔"],
}

export function EmojiPicker({ value, onChange, itemType }: EmojiPickerProps) {
  const [showCustomInput, setShowCustomInput] = useState(false)
  const suggestions = EMOJI_SUGGESTIONS[itemType] || EMOJI_SUGGESTIONS.activity

  const handleEmojiSelect = (emoji: string) => {
    onChange(emoji)
    setShowCustomInput(false)
  }

  const isSelected = (emoji: string) => value === emoji
  const isCustomEmoji = value && !suggestions.includes(value)

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium font-body text-ink-primary">
        Ícone
      </label>

      {/* Emoji Grid */}
      <div className="flex flex-wrap gap-1.5">
        {suggestions.slice(0, 8).map((emoji) => (
          <button
            key={emoji}
            type="button"
            onClick={() => handleEmojiSelect(emoji)}
            className={cn(
              "w-10 h-10 flex items-center justify-center rounded-lg text-xl",
              "border transition-all duration-150 tap-target",
              "hover:scale-110 hover:shadow-md",
              isSelected(emoji)
                ? "border-action-blue bg-action-blue/10 ring-2 ring-action-blue/30"
                : "border-paper-line bg-paper-card hover:border-ink-utility"
            )}
            aria-label={`Selecionar emoji ${emoji}`}
            aria-pressed={isSelected(emoji)}
          >
            {emoji}
          </button>
        ))}

        {/* Custom emoji button or display */}
        {isCustomEmoji && !showCustomInput ? (
          <button
            type="button"
            onClick={() => setShowCustomInput(true)}
            className="w-10 h-10 flex items-center justify-center rounded-lg text-xl border border-action-blue bg-action-blue/10 ring-2 ring-action-blue/30"
            aria-label={`Emoji personalizado: ${value}`}
          >
            {value}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setShowCustomInput(!showCustomInput)}
            className={cn(
              "w-10 h-10 flex items-center justify-center rounded-lg text-xs font-mono",
              "border border-dashed border-paper-line bg-paper-card",
              "hover:border-ink-utility transition-colors tap-target",
              showCustomInput && "border-action-blue bg-action-blue/5"
            )}
            aria-label="Adicionar emoji personalizado"
          >
            {showCustomInput ? "..." : "+"}
          </button>
        )}
      </div>

      {/* Custom Input */}
      {showCustomInput && (
        <div className="flex gap-2 items-center animate-in fade-in slide-in-from-top-2 duration-200">
          <input
            type="text"
            value={isCustomEmoji ? value : ""}
            onChange={(e) => {
              const newValue = e.target.value.slice(0, 2)
              onChange(newValue)
            }}
            className="flex-1 px-3 py-2 border border-paper-line rounded-lg bg-paper-card focus:ring-2 focus:ring-action-blue outline-none text-center text-xl"
            placeholder="🎉"
            maxLength={2}
            autoFocus
            aria-label="Emoji personalizado"
          />
          <button
            type="button"
            onClick={() => {
              setShowCustomInput(false)
              if (!value) onChange(suggestions[0])
            }}
            className="px-3 py-2 text-sm text-ink-secondary hover:text-ink-primary transition-colors font-body"
          >
            OK
          </button>
        </div>
      )}
    </div>
  )
}
