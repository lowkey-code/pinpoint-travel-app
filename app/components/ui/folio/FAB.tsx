import { cn } from "~/lib/utils"
import { Plus } from "@phosphor-icons/react"

interface FABProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode
  label?: string
  animated?: boolean
}

export function FAB({
  onClick,
  icon,
  label = "Adicionar",
  animated = true,
  className,
  ...props
}: FABProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "fixed bottom-28 right-4 w-14 h-14 bg-action-blue text-white rounded-full shadow-lg",
        "hover:bg-action-hover focus-ring flex items-center justify-center",
        "fab-ripple z-30 safe-bottom-fab",
        animated && "fab-animated",
        className
      )}
      aria-label={label}
      {...props}
    >
      {icon || <Plus weight="bold" className="text-2xl" />}
    </button>
  )
}
