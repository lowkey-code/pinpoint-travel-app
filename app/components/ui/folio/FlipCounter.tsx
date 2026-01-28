import { cn } from "~/lib/utils"

interface FlipCounterProps {
  value: number
  label?: string
  size?: "sm" | "md" | "lg"
  className?: string
}

const sizeStyles = {
  sm: "text-2xl",
  md: "text-4xl",
  lg: "text-6xl",
}

export function FlipCounter({
  value,
  label,
  size = "md",
  className,
}: FlipCounterProps) {
  const displayValue = String(value).padStart(2, "0")

  return (
    <div className={cn("text-center", className)}>
      <div className="flip-number">
        <span
          className={cn(
            "font-mono font-bold leading-none tabular-nums",
            sizeStyles[size]
          )}
        >
          {displayValue}
        </span>
      </div>
      {label && (
        <p className="font-mono text-xs opacity-70 mt-1 uppercase tracking-wider">
          {label}
        </p>
      )}
    </div>
  )
}
