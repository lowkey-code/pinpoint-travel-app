import { useState, useEffect } from "react"
import { Dialog, Portal } from "@ark-ui/react"
import { useItinerary, SEGMENTS, SEGMENT_LABELS } from "~/features/itinerary"
import { extractDate, daysBetween, addDays, createDateTime } from "../lib/dates"
import type { Segment, ItineraryItem, ItemStatus, ItemPriority, ItemType } from "~/features/itinerary"
import { X, ArrowRight, Clock, CurrencyDollar, CheckCircle } from "@phosphor-icons/react"
import { cn } from "~/lib/utils"
import { TypeSelector } from "./TypeSelector"
import { EmojiPicker } from "./EmojiPicker"
import { LocationFields } from "./LocationFields"
import { NotesLinksSection } from "./NotesLinksSection"
import { StayFields } from "./StayFields"
import { TransportFields } from "./TransportFields"

interface ItemDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  dayIndex: number
  segment: Segment
  item?: ItineraryItem
}

const SEGMENT_DEFAULT_TIMES: Record<Segment, string> = {
  morning: "09:00",
  afternoon: "14:00",
  evening: "19:00",
}

const ITEM_DEFAULT_EMOJI: Record<ItemType, string> = {
  activity: "🎯",
  transport: "✈️",
  stay: "🏨",
  dayTrip: "🗺️",
  quick: "⭐",
}

const STATUS_OPTIONS: { value: ItemStatus; label: string }[] = [
  { value: "planned", label: "Planejado" },
  { value: "done", label: "Feito" },
  { value: "skipped", label: "Pulado" },
]

const PRIORITY_OPTIONS: { value: ItemPriority; label: string }[] = [
  { value: 0, label: "Normal" },
  { value: 1, label: "Importante" },
  { value: 2, label: "Imperdível" },
]

export function ItemDrawer({ open, onOpenChange, dayIndex, segment, item }: ItemDrawerProps) {
  const { addItem, updateItem, convertQuickToActivity, trip } = useItinerary()

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
  const [departureDateTime, setDepartureDateTime] = useState("")
  const [arrivalDateTime, setArrivalDateTime] = useState("")
  const [originCity, setOriginCity] = useState("")
  const [destinationCity, setDestinationCity] = useState("")
  const [transportError, setTransportError] = useState("")

  // Load existing item data
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
      setDepartureDateTime(item.departureDateTime || "")
      setArrivalDateTime(item.arrivalDateTime || "")
      setOriginCity(item.originCity || "")
      setDestinationCity(item.destinationCity || "")
    }
  }, [item, open])

  // Smart defaults for new items
  useEffect(() => {
    if (!item && open) {
      // Default time based on segment
      if (!timeLabel) {
        setTimeLabel(SEGMENT_DEFAULT_TIMES[segment])
      }
      // Default emoji based on type
      if (!icon) {
        setIcon(ITEM_DEFAULT_EMOJI[itemType])
      }
    }
  }, [segment, item, open, timeLabel, icon, itemType])

  // Update emoji when type changes (for new items)
  useEffect(() => {
    if (!item && open) {
      setIcon(ITEM_DEFAULT_EMOJI[itemType])
    }
  }, [itemType, item, open])

  // Handle day trip type
  useEffect(() => {
    if (itemType === "dayTrip") {
      setIsDayTrip(true)
    } else {
      setIsDayTrip(false)
      setCoversSegments([])
    }
  }, [itemType])

  // Reset form when dialog closes
  useEffect(() => {
    if (!open && !item) {
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
      setDepartureDateTime("")
      setArrivalDateTime("")
      setOriginCity("")
      setDestinationCity("")
      setTransportError("")
    }
  }, [open, item])

  const handleSave = () => {
    if (itemType !== "quick" && !title.trim()) {
      return
    }

    // Calculate departure datetime for transport
    let calculatedDepartureDateTime = ""
    if (itemType === "transport") {
      if (!currentDayDate || !timeLabel || !arrivalDateTime || !originCity.trim() || !destinationCity.trim()) {
        setTransportError("Preencha o horário de partida, duração e cidades de origem/destino")
        return
      }

      calculatedDepartureDateTime = createDateTime(currentDayDate, timeLabel)

      if (arrivalDateTime <= calculatedDepartureDateTime) {
        setTransportError("A chegada deve ser posterior à partida")
        return
      }
    }

    const parsedLat = lat ? parseFloat(lat) : undefined
    const parsedLng = lng ? parseFloat(lng) : undefined

    let arrivalDayIndex: number | undefined
    let isMultiDayTransport = false

    if (itemType === "transport" && trip && calculatedDepartureDateTime && arrivalDateTime) {
      const departureDate = extractDate(calculatedDepartureDateTime)
      const arrivalDate = extractDate(arrivalDateTime)

      if (departureDate !== arrivalDate && trip.startDate) {
        isMultiDayTransport = true
        const daysFromStart = daysBetween(trip.startDate, arrivalDate) - 1
        arrivalDayIndex = daysFromStart
      }
    }

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
      isMultiDayTransport: isMultiDayTransport || undefined,
      departureDateTime: itemType === "transport" ? calculatedDepartureDateTime : undefined,
      arrivalDateTime: itemType === "transport" ? arrivalDateTime : undefined,
      originCity: itemType === "transport" ? originCity.trim() : undefined,
      destinationCity: itemType === "transport" ? destinationCity.trim() : undefined,
      arrivalDayIndex: isMultiDayTransport ? arrivalDayIndex : undefined,
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
  }

  const toggleSegment = (seg: Segment) => {
    setCoversSegments((prev) =>
      prev.includes(seg) ? prev.filter((s) => s !== seg) : [...prev, seg]
    )
  }

  const isTitleRequired = itemType !== "quick"
  const canSave = !isTitleRequired || title.trim().length > 0
  const isQuickItem = item?.itemType === "quick"

  // Calculate current day's date for transport
  const currentDayDate = trip?.startDate ? addDays(trip.startDate, dayIndex) : ""

  const handleConvertToActivity = () => {
    if (!item || item.itemType !== "quick") return
    convertQuickToActivity(item.id)
    handleClose()
  }

  // Key forces Dialog to remount when opening, fixing state sync issues
  const dialogKey = open ? "drawer-open" : "drawer-closed"

  return (
    <Dialog.Root key={dialogKey} open={open} onOpenChange={(details) => onOpenChange(details.open)}>
      <Portal>
        <Dialog.Backdrop className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm" />
        <Dialog.Positioner className="fixed inset-0 z-50 flex items-end">
          <Dialog.Content
            className="bg-paper-base w-full max-h-[90vh] rounded-t-2xl shadow-xl overflow-y-auto animate-in slide-in-from-bottom duration-300"
            data-testid={item ? `edit-item-drawer-${item.id}` : "item-drawer"}
          >
            {/* Header */}
            <div className="sticky top-0 bg-paper-base border-b border-paper-line p-4 z-10">
              <div className="flex items-center justify-between">
                <Dialog.Title className="text-xl font-sans font-bold text-ink-primary">
                  {item ? "Editar Item" : "Novo Item"}
                </Dialog.Title>
                <Dialog.CloseTrigger asChild>
                  <button
                    className="p-2 hover:bg-secondary rounded-lg tap-target transition-colors"
                    aria-label="Fechar"
                  >
                    <X className="w-5 h-5" weight="bold" />
                  </button>
                </Dialog.CloseTrigger>
              </div>

              {isQuickItem && (
                <div className="mt-3 p-3 bg-action-blue/10 border border-action-blue/20 rounded-lg">
                  <p className="text-sm text-ink-secondary mb-2 font-body">
                    Este é um item rápido. Converta para atividade para adicionar mais detalhes.
                  </p>
                  <button
                    type="button"
                    onClick={handleConvertToActivity}
                    className="text-sm text-action-blue hover:underline flex items-center gap-1 font-medium"
                  >
                    Converter para Atividade <ArrowRight className="w-3 h-3" weight="bold" />
                  </button>
                </div>
              )}
            </div>

            {/* Form */}
            <div className="p-4 space-y-5">
              {/* Type Selector */}
              <TypeSelector value={itemType} onChange={setItemType} />

              {/* Essential Fields Card */}
              <div className="space-y-4 p-4 bg-paper-card rounded-xl border border-paper-line">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium mb-1.5 font-body text-ink-primary">
                    Título {isTitleRequired && <span className="text-stamp-brick">*</span>}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className={cn(
                        "w-full px-3 py-2.5 border rounded-lg bg-paper-base focus:ring-2 focus:ring-action-blue outline-none font-body transition-colors",
                        isTitleRequired && !title.trim()
                          ? "border-paper-line"
                          : title.trim()
                          ? "border-stamp-sage"
                          : "border-paper-line"
                      )}
                      placeholder={itemType === "quick" ? "Opcional para items rápidos" : "Nome do lugar ou atividade"}
                      aria-required={isTitleRequired}
                      aria-invalid={isTitleRequired && !title.trim()}
                      data-testid="item-title-input"
                    />
                    {title.trim() && (
                      <CheckCircle
                        weight="fill"
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stamp-sage"
                      />
                    )}
                  </div>
                  {isTitleRequired && !title.trim() && (
                    <p className="text-xs text-stamp-brick mt-1 font-body" role="alert">
                      Título é obrigatório
                    </p>
                  )}
                </div>

                {/* Emoji Picker */}
                <EmojiPicker value={icon} onChange={setIcon} itemType={itemType} />
              </div>

              {/* Time & Duration Card */}
              <div className="p-4 bg-paper-card rounded-xl border border-paper-line">
                <div className="flex items-center gap-2 mb-3">
                  <Clock weight="bold" className="w-4 h-4 text-ink-utility" />
                  <span className="text-sm font-medium font-body text-ink-primary">Horário</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="time-label" className="block text-xs font-medium mb-1 font-body text-ink-secondary">
                      Início
                    </label>
                    <input
                      id="time-label"
                      type="text"
                      value={timeLabel}
                      onChange={(e) => setTimeLabel(e.target.value)}
                      className="w-full px-3 py-2 border border-paper-line rounded-lg bg-paper-base focus:ring-2 focus:ring-action-blue outline-none font-mono text-sm"
                      placeholder="09:00"
                    />
                  </div>
                  <div>
                    <label htmlFor="duration-text" className="block text-xs font-medium mb-1 font-body text-ink-secondary">
                      Duração
                    </label>
                    <input
                      id="duration-text"
                      type="text"
                      value={durationText}
                      onChange={(e) => setDurationText(e.target.value)}
                      className="w-full px-3 py-2 border border-paper-line rounded-lg bg-paper-base focus:ring-2 focus:ring-action-blue outline-none font-mono text-sm"
                      placeholder="2h 30min"
                    />
                  </div>
                </div>
              </div>

              {/* Cost Card */}
              <div className="p-4 bg-paper-card rounded-xl border border-paper-line">
                <div className="flex items-center gap-2 mb-3">
                  <CurrencyDollar weight="bold" className="w-4 h-4 text-ink-utility" />
                  <span className="text-sm font-medium font-body text-ink-primary">Custo</span>
                </div>
                <input
                  type="text"
                  value={costText}
                  onChange={(e) => setCostText(e.target.value)}
                  className="w-full px-3 py-2 border border-paper-line rounded-lg bg-paper-base focus:ring-2 focus:ring-action-blue outline-none font-mono text-sm"
                  placeholder="R$ 50,00"
                  aria-label="Custo estimado"
                />
              </div>

              {/* Location Fields (Collapsible) */}
              <LocationFields
                city={city}
                addressText={addressText}
                lat={lat}
                lng={lng}
                onCityChange={setCity}
                onAddressChange={setAddressText}
                onLatChange={setLat}
                onLngChange={setLng}
              />

              {/* Notes & Links (Collapsible) */}
              <NotesLinksSection
                notes={notes}
                links={links}
                onNotesChange={setNotes}
                onLinksChange={setLinks}
              />

              {/* Status & Priority */}
              <div className="p-4 bg-paper-card rounded-xl border border-paper-line space-y-4">
                {/* Status */}
                <div>
                  <label className="block text-sm font-medium mb-2 font-body text-ink-primary">Status</label>
                  <div className="flex gap-2">
                    {STATUS_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setStatus(opt.value)}
                        className={cn(
                          "flex-1 px-3 py-2 rounded-lg border transition-colors font-body text-sm tap-target",
                          status === opt.value
                            ? "bg-action-blue text-white border-action-blue"
                            : "border-paper-line hover:bg-secondary bg-paper-base"
                        )}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-sm font-medium mb-2 font-body text-ink-primary">Prioridade</label>
                  <div className="flex gap-2">
                    {PRIORITY_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setPriority(opt.value)}
                        className={cn(
                          "flex-1 px-3 py-2 rounded-lg border transition-colors font-body text-sm tap-target",
                          priority === opt.value
                            ? "bg-action-blue text-white border-action-blue"
                            : "border-paper-line hover:bg-secondary bg-paper-base"
                        )}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Conditional Fields */}
              {itemType === "stay" && (
                <StayFields
                  breakfastIncluded={breakfastIncluded}
                  onBreakfastChange={setBreakfastIncluded}
                />
              )}

              {itemType === "transport" && (
                <TransportFields
                  departureDate={currentDayDate}
                  departureTime={timeLabel}
                  durationText={durationText}
                  arrivalDateTime={arrivalDateTime}
                  originCity={originCity}
                  destinationCity={destinationCity}
                  onArrivalDateTimeChange={setArrivalDateTime}
                  onOriginCityChange={setOriginCity}
                  onDestinationCityChange={setDestinationCity}
                  error={transportError}
                />
              )}

              {itemType === "dayTrip" && (
                <div className="space-y-3 p-4 border border-paper-line rounded-xl bg-paper-card">
                  <p className="text-sm font-medium font-body text-ink-primary">Períodos cobertos pelo Dia Inteiro</p>
                  <p className="text-xs text-ink-secondary font-body">
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
                        className={cn(
                          "flex-1 px-3 py-2 rounded-lg border text-sm transition-colors font-body tap-target",
                          seg === segment
                            ? "bg-action-blue text-white border-action-blue"
                            : coversSegments.includes(seg)
                            ? "bg-secondary border-action-blue"
                            : "border-paper-line hover:bg-secondary bg-paper-base"
                        )}
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
            <div className="sticky bottom-0 bg-paper-base border-t border-paper-line p-4 flex gap-3 z-10 safe-bottom">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-4 py-3 rounded-lg border border-paper-line hover:bg-secondary transition-colors tap-target font-body"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={!canSave}
                className="flex-1 px-4 py-3 rounded-lg bg-action-blue text-white hover:bg-action-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors tap-target font-body font-medium"
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
