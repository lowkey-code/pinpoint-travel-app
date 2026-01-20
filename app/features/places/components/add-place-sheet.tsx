"use client"

import type React from "react"

import { useState } from "react"
import { X, MapPin } from "lucide-react"
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"
import { CATEGORIES } from "~/features/places/lib/categories"
import type { Place } from "~/features/places/lib/types"

interface AddPlaceSheetProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (place: Omit<Place, "id" | "createdAt">) => void
}

export function AddPlaceSheet({ isOpen, onClose, onAdd }: AddPlaceSheetProps) {
  const [name, setName] = useState("")
  const [address, setAddress] = useState("")
  const [category, setCategory] = useState("food")
  const [note, setNote] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !address.trim()) return

    onAdd({
      name: name.trim(),
      address: address.trim(),
      category,
      note: note.trim() || undefined,
    })

    // Reset form
    setName("")
    setAddress("")
    setCategory("food")
    setNote("")
    onClose()
  }

  const isValid = name.trim() && address.trim()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[60]" data-testid="add-place-sheet">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={onClose} />

      {/* Sheet */}
      <div className="absolute bottom-0 left-0 right-0 bg-background rounded-t-3xl max-h-[90vh] overflow-auto animate-in slide-in-from-bottom duration-300 safe-bottom">
        <div className="sticky top-0 bg-background px-4 pt-4 pb-2 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <MapPin className="w-4 h-4 text-primary" />
              </div>
              <h2 className="font-serif font-bold text-xl text-foreground">Add Place</h2>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center tap-target"
              aria-label="Close"
              data-testid="add-place-close"
            >
              <X className="w-5 h-5 text-secondary-foreground" />
            </button>
          </div>
          {/* Drag handle */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-muted" />
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-5">
          {/* Name */}
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-foreground">
              Place Name *
            </label>
            <Input
              id="name"
              type="text"
              placeholder="e.g., The Great Wall"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-14 text-base rounded-xl tap-target"
              autoFocus
              data-testid="add-place-name"
            />
          </div>

          {/* Address */}
          <div className="space-y-2">
            <label htmlFor="address" className="text-sm font-medium text-foreground">
              Full Address *
            </label>
            <Textarea
              id="address"
              placeholder="e.g., Badaling, Yanqing District, Beijing"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="min-h-[80px] text-base rounded-xl resize-none"
              rows={2}
              data-testid="add-place-address"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Category</label>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`h-14 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-colors tap-target ${
                    category === cat.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                  data-testid={`add-category-${cat.id}`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Note */}
          <div className="space-y-2">
            <label htmlFor="note" className="text-sm font-medium text-foreground">
              Note (optional)
            </label>
            <Textarea
              id="note"
              placeholder="Any tips or reminders..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="min-h-[60px] text-base rounded-xl resize-none"
              rows={2}
              data-testid="add-place-note"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!isValid}
            className="w-full h-14 bg-primary text-primary-foreground rounded-xl font-semibold text-base tap-target disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 active:scale-[0.98] transition-all"
            data-testid="add-place-save"
          >
            Save Place
          </button>
        </form>
      </div>
    </div>
  )
}
