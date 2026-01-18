"use client"

import { useEffect, useRef, useState } from "react"
import { Copy, Navigation, Trash2, MoreVertical, Check, Edit2 } from "lucide-react"
import { Card } from "~/components/ui/card"
import { CATEGORIES_BY_ID } from "~/features/places/lib/categories"
import type { Place } from "~/features/places/lib/types"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "~/components/ui/dropdown-menu"
import { EditPlaceSheet } from "~/features/places/components/edit-place-sheet"

interface PlaceCardProps {
  place: Place
  onDelete: (id: string) => void
  onUpdate: (id: string, updates: Partial<Place>) => void
}

export function PlaceCard({ place, onDelete, onUpdate }: PlaceCardProps) {
  const [copied, setCopied] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const category = CATEGORIES_BY_ID.get(place.category)

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current)
      }
    }
  }, [])

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(place.address)
      setCopied(true)
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current)
      }
      copyTimeoutRef.current = setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const openInAMap = () => {
    // AMap (Gaode) deep link with address search
    const encodedAddress = encodeURIComponent(place.address)
    const amapUrl = `https://uri.amap.com/search?keyword=${encodedAddress}&src=pinpoint`
    window.open(amapUrl, "_blank")
  }

  return (
    <>
      <Card className="p-4 bg-card border-border shadow-sm hover:shadow-md transition-shadow" data-testid={`place-card-${place.id}`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {category && (
                <span className="text-lg" role="img" aria-label={category.label}>
                  {category.icon}
                </span>
              )}
              <h3 className="font-serif font-semibold text-lg text-card-foreground truncate" data-testid="place-name">
                {place.name}
              </h3>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-2" data-testid="place-address">
              {place.address}
            </p>
            {place.note && (
              <p className="text-sm text-muted-foreground/80 italic line-clamp-1" data-testid="place-note">
                💬 {place.note}
              </p>
            )}
          </div>

          <DropdownMenu positioning={{ placement: "bottom-end", offset: { mainAxis: 4 } }}>
            <DropdownMenuTrigger asChild>
              <button
                className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center tap-target hover:bg-secondary/80 transition-colors flex-shrink-0"
                aria-label="Open place actions"
                data-testid={`place-menu-${place.id}`}
              >
                <MoreVertical className="w-5 h-5 text-secondary-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              <DropdownMenuItem onClick={() => setIsEditOpen(true)} data-testid={`place-edit-${place.id}`}>
                <Edit2 className="w-4 h-4 mr-2" />
                Edit place
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(place.id)}
                className="text-destructive focus:text-destructive"
                data-testid={`place-delete-${place.id}`}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete place
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={copyAddress}
            className="flex-1 h-12 bg-secondary text-secondary-foreground rounded-xl flex items-center justify-center gap-2 tap-target hover:bg-secondary/80 active:scale-[0.98] transition-all font-medium"
            data-testid={`place-copy-${place.id}`}
          >
            {copied ? (
              <>
                <Check className="w-5 h-5 text-green-600" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-5 h-5" />
                <span>Copy</span>
              </>
            )}
          </button>
          <button
            onClick={openInAMap}
            className="flex-1 h-12 bg-primary text-primary-foreground rounded-xl flex items-center justify-center gap-2 tap-target hover:bg-primary/90 active:scale-[0.98] transition-all font-medium"
            data-testid={`place-amap-${place.id}`}
          >
            <Navigation className="w-5 h-5" />
            <span>Open AMap</span>
          </button>
        </div>
      </Card>

      <EditPlaceSheet
        place={place}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSave={(updates) => {
          onUpdate(place.id, updates)
          setIsEditOpen(false)
        }}
      />
    </>
  )
}
