import { MapPin } from "@phosphor-icons/react"
import { CollapsibleSection } from "./CollapsibleSection"

interface LocationFieldsProps {
  city: string
  addressText: string
  lat: string
  lng: string
  onCityChange: (value: string) => void
  onAddressChange: (value: string) => void
  onLatChange: (value: string) => void
  onLngChange: (value: string) => void
  defaultOpen?: boolean
}

export function LocationFields({
  city,
  addressText,
  lat,
  lng,
  onCityChange,
  onAddressChange,
  onLatChange,
  onLngChange,
  defaultOpen = false,
}: LocationFieldsProps) {
  const hasContent = Boolean(city || addressText || lat || lng)

  return (
    <CollapsibleSection
      title="Localização"
      icon={<MapPin weight="bold" className="w-4 h-4" />}
      defaultOpen={defaultOpen || hasContent}
    >
      {/* City */}
      <div>
        <label htmlFor="location-city" className="block text-xs font-medium mb-1 font-body text-ink-secondary">
          Cidade
        </label>
        <input
          id="location-city"
          type="text"
          value={city}
          onChange={(e) => onCityChange(e.target.value)}
          className="w-full px-3 py-2 border border-paper-line rounded-lg bg-paper-card focus:ring-2 focus:ring-action-blue outline-none font-body text-sm"
          placeholder="Ex: São Paulo, Tóquio, Paris"
        />
      </div>

      {/* Address */}
      <div>
        <label htmlFor="location-address" className="block text-xs font-medium mb-1 font-body text-ink-secondary">
          Endereço
        </label>
        <input
          id="location-address"
          type="text"
          value={addressText}
          onChange={(e) => onAddressChange(e.target.value)}
          className="w-full px-3 py-2 border border-paper-line rounded-lg bg-paper-card focus:ring-2 focus:ring-action-blue outline-none font-body text-sm"
          placeholder="Rua, número, bairro"
          data-testid="item-address-input"
        />
      </div>

      {/* Coordinates */}
      <div className="pt-2 border-t border-paper-line">
        <p className="text-xs text-ink-utility mb-2 font-body">
          Coordenadas <span className="text-ink-secondary">(opcional)</span>
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="location-lat" className="block text-xs font-medium mb-1 font-body text-ink-secondary">
              Latitude
            </label>
            <input
              id="location-lat"
              type="text"
              inputMode="decimal"
              value={lat}
              onChange={(e) => onLatChange(e.target.value)}
              className="w-full px-3 py-2 border border-paper-line rounded-lg bg-paper-card focus:ring-2 focus:ring-action-blue outline-none font-mono text-sm"
              placeholder="-23.550520"
            />
          </div>
          <div>
            <label htmlFor="location-lng" className="block text-xs font-medium mb-1 font-body text-ink-secondary">
              Longitude
            </label>
            <input
              id="location-lng"
              type="text"
              inputMode="decimal"
              value={lng}
              onChange={(e) => onLngChange(e.target.value)}
              className="w-full px-3 py-2 border border-paper-line rounded-lg bg-paper-card focus:ring-2 focus:ring-action-blue outline-none font-mono text-sm"
              placeholder="-46.633308"
            />
          </div>
        </div>
      </div>
    </CollapsibleSection>
  )
}
