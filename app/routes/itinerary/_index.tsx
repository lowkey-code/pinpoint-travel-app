import { Link, useNavigate } from "react-router"
import { useState } from "react"
import { useTrips } from "~/features/itinerary"
import { Plus, Archive, Copy, Trash2 } from "lucide-react"
import { CreateTripDialog } from "~/features/itinerary/components/CreateTripDialog"
import { ConfirmDialog } from "~/components/ui/ConfirmDialog"

export default function ItineraryIndex() {
  const navigate = useNavigate()
  const {
    activeTrips,
    archivedTrips,
    isLoading,
    createNewTrip,
    archiveTrip,
    restoreTrip,
    duplicateTrip,
    deleteTrip,
  } = useTrips()

  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; tripId: string | null }>({
    open: false,
    tripId: null,
  })

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl mx-auto p-4 py-8">
      <header className="mb-8" data-testid="itinerary-header">
        <h1 className="text-3xl font-serif font-bold mb-2">Minhas Viagens</h1>
        <p className="text-muted-foreground">Organize seus roteiros de viagem</p>
      </header>

      <button
        onClick={() => setShowCreateDialog(true)}
        className="w-full mb-8 p-4 border-2 border-dashed border-border rounded-xl hover:border-primary hover:bg-secondary/50 transition-colors flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground"
        data-testid="create-trip-button"
      >
        <Plus className="w-5 h-5" />
        Nova Viagem
      </button>

      <CreateTripDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onCreate={handleCreateTrip}
      />

      {activeTrips.length === 0 && archivedTrips.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground">Nenhuma viagem criada ainda.</p>
        </div>
      )}

      {activeTrips.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Ativas</h2>
          <div className="space-y-3">
            {activeTrips.map((trip) => (
              <div
                key={trip.id}
                className="bg-card border border-border rounded-xl p-4 hover:shadow-md transition-shadow"
                data-testid={`trip-card-${trip.id}`}
              >
                <div className="flex items-start justify-between">
                  <Link to={`/itinerary/${trip.id}`} className="flex-1" data-testid={`trip-link-${trip.id}`}>
                    <h3 className="font-semibold text-lg mb-1" data-testid={`trip-name-${trip.id}`}>{trip.name}</h3>
                    {trip.description && (
                      <p className="text-sm text-muted-foreground mb-2">{trip.description}</p>
                    )}
                    <div className="flex gap-4 text-xs text-muted-foreground">
                      <span>{trip.days.length} dias</span>
                      <span>{trip.items.length} itens</span>
                    </div>
                  </Link>
                  <div className="flex gap-1">
                    <button
                      onClick={() => {
                        const newName = `${trip.name} - Cópia`
                        duplicateTrip(trip.id, newName)
                      }}
                      className="p-2 hover:bg-secondary rounded-lg transition-colors"
                      aria-label="Duplicar viagem"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => archiveTrip(trip.id)}
                      className="p-2 hover:bg-secondary rounded-lg transition-colors"
                      aria-label="Arquivar viagem"
                    >
                      <Archive className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {archivedTrips.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-4 text-muted-foreground">Arquivadas</h2>
          <div className="space-y-3">
            {archivedTrips.map((trip) => (
              <div
                key={trip.id}
                className="bg-card/50 border border-border rounded-xl p-4 opacity-60"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{trip.name}</h3>
                    <div className="flex gap-4 text-xs text-muted-foreground">
                      <span>{trip.days.length} dias</span>
                      <span>{trip.items.length} itens</span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => restoreTrip(trip.id)}
                      className="p-2 hover:bg-secondary rounded-lg transition-colors"
                      aria-label="Restaurar viagem"
                    >
                      <Archive className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm({ open: true, tripId: trip.id })}
                      className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors"
                      aria-label="Deletar viagem"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <ConfirmDialog
        open={deleteConfirm.open}
        onOpenChange={(open) => setDeleteConfirm({ open, tripId: null })}
        title="Deletar Viagem"
        description="Esta viagem será deletada permanentemente. Esta ação não pode ser desfeita."
        confirmLabel="Deletar"
        cancelLabel="Cancelar"
        variant="danger"
        onConfirm={handleDeleteConfirm}
      />
    </div>
  )
}
