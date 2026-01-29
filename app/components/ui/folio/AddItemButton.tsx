import { cn } from "~/lib/utils"
import { Plus } from "@phosphor-icons/react"

interface AddItemButtonProps {
  onClick: () => void
  label?: string
  className?: string
}

export function AddItemButton({ onClick, label = "Adicionar", className }: AddItemButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full py-3.5 bg-paper-card border-2 border-dashed border-paper-line rounded-xl",
        "hover:border-action-blue hover:bg-action-blue/5",
        "btn-press focus-ring flex items-center justify-center gap-2 group",
        className
      )}
    >
      <Plus
        weight="bold"
        className="w-4 h-4 text-ink-utility group-hover:text-action-blue transition-colors"
      />
      <span className="font-body text-sm font-medium text-ink-secondary group-hover:text-action-blue transition-colors">
        {label}
      </span>
    </button>
  )
}
