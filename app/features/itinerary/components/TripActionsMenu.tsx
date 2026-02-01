import { useState } from "react"
import { useNavigate } from "react-router"
import { useTrips, useItinerary, exportTrip as exportTripToJson } from "~/features/itinerary"
import { useToast } from "~/hooks/use-toast"
import { BookmarkMenu } from "~/components/ui/folio"
import { ConfirmDialog } from "~/components/ui/ConfirmDialog"

interface TripActionsMenuProps {
  tripId: string
}

export function TripActionsMenu({ tripId }: TripActionsMenuProps) {
  const navigate = useNavigate()
  const { archiveTrip, deleteTrip, duplicateTrip } = useTrips()
  const { trip: currentTrip, canUndo, canRedo, undo, redo } = useItinerary()
  const toast = useToast()

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

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

  const handleDuplicate = () => {
    const duplicated = duplicateTrip(tripId)
    if (duplicated) {
      toast.success(`Viagem duplicada: "${duplicated.name}"`)
      navigate(`/itinerary/${duplicated.id}`)
    } else {
      toast.error("Erro ao duplicar viagem")
    }
  }

  const handleArchive = () => {
    const tripName = currentTrip?.name ?? "Viagem"
    archiveTrip(tripId)
    toast.success(`"${tripName}" movida para Memórias`)
    navigate("/itinerary")
  }

  const handleDelete = () => {
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    const tripName = currentTrip?.name ?? "Viagem"
    deleteTrip(tripId)
    toast.success(`"${tripName}" excluída permanentemente`)
    navigate("/itinerary")
  }

  return (
    <>
      <BookmarkMenu
        onExport={handleExport}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={undo}
        onRedo={redo}
        onDuplicate={handleDuplicate}
        onArchive={handleArchive}
        onDelete={handleDelete}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Excluir viagem"
        description={`Tem certeza que deseja excluir "${currentTrip?.name ?? "esta viagem"}"? Todos os dias e itens serão perdidos permanentemente.`}
        confirmLabel="Excluir viagem"
        cancelLabel="Cancelar"
        variant="danger"
        onConfirm={handleConfirmDelete}
      />
    </>
  )
}
