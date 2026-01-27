import { useState, useEffect } from "react"
import { Dialog, Portal } from "@ark-ui/react"
import { useItinerary, SEGMENTS, SEGMENT_LABELS } from "~/features/itinerary"
import type { Segment, ItineraryItem, ItemStatus, ItemPriority, ItemType } from "~/features/itinerary"
import { X, ArrowRight } from "lucide-react"
import { TypeSelector } from "./TypeSelector"
import { StayFields } from "./StayFields"
import { LinksEditor } from "./LinksEditor"

interface ItemDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  dayIndex: number
  segment: Segment
  item?: ItineraryItem
}

export function ItemDrawer({ open, onOpenChange, dayIndex, segment, item }: ItemDrawerProps) {
  const { addItem, updateItem, convertQuickToActivity } = useItinerary()

  const [itemType, setItemType] = useState<ItemType>("activity")
  const [title, setTitle] = useState("")
  const [icon, setIcon] = useState("")
  const [timeLabel, setTimeLabel] = useState("")
  const [durationText, setDurationText] = useState("")
  const [costText, setCostText] = useState("")
  const [city, setCity] = useState("")
  const [addressText, setAddressText] = useState("")
  const [lat, setLat] = useState("")
  const [lng, setLng] = useState("")
  const [links, setLinks] = useState<string[]>([])
  const [notes, setNotes] = useState("")
  const [status, setStatus] = useState<ItemStatus>("planned")
  const [priority, setPriority] = useState<ItemPriority>(0)
  const [isDayTrip, setIsDayTrip] = useState(false)
  const [coversSegments, setCoversSegments] = useState<Segment[]>([])
  const [breakfastIncluded, setBreakfastIncluded] = useState(false)

  // Load item data for editing
  useEffect(() => {
    if (item) {
      setItemType(item.itemType)
      setTitle(item.title)
      setIcon(item.icon || "")
      setTimeLabel(item.timeLabel || "")
      setDurationText(item.durationText || "")
      setCostText(item.costText || "")
      setCity(item.city || "")
      setAddressText(item.addressText || "")
      setLat(item.lat?.toString() || "")
      setLng(item.lng?.toString() || "")
      setLinks(item.links || [])
      setNotes(item.notes || "")
      setStatus(item.status)
      setPriority(item.priority)
      setIsDayTrip(item.isDayTrip || false)
      setCoversSegments(item.coversSegments || [])
      setBreakfastIncluded(item.breakfastIncluded || false)
    }
  }, [item, open])

  // Auto-set isDayTrip when type is "dayTrip"
  useEffect(() => {
    if (itemType === "dayTrip") {
      setIsDayTrip(true)
    } else {
      setIsDayTrip(false)
      setCoversSegments([])
    }
  }, [itemType])

  const handleSave = () => {
    // Validation: title required unless quick type
    if (itemType !== "quick" && !title.trim()) {
      return
    }

    const parsedLat = lat ? parseFloat(lat) : undefined
    const parsedLng = lng ? parseFloat(lng) : undefined

    const data = {
      itemType,
      title: title.trim() || "Item rápido",
      icon: icon || undefined,
      timeLabel: timeLabel || undefined,
      durationText: durationText || undefined,
      costText: costText || undefined,
      city: city || undefined,
      addressText: addressText || undefined,
      lat: parsedLat && !isNaN(parsedLat) ? parsedLat : undefined,
      lng: parsedLng && !isNaN(parsedLng) ? parsedLng : undefined,
      links: links.filter((l) => l.trim()).length > 0 ? links.filter((l) => l.trim()) : undefined,
      notes: notes || undefined,
      status,
      priority,
      isDayTrip: isDayTrip || undefined,
      primarySegment: isDayTrip ? segment : undefined,
      coversSegments: isDayTrip && coversSegments.length > 0 ? coversSegments : undefined,
      breakfastIncluded: itemType === "stay" ? breakfastIncluded : undefined,
    }

    if (item) {
      updateItem(item.id, data)
    } else {
      addItem(dayIndex, segment, data)
    }

    handleClose()
  }

  const handleClose = () => {
    onOpenChange(false)
    // Reset form
    setItemType("activity")
    setTitle("")
    setIcon("")
    setTimeLabel("")
    setDurationText("")
    setCostText("")
    setCity("")
    setAddressText("")
    setLat("")
    setLng("")
    setLinks([])
    setNotes("")
    setStatus("planned")
    setPriority(0)
    setIsDayTrip(false)
    setCoversSegments([])
    setBreakfastIncluded(false)
  }

  const toggleSegment = (seg: Segment) => {
    setCoversSegments((prev) =>
      prev.includes(seg) ? prev.filter((s) => s !== seg) : [...prev, seg]
    )
  }

  const isTitleRequired = itemType !== "quick"
  const canSave = !isTitleRequired || title.trim().length > 0
  const isQuickItem = item?.itemType === "quick"

  const handleConvertToActivity = () => {
    if (!item || item.itemType !== "quick") return
    convertQuickToActivity(item.id)
    handleClose()
  }

  return (
    <Dialog.Root open={open} onOpenChange={(details) => onOpenChange(details.open)}>
      <Portal>
        <Dialog.Backdrop className="fixed inset-0 bg-black/50 z-40" />
        <Dialog.Positioner className="fixed inset-0 z-50 flex items-end">
          <Dialog.Content className="bg-background w-full max-h-[90vh] rounded-t-2xl shadow-xl overflow-y-auto" data-testid="item-drawer">
            {/* Header */}
            <div className="sticky top-0 bg-background border-b border-border p-4 z-10">
              <div className="flex items-center justify-between">
                <Dialog.Title className="text-xl font-serif font-bold">
                  {item ? "Editar Item" : "Novo Item"}
                </Dialog.Title>
                <Dialog.CloseTrigger asChild>
                  <button
                    className="p-2 hover:bg-secondary rounded-lg tap-target"
                    aria-label="Fechar"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </Dialog.CloseTrigger>
              </div>
              {/* Convert quick to activity banner */}
              {isQuickItem && (
                <div className="mt-3 p-3 bg-primary/10 border border-primary/20 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">
                    Este é um item rápido. Converta para atividade para adicionar mais detalhes.
                  </p>
                  <button
                    type="button"
                    onClick={handleConvertToActivity}
                    className="text-sm text-primary hover:underline flex items-center gap-1 font-medium"
                  >
                    Converter para Atividade <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>

            {/* Form */}
            <div className="p-4 space-y-4">
              {/* Type selector */}
              <TypeSelector value={itemType} onChange={setItemType} />

              {/* Title */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Título {isTitleRequired && <span className="text-destructive">*</span>}
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-lg bg-background focus:ring-2 focus:ring-ring outline-none"
                  placeholder={itemType === "quick" ? "Opcional para items rápidos" : "Nome do lugar ou atividade"}
                  aria-required={isTitleRequired}
                  aria-invalid={isTitleRequired && !title.trim()}
                  data-testid="item-title-input"
                />
                {isTitleRequired && !title.trim() && (
                  <p className="text-xs text-destructive mt-1" role="alert">
                    Título é obrigatório
                  </p>
                )}
              </div>

              {/* Icon */}
              <div>
                <label className="block text-sm font-medium mb-1">Ícone (emoji)</label>
                <input
                  type="text"
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-lg bg-background focus:ring-2 focus:ring-ring outline-none"
                  placeholder="🍕"
                  maxLength={2}
                  aria-label="Ícone emoji"
                />
              </div>

              {/* Time & Duration */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="time-label" className="block text-sm font-medium mb-1">
                    Horário
                  </label>
                  <input
                    id="time-label"
                    type="text"
                    value={timeLabel}
                    onChange={(e) => setTimeLabel(e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-lg bg-background focus:ring-2 focus:ring-ring outline-none"
                    placeholder="09:00"
                  />
                </div>
                <div>
                  <label htmlFor="duration-text" className="block text-sm font-medium mb-1">
                    Duração
                  </label>
                  <input
                    id="duration-text"
                    type="text"
                    value={durationText}
                    onChange={(e) => setDurationText(e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-lg bg-background focus:ring-2 focus:ring-ring outline-none"
                    placeholder="2h 30min"
                  />
                </div>
              </div>

              {/* Cost */}
              <div>
                <label htmlFor="cost-text" className="block text-sm font-medium mb-1">
                  Custo
                </label>
                <input
                  id="cost-text"
                  type="text"
                  value={costText}
                  onChange={(e) => setCostText(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-lg bg-background focus:ring-2 focus:ring-ring outline-none"
                  placeholder="R$ 50,00"
                />
              </div>

              {/* City */}
              <div>
                <label htmlFor="city" className="block text-sm font-medium mb-1">
                  Cidade
                </label>
                <input
                  id="city"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-lg bg-background focus:ring-2 focus:ring-ring outline-none"
                  placeholder="São Paulo"
                />
              </div>

              {/* Address */}
              <div>
                <label htmlFor="address-text" className="block text-sm font-medium mb-1">
                  Endereço
                </label>
                <input
                  id="address-text"
                  type="text"
                  value={addressText}
                  onChange={(e) => setAddressText(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-lg bg-background focus:ring-2 focus:ring-ring outline-none"
                  placeholder="Rua, número, bairro"
                  data-testid="item-address-input"
                />
              </div>

              {/* Coordinates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="lat" className="block text-sm font-medium mb-1">
                    Latitude
                  </label>
                  <input
                    id="lat"
                    type="text"
                    inputMode="decimal"
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-lg bg-background focus:ring-2 focus:ring-ring outline-none"
                    placeholder="-23.550520"
                  />
                </div>
                <div>
                  <label htmlFor="lng" className="block text-sm font-medium mb-1">
                    Longitude
                  </label>
                  <input
                    id="lng"
                    type="text"
                    inputMode="decimal"
                    value={lng}
                    onChange={(e) => setLng(e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-lg bg-background focus:ring-2 focus:ring-ring outline-none"
                    placeholder="-46.633308"
                  />
                </div>
              </div>

              {/* Links */}
              <LinksEditor links={links} onChange={setLinks} />

              {/* Notes */}
              <div>
                <label htmlFor="notes" className="block text-sm font-medium mb-1">
                  Observações
                </label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-input rounded-lg bg-background focus:ring-2 focus:ring-ring outline-none resize-none"
                  placeholder="Notas adicionais…"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <div className="flex gap-2">
                  {(["planned", "done", "skipped"] as ItemStatus[]).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setStatus(s)}
                      className={`px-4 py-2 rounded-lg border transition-colors ${
                        status === s
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border hover:bg-secondary"
                      }`}
                    >
                      {s === "planned" && "Planejado"}
                      {s === "done" && "Feito"}
                      {s === "skipped" && "Pulado"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium mb-2">Prioridade</label>
                <div className="flex gap-2">
                  {([0, 1, 2] as ItemPriority[]).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`px-4 py-2 rounded-lg border transition-colors ${
                        priority === p
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border hover:bg-secondary"
                      }`}
                    >
                      {p === 0 && "Normal"}
                      {p === 1 && "Importante"}
                      {p === 2 && "Imperdível"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stay-specific fields */}
              {itemType === "stay" && (
                <StayFields
                  breakfastIncluded={breakfastIncluded}
                  onBreakfastChange={setBreakfastIncluded}
                />
              )}

              {/* Day Trip (only for dayTrip type) */}
              {itemType === "dayTrip" && (
                <div className="space-y-3 p-3 border border-border rounded-lg bg-muted/30">
                  <p className="text-sm font-medium">Períodos cobertos pelo Dia Inteiro</p>
                  <p className="text-xs text-muted-foreground">
                    Este item aparece no período <strong>{SEGMENT_LABELS[segment]}</strong> (principal).
                    Selecione períodos adicionais que ele cobre:
                  </p>
                  <div className="flex gap-2">
                    {SEGMENTS.map((seg) => (
                      <button
                        key={seg}
                        type="button"
                        onClick={() => toggleSegment(seg)}
                        disabled={seg === segment}
                        className={`px-3 py-2 rounded-lg border text-sm transition-colors ${
                          seg === segment
                            ? "bg-primary text-primary-foreground border-primary"
                            : coversSegments.includes(seg)
                            ? "bg-secondary border-primary"
                            : "border-border hover:bg-secondary"
                        }`}
                        data-testid={`daytrip-segment-${seg}`}
                      >
                        {SEGMENT_LABELS[seg]}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-background border-t border-border p-4 flex gap-3 z-10">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-4 py-3 rounded-lg border border-border hover:bg-secondary transition-colors tap-target"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={!canSave}
                className="flex-1 px-4 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors tap-target"
                data-testid="save-item"
              >
                {item ? "Salvar" : "Adicionar"}
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
