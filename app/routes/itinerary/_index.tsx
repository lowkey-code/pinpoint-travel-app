import { useNavigate } from "react-router"
import { useState, useRef } from "react"
import { useTrips, CURRENT_SCHEMA_VERSION } from "~/features/itinerary"
import { Plus, Archive, ArrowCounterClockwise, Trash, UploadSimple, FileJs, X, Check, WarningCircle } from "@phosphor-icons/react"
import { Dialog, Portal } from "@ark-ui/react"
import { CreateTripDialog } from "~/features/itinerary/components/CreateTripDialog"
import { ConfirmDialog } from "~/components/ui/ConfirmDialog"
import {
  TripListSkeleton,
  TripTimelineCard,
  TripsEmptyState,
  PerforatedDivider,
  BugReportButton,
} from "~/components/ui/folio"
import { useToast } from "~/hooks/use-toast"
import type { Trip } from "~/features/itinerary/lib/types"
import { formatDateRange, getTripDuration, getTripProgress } from "~/features/itinerary/lib/utils"

function getCountryEmoji(name: string): string {
  const lower = name.toLowerCase()
  if (lower.includes("japão") || lower.includes("japan") || lower.includes("tóquio") || lower.includes("kyoto")) return "🇯🇵"
  if (lower.includes("portugal") || lower.includes("lisboa")) return "🇵🇹"
  if (lower.includes("brasil") || lower.includes("brazil") || lower.includes("serra") || lower.includes("rio")) return "🇧🇷"
  if (lower.includes("italia") || lower.includes("italy") || lower.includes("roma") || lower.includes("veneza")) return "🇮🇹"
  if (lower.includes("espanha") || lower.includes("spain") || lower.includes("madrid") || lower.includes("barcelona")) return "🇪🇸"
  if (lower.includes("frança") || lower.includes("france") || lower.includes("paris")) return "🇫🇷"
  if (lower.includes("alemanha") || lower.includes("germany") || lower.includes("berlim")) return "🇩🇪"
  if (lower.includes("eua") || lower.includes("usa") || lower.includes("estados unidos") || lower.includes("new york")) return "🇺🇸"
  if (lower.includes("argentina") || lower.includes("buenos aires")) return "🇦🇷"
  if (lower.includes("chile") || lower.includes("santiago")) return "🇨🇱"
  if (lower.includes("peru") || lower.includes("lima") || lower.includes("machu")) return "🇵🇪"
  if (lower.includes("méxico") || lower.includes("mexico")) return "🇲🇽"
  if (lower.includes("canadá") || lower.includes("canada")) return "🇨🇦"
  if (lower.includes("reino unido") || lower.includes("uk") || lower.includes("londres") || lower.includes("london")) return "🇬🇧"
  if (lower.includes("grécia") || lower.includes("greece") || lower.includes("atenas")) return "🇬🇷"
  if (lower.includes("tailândia") || lower.includes("thailand") || lower.includes("bangkok")) return "🇹🇭"
  if (lower.includes("coreia") || lower.includes("korea") || lower.includes("seul")) return "🇰🇷"
  return "✈️"
}

function getTripStatusLabel(trip: Trip): string | undefined {
  if (trip.items.length === 0) return "Planejamento"

  const progress = getTripProgress(trip)
  if (progress.current === progress.total && progress.total > 0) return undefined // Show progress bar instead
  if (progress.current === 0) return "Planejamento"

  return undefined // Show progress bar
}

type TimelinePosition = "first" | "middle" | "last" | "only"

function getTimelinePosition(index: number, total: number): TimelinePosition {
  if (total === 1) return "only"
  if (index === 0) return "first"
  if (index === total - 1) return "last"
  return "middle"
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

export default function ItineraryIndex() {
  const navigate = useNavigate()
  const toast = useToast()
  const {
    activeTrips,
    archivedTrips,
    trips,
    isLoading,
    createNewTrip,
    restoreTrip,
    deleteTrip,
    importTrip,
  } = useTrips()

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; tripId: string | null }>({
    open: false,
    tripId: null,
  })
  const [importDialogOpen, setImportDialogOpen] = useState(false)
  const [importState, setImportState] = useState<ImportState>("idle")
  const [importPreview, setImportPreview] = useState<ImportPreview | null>(null)
  const [importData, setImportData] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string>("")

  const handleCreateTrip = (data: { name: string; description?: string; startDate?: string; endDate?: string }) => {
    const trip = createNewTrip(data.name, {
      description: data.description,
      startDate: data.startDate,
      endDate: data.endDate,
    })
    navigate(`/itinerary/${trip.id}`)
  }

  const handleDeleteConfirm = () => {
    if (deleteConfirm.tripId) {
      deleteTrip(deleteConfirm.tripId)
    }
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
        setImportDialogOpen(true)
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
      setImportDialogOpen(true)
    } catch {
      setErrorMessage("Erro ao ler arquivo: JSON inválido")
      setImportState("error")
      setImportDialogOpen(true)
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

  const handleImportClose = () => {
    setImportDialogOpen(false)
    setTimeout(() => {
      setImportState("idle")
      setImportPreview(null)
      setImportData(null)
      setErrorMessage("")
    }, 200)
  }

  const hasAnyTrips = activeTrips.length > 0 || archivedTrips.length > 0

  if (isLoading) {
    return <TripListSkeleton />
  }

  return (
    <div className="min-h-screen bg-paper-base">
      <div className="max-w-md mx-auto pb-24">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-paper-base/95 backdrop-blur-sm border-b border-paper-line">
          <div className="flex items-center justify-between p-4">
            <h1 className="font-sans font-bold text-xl text-ink-primary">
              Minhas Jornadas
            </h1>
            <div className="flex items-center gap-1">
              <BugReportButton />
              <button
                onClick={handleImportClick}
                className="p-2 border border-paper-line rounded-lg hover:bg-secondary btn-press focus-ring"
                aria-label="Importar viagem"
                title="Importar viagem"
              >
                <UploadSimple weight="bold" className="w-5 h-5 text-ink-utility" />
              </button>
            </div>
          </div>
        </header>

        {/* Hidden file input for import */}
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json,.json"
          onChange={handleFileSelect}
          className="hidden"
          aria-hidden="true"
        />

        <section className="p-4">
          {/* Empty State */}
          {!hasAnyTrips && (
            <TripsEmptyState onCreateTrip={() => setShowCreateDialog(true)} />
          )}

          {/* Active Trips */}
          {activeTrips.length > 0 && (
            <div className="mb-6">
              <h2 className="font-mono text-[10px] text-ink-utility tracking-widest mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-action-blue rounded-full" />
                ATIVAS ({activeTrips.length})
              </h2>

              <div className="stagger-item">
                {activeTrips.map((trip, index) => (
                  <TripTimelineCard
                    key={trip.id}
                    emoji={getCountryEmoji(trip.name)}
                    title={trip.name}
                    dateRange={formatDateRange(trip.startDate, trip.endDate)}
                    duration={`${getTripDuration(trip)} dias`}
                    progress={trip.items.length > 0 ? getTripProgress(trip) : undefined}
                    statusLabel={getTripStatusLabel(trip)}
                    state="active"
                    position={getTimelinePosition(index, activeTrips.length)}
                    onClick={() => navigate(`/itinerary/${trip.id}`)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Archived Trips */}
          {archivedTrips.length > 0 && (
            <div>
              {activeTrips.length > 0 && <PerforatedDivider className="mb-6" />}

              <details className="group" open={activeTrips.length === 0}>
                <summary className="font-mono text-[10px] text-ink-utility tracking-widest mb-4 flex items-center gap-2 cursor-pointer list-none hover:text-ink-secondary transition-colors">
                  <Archive weight="bold" className="w-3.5 h-3.5" />
                  <span>MEMÓRIAS ({archivedTrips.length})</span>
                  <span className="ml-auto text-ink-utility/50 group-open:rotate-90 transition-transform">
                    ▶
                  </span>
                </summary>

                <div className="stagger-item">
                  {archivedTrips.map((trip, index) => (
                    <div key={trip.id}>
                      <TripTimelineCard
                        emoji={getCountryEmoji(trip.name)}
                        title={trip.name}
                        dateRange={formatDateRange(trip.startDate, trip.endDate)}
                        duration={`${getTripDuration(trip)} dias`}
                        statusLabel="Concluída"
                        state="archived"
                        position={getTimelinePosition(index, archivedTrips.length)}
                        onClick={() => navigate(`/itinerary/${trip.id}`)}
                      />

                      {/* Actions for archived trips */}
                      <div className="flex gap-2 justify-end -mt-1 mb-4 ml-9">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            restoreTrip(trip.id)
                          }}
                          className="px-3 py-1.5 text-xs font-mono text-ink-utility hover:bg-paper-line rounded-lg btn-press focus-ring flex items-center gap-1.5"
                        >
                          <ArrowCounterClockwise weight="bold" className="w-3.5 h-3.5" />
                          Restaurar
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setDeleteConfirm({ open: true, tripId: trip.id })
                          }}
                          className="px-3 py-1.5 text-xs font-mono text-stamp-brick hover:bg-stamp-brick/10 rounded-lg btn-press focus-ring flex items-center gap-1.5"
                        >
                          <Trash weight="bold" className="w-3.5 h-3.5" />
                          Deletar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </details>
            </div>
          )}

          {/* Create Trip Button (when there are trips) */}
          {hasAnyTrips && (
            <button
              onClick={() => setShowCreateDialog(true)}
              className="w-full mt-6 py-4 bg-paper-card border-2 border-dashed border-paper-line rounded-xl hover:border-action-blue hover:bg-action-blue/5 btn-press focus-ring flex items-center justify-center gap-2 group"
              data-testid="create-trip-button"
            >
              <Plus
                weight="bold"
                className="w-5 h-5 text-ink-utility group-hover:text-action-blue transition-colors"
              />
              <span className="font-body font-medium text-ink-primary group-hover:text-action-blue transition-colors">
                Planejar Nova Viagem
              </span>
            </button>
          )}
        </section>

        <CreateTripDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
          onCreate={handleCreateTrip}
        />

        <ConfirmDialog
          open={deleteConfirm.open}
          onOpenChange={(open) => setDeleteConfirm({ open, tripId: open ? deleteConfirm.tripId : null })}
          title="Deletar Viagem"
          description="Esta viagem será deletada permanentemente. Esta ação não pode ser desfeita."
          confirmLabel="Deletar"
          cancelLabel="Cancelar"
          variant="danger"
          onConfirm={handleDeleteConfirm}
        />

        {/* Import Dialog */}
        <Dialog.Root open={importDialogOpen} onOpenChange={(details) => details.open ? null : handleImportClose()} lazyMount unmountOnExit>
          <Portal>
            <Dialog.Backdrop className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm" />
            <Dialog.Positioner className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <Dialog.Content className="bg-paper-card border border-paper-line rounded-xl shadow-xl max-w-md w-full animate-in fade-in zoom-in-95 duration-200">
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
                          <p>Já existe uma viagem com este nome. A importada será renomeada.</p>
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
                        onClick={handleImportClose}
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
                      onClick={handleImportClose}
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
      </div>
    </div>
  )
}
