import { useTrips } from "~/features/itinerary"
import { Download, Upload } from "lucide-react"

interface ExportImportProps {
  tripId: string
}

export function ExportImport({ tripId }: ExportImportProps) {
  const { exportTrip, importTrip } = useTrips()

  const handleExport = () => {
    const exported = exportTrip(tripId)
    if (!exported) {
      alert("Erro ao exportar viagem")
      return
    }

    const json = JSON.stringify(exported, null, 2)
    const blob = new Blob([json], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${exported.trip.name.replace(/[^a-z0-9]/gi, "-").toLowerCase()}-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "application/json"
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      try {
        const text = await file.text()
        const imported = importTrip(text)
        if (imported) {
          alert(`Viagem "${imported.name}" importada com sucesso!`)
        } else {
          alert("Erro ao importar: formato inválido")
        }
      } catch (error) {
        alert("Erro ao ler arquivo")
      }
    }
    input.click()
  }

  return (
    <div className="flex items-center gap-1 border border-border rounded-lg p-1">
      <button
        onClick={handleExport}
        className="p-2 rounded hover:bg-secondary transition-colors"
        aria-label="Exportar viagem"
        data-testid="export-button"
      >
        <Download className="w-4 h-4" />
      </button>
      <button
        onClick={handleImport}
        className="p-2 rounded hover:bg-secondary transition-colors"
        aria-label="Importar viagem"
        data-testid="import-button"
      >
        <Upload className="w-4 h-4" />
      </button>
    </div>
  )
}
