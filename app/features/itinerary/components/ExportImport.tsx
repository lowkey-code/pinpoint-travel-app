import { useState, useRef } from "react"
import { Dialog, Portal } from "@ark-ui/react"
import { useTrips, useItinerary, CURRENT_SCHEMA_VERSION, exportTrip as exportTripToJson } from "~/features/itinerary"
import { DownloadSimple, UploadSimple, X, FileJs, Check, WarningCircle } from "@phosphor-icons/react"
import { useToast } from "~/hooks/use-toast"

interface ExportImportProps {
  tripId: string
}

type ImportState = "idle" | "preview" | "success" | "error"

interface ImportPreview {
  name: string
  daysCount: number
  itemsCount: number
  exportedAt: Date
  schemaVersion: number
  needsMigration: boolean
}

export function ExportImport({ tripId }: ExportImportProps) {
  const { importTrip, trips } = useTrips()
  const { trip: currentTrip } = useItinerary()
  const toast = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [importState, setImportState] = useState<ImportState>("idle")
  const [importPreview, setImportPreview] = useState<ImportPreview | null>(null)
  const [importData, setImportData] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string>("")

  const handleExport = () => {
    if (!currentTrip || currentTrip.id !== tripId) {
      toast.error("Erro ao exportar viagem")
      return
    }

    const exported = exportTripToJson(currentTrip)
    const json = JSON.stringify(exported, null, 2)
    const blob = new Blob([json], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${exported.trip.name.replace(/[^a-z0-9]/gi, "-").toLowerCase()}-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast.success("Viagem exportada com sucesso!")
  }

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    e.target.value = ""

    try {
      const text = await file.text()
      const data = JSON.parse(text)

      if (!data.exportVersion || !data.trip || !data.trip.name) {
        setErrorMessage("Arquivo inválido: estrutura não reconhecida")
        setImportState("error")
        setDialogOpen(true)
        return
      }

      const tripSchemaVersion = data.schemaVersion || data.exportVersion || 1
      const needsMigration = tripSchemaVersion < CURRENT_SCHEMA_VERSION

      setImportPreview({
        name: data.trip.name,
        daysCount: data.trip.days?.length || 0,
        itemsCount: data.trip.items?.length || 0,
        exportedAt: new Date(data.exportedAt),
        schemaVersion: tripSchemaVersion,
        needsMigration,
      })
      setImportData(text)
      setImportState("preview")
      setDialogOpen(true)
    } catch {
      setErrorMessage("Erro ao ler arquivo: JSON inválido")
      setImportState("error")
      setDialogOpen(true)
    }
  }

  const handleConfirmImport = () => {
    if (!importData) return

    const imported = importTrip(importData)
    if (imported) {
      setImportState("success")
      toast.success(`Viagem "${imported.name}" importada!`)
    } else {
      setErrorMessage("Falha ao importar: formato de dados inválido")
      setImportState("error")
    }
  }

  const handleClose = () => {
    setDialogOpen(false)
    setTimeout(() => {
      setImportState("idle")
      setImportPreview(null)
      setImportData(null)
      setErrorMessage("")
    }, 200)
  }

  return (
    <>
      <div className="flex items-center gap-1 border border-paper-line rounded-lg p-1">
        <button
          onClick={handleExport}
          className="p-2 rounded hover:bg-secondary transition-colors"
          aria-label="Exportar viagem"
          title="Exportar viagem"
          data-testid="export-button"
        >
          <DownloadSimple className="w-4 h-4" weight="bold" />
        </button>
        <button
          onClick={handleImportClick}
          className="p-2 rounded hover:bg-secondary transition-colors"
          aria-label="Importar viagem"
          title="Importar viagem"
          data-testid="import-button"
        >
          <UploadSimple className="w-4 h-4" weight="bold" />
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="application/json,.json"
        onChange={handleFileSelect}
        className="hidden"
        aria-hidden="true"
      />

      <Dialog.Root open={dialogOpen} onOpenChange={(details) => details.open ? null : handleClose()}>
        <Portal>
          <Dialog.Backdrop className="fixed inset-0 bg-black/50 z-40" />
          <Dialog.Positioner className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <Dialog.Content className="bg-paper-card border border-paper-line rounded-xl shadow-xl max-w-md w-full">
              <div className="flex items-center justify-between p-4 border-b border-paper-line">
                <Dialog.Title className="text-lg font-sans font-bold flex items-center gap-2">
                  <FileJs className="w-5 h-5" weight="bold" />
                  {importState === "preview" && "Importar Viagem"}
                  {importState === "success" && "Importação Concluída"}
                  {importState === "error" && "Erro na Importação"}
                </Dialog.Title>
                <Dialog.CloseTrigger asChild>
                  <button
                    className="p-2 hover:bg-secondary rounded-lg transition-colors"
                    aria-label="Fechar"
                  >
                    <X className="w-5 h-5" weight="bold" />
                  </button>
                </Dialog.CloseTrigger>
              </div>

              <div className="p-4">
                {importState === "preview" && importPreview && (
                  <div className="space-y-4">
                    <div className="bg-secondary/50 rounded-lg p-4 space-y-2">
                      <h3 className="font-semibold text-lg font-sans">{importPreview.name}</h3>
                      <div className="text-sm text-ink-secondary space-y-1 font-body">
                        <p>{importPreview.daysCount} dias • {importPreview.itemsCount} itens</p>
                        <p>Exportado em: {importPreview.exportedAt.toLocaleDateString("pt-BR")}</p>
                      </div>
                    </div>

                    {importPreview.needsMigration && (
                      <div className="flex items-start gap-2 p-3 bg-stamp-amber/10 text-stamp-amber rounded-lg text-sm font-body">
                        <WarningCircle className="w-4 h-4 mt-0.5 shrink-0" weight="bold" />
                        <p>Este arquivo usa um formato antigo (v{importPreview.schemaVersion}) e será migrado automaticamente para v{CURRENT_SCHEMA_VERSION}.</p>
                      </div>
                    )}

                    {trips.some((t) => t.name === importPreview.name) && (
                      <div className="flex items-start gap-2 p-3 bg-action-blue/10 text-action-blue rounded-lg text-sm font-body">
                        <WarningCircle className="w-4 h-4 mt-0.5 shrink-0" weight="bold" />
                        <p>Já existe uma viagem com este nome. A importada será renomeada para "{importPreview.name} (importado)".</p>
                      </div>
                    )}

                    <p className="text-sm text-ink-secondary font-body">
                      Deseja continuar com a importação?
                    </p>
                  </div>
                )}

                {importState === "success" && (
                  <div className="text-center space-y-4 py-4">
                    <div className="w-16 h-16 mx-auto bg-stamp-sage/20 rounded-full flex items-center justify-center">
                      <Check className="w-8 h-8 text-stamp-sage" weight="bold" />
                    </div>
                    <p className="text-ink-secondary font-body">
                      A viagem foi importada com sucesso e está disponível na lista.
                    </p>
                  </div>
                )}

                {importState === "error" && (
                  <div className="text-center space-y-4 py-4">
                    <div className="w-16 h-16 mx-auto bg-stamp-brick/20 rounded-full flex items-center justify-center">
                      <WarningCircle className="w-8 h-8 text-stamp-brick" weight="bold" />
                    </div>
                    <p className="text-stamp-brick font-medium font-body">{errorMessage}</p>
                    <p className="text-sm text-ink-secondary font-body">
                      Verifique se o arquivo é um JSON válido exportado por este aplicativo.
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-3 p-4 border-t border-paper-line">
                {importState === "preview" && (
                  <>
                    <button
                      onClick={handleClose}
                      className="flex-1 px-4 py-2 rounded-lg border border-paper-line hover:bg-secondary transition-colors font-body"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleConfirmImport}
                      className="flex-1 px-4 py-2 rounded-lg bg-action-blue text-white hover:bg-action-hover transition-colors font-body"
                    >
                      Importar
                    </button>
                  </>
                )}

                {(importState === "success" || importState === "error") && (
                  <button
                    onClick={handleClose}
                    className="flex-1 px-4 py-2 rounded-lg bg-action-blue text-white hover:bg-action-hover transition-colors font-body"
                  >
                    Fechar
                  </button>
                )}
              </div>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  )
}
