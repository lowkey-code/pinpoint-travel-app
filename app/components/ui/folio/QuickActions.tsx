import { cn } from "~/lib/utils"
import { Link } from "react-router"

interface QuickAction {
  icon: React.ReactNode
  label: string
  href?: string
  onClick?: () => void
}

interface QuickActionsProps {
  actions: QuickAction[]
  className?: string
}

export function QuickActions({ actions, className }: QuickActionsProps) {
  return (
    <div className={cn("grid grid-cols-3 gap-3", className)}>
      {actions.map((action, index) => {
        const content = (
          <>
            <div className="w-12 h-12 bg-paper-line/50 rounded-full flex items-center justify-center mb-2 group-hover:bg-action-blue/10 transition-colors">
              {action.icon}
            </div>
            <span className="font-body text-xs font-medium text-ink-primary">
              {action.label}
            </span>
          </>
        )

        if (action.href) {
          return (
            <Link
              key={index}
              to={action.href}
              className="flex flex-col items-center p-3 rounded-xl bg-paper-card border border-paper-line hover:border-action-blue/30 btn-press focus-ring group"
            >
              {content}
            </Link>
          )
        }

        return (
          <button
            key={index}
            onClick={action.onClick}
            className="flex flex-col items-center p-3 rounded-xl bg-paper-card border border-paper-line hover:border-action-blue/30 btn-press focus-ring group"
          >
            {content}
          </button>
        )
      })}
    </div>
  )
}
