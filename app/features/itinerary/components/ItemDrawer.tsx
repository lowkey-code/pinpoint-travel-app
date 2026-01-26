import { useState, useEffect } from "react"
import { Dialog, Portal } from "@ark-ui/react"
import { useActiveTrip, SEGMENTS, SEGMENT_LABELS } from "~/features/itinerary"
import type { Segment, ItineraryItem, ItemStatus, ItemPriority } from "~/features/itinerary"
import { X } from "lucide-react"

interface ItemDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  dayIndex: number
  segment: Segment
  item?: ItineraryItem
}

export function ItemDrawer({ open, onOpenChange, dayIndex, segment, item }: ItemDrawerProps) {
  const { addItem, updateItem } = useActiveTrip()

  const [title, setTitle] = useState("")
  const [icon, setIcon] = useState("")
  const [timeLabel, setTimeLabel] = useState("")
  const [duration, setDuration] = useState("")
  const [cost, setCost] = useState("")
  const [city, setCity] = useState("")
  const [hotel, setHotel] = useState("")
  const [address, setAddress] = useState("")
  const [notes, setNotes] = useState("")
  const [status, setStatus] = useState<ItemStatus>("planned")
  const [priority, setPriority] = useState<ItemPriority>(0)
  const [isDayTrip, setIsDayTrip] = useState(false)
  const [coversSegments, setCoversSegments] = useState<Segment[]>([])

  // Load item data for editing
  useEffect(() => {
    if (item) {
      setTitle(item.title)
      setIcon(item.icon || "")
      setTimeLabel(item.timeLabel || "")
      setDuration(item.duration?.toString() || "")
      setCost(item.cost?.toString() || "")
      setCity(item.city || "")
      setHotel(item.hotel || "")
      setAddress(item.address || "")
      setNotes(item.notes || "")
      setStatus(item.status)
      setPriority(item.priority)
      setIsDayTrip(item.isDayTrip || false)
      setCoversSegments(item.coversSegments || [])
    }
  }, [item, open])

  const handleSave = () => {
    const data = {
      title,
      icon: icon || undefined,
      timeLabel: timeLabel || undefined,
      duration: duration ? parseInt(duration) : undefined,
      cost: cost ? parseFloat(cost) : undefined,
      city: city || undefined,
      hotel: hotel || undefined,
      address: address || undefined,
      notes: notes || undefined,
      status,
      priority,
      isDayTrip: isDayTrip || undefined,
      primarySegment: isDayTrip ? segment : undefined,
      coversSegments: isDayTrip && coversSegments.length > 0 ? coversSegments : undefined,
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
    setTitle("")
    setIcon("")
    setTimeLabel("")
    setDuration("")
    setCost("")
    setCity("")
    setHotel("")
    setAddress("")
    setNotes("")
    setStatus("planned")
    setPriority(0)
    setIsDayTrip(false)
    setCoversSegments([])
  }

  const toggleSegment = (seg: Segment) => {
    setCoversSegments((prev) =>
      prev.includes(seg) ? prev.filter((s) => s !== seg) : [...prev, seg]
    )
  }

  return (
    <Dialog.Root open={open} onOpenChange={(details) => onOpenChange(details.open)}>
      <Portal>
        <Dialog.Backdrop className="fixed inset-0 bg-black/50 z-40" />
        <Dialog.Positioner className="fixed inset-0 z-50 flex items-end">
          <Dialog.Content className="bg-background w-full max-h-[90vh] rounded-t-2xl shadow-xl overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-background border-b border-border p-4 flex items-center justify-between">
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

            {/* Form */}
            <div className="p-4 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Título <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-lg bg-background focus:ring-2 focus:ring-ring outline-none"
                  placeholder="Nome do lugar ou atividade"
                />
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
                />
              </div>

              {/* Time & Duration */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Horário</label>
                  <input
                    type="text"
                    value={timeLabel}
                    onChange={(e) => setTimeLabel(e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-lg bg-background focus:ring-2 focus:ring-ring outline-none"
                    placeholder="09:00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Duração (min)</label>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-lg bg-background focus:ring-2 focus:ring-ring outline-none"
                    placeholder="60"
                  />
                </div>
              </div>

              {/* Cost */}
              <div>
                <label className="block text-sm font-medium mb-1">Custo (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-lg bg-background focus:ring-2 focus:ring-ring outline-none"
                  placeholder="50.00"
                />
              </div>

              {/* City & Hotel */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Cidade</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-lg bg-background focus:ring-2 focus:ring-ring outline-none"
                    placeholder="São Paulo"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Hotel</label>
                  <input
                    type="text"
                    value={hotel}
                    onChange={(e) => setHotel(e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-lg bg-background focus:ring-2 focus:ring-ring outline-none"
                    placeholder="Hotel XYZ"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium mb-1">Endereço</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-lg bg-background focus:ring-2 focus:ring-ring outline-none"
                  placeholder="Rua, número, bairro"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium mb-1">Observações</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-input rounded-lg bg-background focus:ring-2 focus:ring-ring outline-none resize-none"
                  placeholder="Notas adicionais..."
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <div className="flex gap-2">
                  {(["planned", "done", "skipped"] as ItemStatus[]).map((s) => (
                    <button
                      key={s}
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

              {/* Day Trip */}
              <div className="space-y-3">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isDayTrip}
                    onChange={(e) => setIsDayTrip(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-medium">Dia Inteiro</span>
                </label>

                {isDayTrip && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">
                      Selecione os períodos cobertos:
                    </p>
                    <div className="flex gap-2">
                      {SEGMENTS.map((seg) => (
                        <button
                          key={seg}
                          onClick={() => toggleSegment(seg)}
                          disabled={seg === segment}
                          className={`px-3 py-2 rounded-lg border text-sm transition-colors ${
                            seg === segment
                              ? "bg-primary text-primary-foreground border-primary"
                              : coversSegments.includes(seg)
                              ? "bg-secondary border-primary"
                              : "border-border hover:bg-secondary"
                          }`}
                        >
                          {SEGMENT_LABELS[seg]}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-background border-t border-border p-4 flex gap-3">
              <button
                onClick={handleClose}
                className="flex-1 px-4 py-3 rounded-lg border border-border hover:bg-secondary transition-colors tap-target"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={!title.trim()}
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
