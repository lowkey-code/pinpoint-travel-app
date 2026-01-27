import { Dialog } from "./Dialog"
import { Warning } from "@phosphor-icons/react"

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: "default" | "danger"
  onConfirm: () => void
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  variant = "default",
  onConfirm,
}: ConfirmDialogProps) {
  const handleConfirm = () => {
    onConfirm()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange} title={title}>
      <div className="space-y-4">
        {variant === "danger" && (
          <div className="flex items-center gap-2 text-stamp-brick">
            <Warning className="w-5 h-5" weight="bold" />
            <span className="text-sm font-medium font-body">Esta ação não pode ser desfeita</span>
          </div>
        )}
        <p className="text-sm text-ink-secondary font-body">{description}</p>
        <div className="flex gap-3 justify-end pt-2">
          <button
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 rounded-lg border border-paper-line hover:bg-secondary transition-colors font-body"
          >
            {cancelLabel}
          </button>
          <button
            onClick={handleConfirm}
            className={`px-4 py-2 rounded-lg transition-colors font-body ${
              variant === "danger"
                ? "bg-stamp-brick text-white hover:bg-stamp-brick/90"
                : "bg-action-blue text-white hover:bg-action-hover"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Dialog>
  )
}
