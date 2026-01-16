"use client"

import { useState } from "react"
import { Copy, Navigation, Trash2, MoreVertical, Check, Edit2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { CATEGORIES } from "@/lib/categories"
import type { Place } from "@/lib/types"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { EditPlaceSheet } from "@/components/edit-place-sheet"

interface PlaceCardProps {
  place: Place
  onDelete: (id: string) => void
  onUpdate: (id: string, updates: Partial<Place>) => void
}

export function PlaceCard({ place, onDelete, onUpdate }: PlaceCardProps) {
  const [copied, setCopied] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const category = CATEGORIES.find((c) => c.id === place.category)

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(place.address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const openInAMap = () => {
    // AMap (Gaode) deep link with address search
    const encodedAddress = encodeURIComponent(place.address)
    const amapUrl = `https://uri.amap.com/search?keyword=${encodedAddress}&src=tripstash`
    window.open(amapUrl, "_blank")
  }

  return (
    <>
      <Card className="p-4 bg-card border-border shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {category && (
                <span className="text-lg" role="img" aria-label={category.label}>
                  {category.icon}
                </span>
              )}
              <h3 className="font-serif font-semibold text-lg text-card-foreground truncate">{place.name}</h3>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{place.address}</p>
            {place.note && <p className="text-sm text-muted-foreground/80 italic line-clamp-1">💬 {place.note}</p>}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center tap-target hover:bg-secondary/80 transition-colors flex-shrink-0">
                <MoreVertical className="w-5 h-5 text-secondary-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
                <Edit2 className="w-4 h-4 mr-2" />
                Edit place
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(place.id)} className="text-destructive focus:text-destructive">
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
