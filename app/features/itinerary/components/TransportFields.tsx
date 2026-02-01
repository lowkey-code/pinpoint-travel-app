import { useEffect, useState } from "react"
import {
  extractDate,
  extractTime,
  createDateTime,
  parseDurationToMinutes,
  calculateArrival,
  formatDatePtBR,
} from "~/features/itinerary"

interface TransportFieldsProps {
  departureDate: string
  departureTime: string
  durationText: string
  arrivalDateTime: string
  originCity: string
  destinationCity: string
  onArrivalDateTimeChange: (value: string) => void
  onOriginCityChange: (value: string) => void
  onDestinationCityChange: (value: string) => void
  error?: string
}

export function TransportFields({
  departureDate,
  departureTime,
  durationText,
  arrivalDateTime,
  originCity,
  destinationCity,
  onArrivalDateTimeChange,
  onOriginCityChange,
  onDestinationCityChange,
  error,
}: TransportFieldsProps) {
  const [manualArrival, setManualArrival] = useState(false)

  const arrivalDate = arrivalDateTime ? extractDate(arrivalDateTime) : ""
  const arrivalTime = arrivalDateTime ? extractTime(arrivalDateTime) : ""

  // Reset manual mode when departure time or duration changes
  // This ensures arrival is recalculated when input fields change
  useEffect(() => {
    setManualArrival(false)
  }, [departureTime, durationText])

  // Auto-calculate arrival when departure time or duration changes
  useEffect(() => {
    if (manualArrival) return

    const durationMinutes = parseDurationToMinutes(durationText)
    if (departureDate && departureTime && durationMinutes) {
      const arrival = calculateArrival(departureDate, departureTime, durationMinutes)
      onArrivalDateTimeChange(createDateTime(arrival.date, arrival.time))
    }
  }, [departureDate, departureTime, durationText, manualArrival, onArrivalDateTimeChange])

  const handleArrivalDateChange = (date: string) => {
    setManualArrival(true)
    const time = arrivalTime || "00:00"
    onArrivalDateTimeChange(createDateTime(date, time))
  }

  const handleArrivalTimeChange = (time: string) => {
    setManualArrival(true)
    const date = arrivalDate || departureDate
    onArrivalDateTimeChange(createDateTime(date, time))
  }

  const isMultiDay = arrivalDate && departureDate && arrivalDate !== departureDate

  return (
    <div className="space-y-4 p-4 bg-action-blue/5 rounded-xl border border-action-blue/20">
      <p className="text-sm font-medium font-body text-ink-primary">
        Informações de Transporte
      </p>

      {/* Origin */}
      <div>
        <label htmlFor="origin-city" className="block text-sm font-medium mb-1 font-body text-ink-primary">
          Cidade de Origem <span className="text-stamp-brick">*</span>
        </label>
        <input
          id="origin-city"
          type="text"
          value={originCity}
          onChange={(e) => onOriginCityChange(e.target.value)}
          className="w-full px-3 py-2 border border-paper-line rounded-lg bg-paper-base focus:ring-2 focus:ring-action-blue outline-none font-body"
          placeholder="São Paulo"
          required
        />
      </div>

      {/* Departure Info (read-only display) */}
      <div className="p-3 bg-paper-card rounded-lg border border-paper-line">
        <p className="text-xs font-medium text-ink-secondary font-body mb-1">Partida</p>
        <p className="font-mono text-sm text-ink-primary">
          {departureDate ? formatDatePtBR(departureDate, { short: true }) : "—"}{" "}
          {departureTime ? `às ${departureTime}` : ""}
        </p>
        <p className="text-xs text-ink-utility font-body mt-1">
          Baseado no dia e horário preenchidos acima
        </p>
      </div>

      {/* Destination */}
      <div>
        <label htmlFor="destination-city" className="block text-sm font-medium mb-1 font-body text-ink-primary">
          Cidade de Destino <span className="text-stamp-brick">*</span>
        </label>
        <input
          id="destination-city"
          type="text"
          value={destinationCity}
          onChange={(e) => onDestinationCityChange(e.target.value)}
          className="w-full px-3 py-2 border border-paper-line rounded-lg bg-paper-base focus:ring-2 focus:ring-action-blue outline-none font-body"
          placeholder="Rio de Janeiro"
          required
        />
      </div>

      {/* Arrival */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-sm font-medium font-body text-ink-primary">
            Chegada <span className="text-stamp-brick">*</span>
          </label>
          {!manualArrival && durationText && (
            <span className="text-xs text-stamp-sage font-body">Calculado automaticamente</span>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="date"
            value={arrivalDate}
            onChange={(e) => handleArrivalDateChange(e.target.value)}
            className="px-3 py-2 border border-paper-line rounded-lg bg-paper-base focus:ring-2 focus:ring-action-blue outline-none font-mono text-sm"
            required
          />
          <input
            type="time"
            value={arrivalTime}
            onChange={(e) => handleArrivalTimeChange(e.target.value)}
            className="px-3 py-2 border border-paper-line rounded-lg bg-paper-base focus:ring-2 focus:ring-action-blue outline-none font-mono text-sm"
            required
          />
        </div>
        <p className="text-xs text-ink-utility mt-1 font-body">
          Horário local de {destinationCity || "destino"}
        </p>
      </div>

      {error && (
        <div className="p-3 bg-stamp-brick/10 border border-stamp-brick/20 rounded-lg">
          <p className="text-sm text-stamp-brick font-body">{error}</p>
        </div>
      )}

      {isMultiDay && (
        <div className="p-3 bg-action-blue/10 border border-action-blue/20 rounded-lg">
          <p className="text-xs text-action-blue font-body">
            ✈️ <strong>Transporte multi-dia:</strong> Um indicador "em trânsito" aparecerá no dia de chegada.
          </p>
        </div>
      )}
    </div>
  )
}
