import { cn } from "~/lib/utils"

interface PerforatedDividerProps {
  className?: string
}

export function PerforatedDivider({ className }: PerforatedDividerProps) {
  return (
    <div className={cn("relative h-6 flex items-center", className)}>
      {/* Left notch */}
      <div className="absolute -left-3 w-6 h-6 bg-paper-base rounded-full" />
      {/* Dashed line */}
      <div className="flex-1 mx-3 perforation" />
      {/* Right notch */}
      <div className="absolute -right-3 w-6 h-6 bg-paper-base rounded-full" />
    </div>
  )
}
