import { cn } from "~/lib/utils"
import type { StampVariant } from "./types"

interface StampBadgeProps {
  variant: StampVariant
  rotated?: boolean
  size?: "sm" | "md"
  children: React.ReactNode
  className?: string
}

const variantStyles: Record<StampVariant, string> = {
  sage: "border-stamp-sage text-stamp-sage",
  amber: "border-stamp-amber text-stamp-amber",
  navy: "border-stamp-navy text-stamp-navy",
  brick: "border-stamp-brick text-stamp-brick",
}

const sizeStyles = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-3 py-1 text-sm",
}

export function StampBadge({
  variant,
  rotated = false,
  size = "sm",
  children,
  className,
}: StampBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center font-semibold border-2 rounded uppercase tracking-wide",
        variantStyles[variant],
        sizeStyles[size],
        rotated && "stamp-rotated",
        className
      )}
    >
      {children}
    </span>
  )
}
