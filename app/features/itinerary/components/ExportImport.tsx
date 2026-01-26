import { useState, useRef } from "react"
import { Dialog, Portal } from "@ark-ui/react"
import { useTrips, CURRENT_SCHEMA_VERSION } from "~/features/itinerary"
import { Download, Upload, X, FileJson, Check, AlertCircle } from "lucide-react"
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
  const { exportTrip, importTrip, trips } = useTrips()
  const toast = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [importState, setImportState] = useState<ImportState>("idle")
  const [importPreview, setImportPreview] = useState<ImportPreview | null>(null)
  const [importData, setImportData] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string>("")

  const handleExport = () => {
    const exported = exportTrip(tripId)
    if (!exported) {
      toast.error("Erro ao exportar viagem")
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
    toast.success("Viagem exportada com sucesso!")
  }

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Reset input so same file can be selected again
    e.target.value = ""

    try {
      const text = await file.text()
      const data = JSON.parse(text)

      // Validate structure
      if (!data.exportVersion || !data.trip || !data.trip.name) {
        setErrorMessage("Arquivo inválido: estrutura não reconhecida")
        setImportState("error")
        setDialogOpen(true)
        return
      }

      // Check schema version for migration indicator
      const tripSchemaVersion = data.schemaVersion || data.exportVersion || 1
      const needsMigration = tripSchemaVersion < CURRENT_SCHEMA_VERSION

      // Create preview
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
    } catch (err) {
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
    // Reset state after animation
    setTimeout(() => {
      setImportState("idle")
      setImportPreview(null)
      setImportData(null)
      setErrorMessage("")
    }, 200)
  }

  return (
    <>
      <div className="flex items-center gap-1 border border-border rounded-lg p-1">
        <button
          onClick={handleExport}
          className="p-2 rounded hover:bg-secondary transition-colors"
          aria-label="Exportar viagem"
          title="Exportar viagem"
          data-testid="export-button"
        >
          <Download className="w-4 h-4" />
        </button>
        <button
          onClick={handleImportClick}
          className="p-2 rounded hover:bg-secondary transition-colors"
          aria-label="Importar viagem"
          title="Importar viagem"
          data-testid="import-button"
        >
          <Upload className="w-4 h-4" />
        </button>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json,.json"
        onChange={handleFileSelect}
        className="hidden"
        aria-hidden="true"
      />

      {/* Import Dialog */}
      <Dialog.Root open={dialogOpen} onOpenChange={(details) => details.open ? null : handleClose()}>
        <Portal>
          <Dialog.Backdrop className="fixed inset-0 bg-black/50 z-40" />
          <Dialog.Positioner className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <Dialog.Content className="bg-background border border-border rounded-xl shadow-xl max-w-md w-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <Dialog.Title className="text-lg font-serif font-bold flex items-center gap-2">
                  <FileJson className="w-5 h-5" />
                  {importState === "preview" && "Importar Viagem"}
                  {importState === "success" && "Importação Concluída"}
                  {importState === "error" && "Erro na Importação"}
                </Dialog.Title>
                <Dialog.CloseTrigger asChild>
                  <button
                    className="p-2 hover:bg-secondary rounded-lg transition-colors"
                    aria-label="Fechar"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </Dialog.CloseTrigger>
              </div>

              {/* Content */}
              <div className="p-4">
                {/* Preview state */}
                {importState === "preview" && importPreview && (
                  <div className="space-y-4">
                    <div className="bg-secondary/50 rounded-lg p-4 space-y-2">
                      <h3 className="font-semibold text-lg">{importPreview.name}</h3>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>{importPreview.daysCount} dias • {importPreview.itemsCount} itens</p>
                        <p>Exportado em: {importPreview.exportedAt.toLocaleDateString("pt-BR")}</p>
                      </div>
                    </div>

                    {importPreview.needsMigration && (
                      <div className="flex items-start gap-2 p-3 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded-lg text-sm">
                        <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                        <p>Este arquivo usa um formato antigo (v{importPreview.schemaVersion}) e será migrado automaticamente para v{CURRENT_SCHEMA_VERSION}.</p>
                      </div>
                    )}

                    {trips.some((t) => t.name === importPreview.name) && (
                      <div className="flex items-start gap-2 p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-lg text-sm">
                        <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                        <p>Já existe uma viagem com este nome. A importada será renomeada para "{importPreview.name} (importado)".</p>
                      </div>
                    )}

                    <p className="text-sm text-muted-foreground">
                      Deseja continuar com a importação?
                    </p>
                  </div>
                )}

                {/* Success state */}
                {importState === "success" && (
                  <div className="text-center space-y-4 py-4">
                    <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                      <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                    <p className="text-muted-foreground">
                      A viagem foi importada com sucesso e está disponível na lista.
                    </p>
                  </div>
                )}

                {/* Error state */}
                {importState === "error" && (
                  <div className="text-center space-y-4 py-4">
                    <div className="w-16 h-16 mx-auto bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                      <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                    </div>
                    <p className="text-destructive font-medium">{errorMessage}</p>
                    <p className="text-sm text-muted-foreground">
                      Verifique se o arquivo é um JSON válido exportado por este aplicativo.
                    </p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex gap-3 p-4 border-t border-border">
                {importState === "preview" && (
                  <>
                    <button
                      onClick={handleClose}
                      className="flex-1 px-4 py-2 rounded-lg border border-border hover:bg-secondary transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleConfirmImport}
                      className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                      Importar
                    </button>
                  </>
                )}

                {(importState === "success" || importState === "error") && (
                  <button
                    onClick={handleClose}
                    className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
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
