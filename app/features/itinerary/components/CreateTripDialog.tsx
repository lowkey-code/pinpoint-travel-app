import { useState, type FormEvent } from "react"
import { Dialog } from "~/components/ui/Dialog"
import { Input, Textarea } from "~/components/ui/Input"
import { Airplane } from "@phosphor-icons/react"

interface CreateTripDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreate: (data: { name: string; description?: string; startDate?: string; endDate?: string }) => void
}

export function CreateTripDialog({ open, onOpenChange, onCreate }: CreateTripDialogProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [errors, setErrors] = useState<{ name?: string; endDate?: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    const newErrors: { name?: string; endDate?: string } = {}

    if (!name.trim()) {
      newErrors.name = "Nome é obrigatório"
    }

    if (startDate && endDate && endDate < startDate) {
      newErrors.endDate = "Data final não pode ser antes da data inicial"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsSubmitting(true)

    onCreate({
      name: name.trim(),
      description: description.trim() || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    })

    setName("")
    setDescription("")
    setStartDate("")
    setEndDate("")
    setErrors({})
    setIsSubmitting(false)
    onOpenChange(false)
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setName("")
      setDescription("")
      setStartDate("")
      setEndDate("")
      setErrors({})
    }
    onOpenChange(open)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
      title="Nova Viagem"
      description="Crie um novo roteiro de viagem"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nome da viagem"
          placeholder="Ex: Verão na Europa…"
          value={name}
          onChange={(e) => {
            setName(e.target.value)
            if (errors.name) setErrors({ ...errors, name: undefined })
          }}
          error={errors.name}
          autoFocus
          required
        />

        <Textarea
          label="Descrição (opcional)"
          placeholder="Adicione detalhes sobre a viagem…"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Data de início"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <Input
            label="Data de término"
            type="date"
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value)
              if (errors.endDate) setErrors({ ...errors, endDate: undefined })
            }}
            error={errors.endDate}
            min={startDate || undefined}
          />
        </div>

        <div className="flex gap-3 justify-end pt-2">
          <button
            type="button"
            onClick={() => handleOpenChange(false)}
            className="px-4 py-2 rounded-lg border border-paper-line hover:bg-secondary transition-colors font-body"
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 rounded-lg bg-action-blue text-white hover:bg-action-hover transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed font-body"
          >
            <Airplane className="w-4 h-4" weight="bold" />
            Criar Viagem
          </button>
        </div>
      </form>
    </Dialog>
  )
}
