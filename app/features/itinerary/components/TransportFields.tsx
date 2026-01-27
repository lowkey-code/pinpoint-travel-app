import { extractDate, extractTime, createDateTime, today } from "~/features/itinerary"

interface TransportFieldsProps {
  departureDateTime: string
  arrivalDateTime: string
  originCity: string
  destinationCity: string
  onDepartureDateTimeChange: (value: string) => void
  onArrivalDateTimeChange: (value: string) => void
  onOriginCityChange: (value: string) => void
  onDestinationCityChange: (value: string) => void
  error?: string
}

export function TransportFields({
  departureDateTime,
  arrivalDateTime,
  originCity,
  destinationCity,
  onDepartureDateTimeChange,
  onArrivalDateTimeChange,
  onOriginCityChange,
  onDestinationCityChange,
  error,
}: TransportFieldsProps) {
  const departureDate = departureDateTime ? extractDate(departureDateTime) : ""
  const departureTime = departureDateTime ? extractTime(departureDateTime) : ""
  const arrivalDate = arrivalDateTime ? extractDate(arrivalDateTime) : ""
  const arrivalTime = arrivalDateTime ? extractTime(arrivalDateTime) : ""

  const handleDepartureDateChange = (date: string) => {
    const time = departureTime || "00:00"
    onDepartureDateTimeChange(createDateTime(date, time))
  }

  const handleDepartureTimeChange = (time: string) => {
    const date = departureDate || today()
    onDepartureDateTimeChange(createDateTime(date, time))
  }

  const handleArrivalDateChange = (date: string) => {
    const time = arrivalTime || "00:00"
    onArrivalDateTimeChange(createDateTime(date, time))
  }

  const handleArrivalTimeChange = (time: string) => {
    const date = arrivalDate || today()
    onArrivalDateTimeChange(createDateTime(date, time))
  }

  return (
    <div className="space-y-4 p-4 bg-secondary/30 rounded-lg border border-border">
      <p className="text-sm font-medium text-muted-foreground">
        Informações de Transporte
      </p>

      {/* Origin */}
      <div>
        <label htmlFor="origin-city" className="block text-sm font-medium mb-1">
          Cidade de Origem <span className="text-destructive">*</span>
        </label>
        <input
          id="origin-city"
          type="text"
          value={originCity}
          onChange={(e) => onOriginCityChange(e.target.value)}
          className="w-full px-3 py-2 border border-input rounded-lg bg-background focus:ring-2 focus:ring-ring outline-none"
          placeholder="Pequim"
          required
        />
      </div>

      {/* Departure */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Partida <span className="text-destructive">*</span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="date"
            value={departureDate}
            onChange={(e) => handleDepartureDateChange(e.target.value)}
            className="px-3 py-2 border border-input rounded-lg bg-background focus:ring-2 focus:ring-ring outline-none"
            required
          />
          <input
            type="time"
            value={departureTime}
            onChange={(e) => handleDepartureTimeChange(e.target.value)}
            className="px-3 py-2 border border-input rounded-lg bg-background focus:ring-2 focus:ring-ring outline-none"
            required
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Horário local de {originCity || "origem"}
        </p>
      </div>

      {/* Destination */}
      <div>
        <label htmlFor="destination-city" className="block text-sm font-medium mb-1">
          Cidade de Destino <span className="text-destructive">*</span>
        </label>
        <input
          id="destination-city"
          type="text"
          value={destinationCity}
          onChange={(e) => onDestinationCityChange(e.target.value)}
          className="w-full px-3 py-2 border border-input rounded-lg bg-background focus:ring-2 focus:ring-ring outline-none"
          placeholder="São Paulo"
          required
        />
      </div>

      {/* Arrival */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Chegada <span className="text-destructive">*</span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="date"
            value={arrivalDate}
            onChange={(e) => handleArrivalDateChange(e.target.value)}
            className="px-3 py-2 border border-input rounded-lg bg-background focus:ring-2 focus:ring-ring outline-none"
            required
          />
          <input
            type="time"
            value={arrivalTime}
            onChange={(e) => handleArrivalTimeChange(e.target.value)}
            className="px-3 py-2 border border-input rounded-lg bg-background focus:ring-2 focus:ring-ring outline-none"
            required
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Horário local de {destinationCity || "destino"}
        </p>
      </div>

      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <p className="text-xs text-blue-600 dark:text-blue-400">
          💡 <strong>Dica:</strong> O transporte aparecerá no dia de partida e criará um
          indicador "em trânsito" no dia de chegada.
        </p>
      </div>
    </div>
  )
}
