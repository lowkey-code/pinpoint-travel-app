import { useState, type ReactNode } from "react"
import { CaretDown } from "@phosphor-icons/react"
import { cn } from "~/lib/utils"

interface CollapsibleSectionProps {
  title: string
  icon: ReactNode
  defaultOpen?: boolean
  children: ReactNode
  className?: string
}

export function CollapsibleSection({
  title,
  icon,
  defaultOpen = false,
  children,
  className,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className={cn("border border-paper-line rounded-lg overflow-hidden", className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 bg-paper-card hover:bg-secondary/50 transition-colors tap-target"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2">
          <span className="text-ink-utility">{icon}</span>
          <span className="text-sm font-medium font-body text-ink-primary">{title}</span>
        </div>
        <CaretDown
          weight="bold"
          className={cn(
            "w-4 h-4 text-ink-utility transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>
      <div
        className={cn(
          "grid transition-all duration-200 ease-out",
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden">
          <div className="p-3 pt-0 space-y-3 border-t border-paper-line bg-paper-base">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
