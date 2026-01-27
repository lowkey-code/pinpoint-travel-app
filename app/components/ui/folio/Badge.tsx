import { cn } from "~/lib/utils"

type BadgeVariant = "default" | "primary" | "success" | "warning" | "danger" | "info"
type BadgeSize = "sm" | "md"

interface BadgeProps {
  variant?: BadgeVariant
  size?: BadgeSize
  icon?: React.ReactNode
  children: React.ReactNode
  className?: string
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-secondary text-ink-secondary",
  primary: "bg-action-blue/10 text-action-blue",
  success: "bg-stamp-sage/10 text-stamp-sage",
  warning: "bg-stamp-amber/10 text-stamp-amber",
  danger: "bg-stamp-brick/10 text-stamp-brick",
  info: "bg-stamp-navy/10 text-stamp-navy",
}

const sizeStyles: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-1 text-sm",
}

export function Badge({
  variant = "default",
  size = "sm",
  icon,
  children,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-medium font-body rounded-full",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  )
}

export type { BadgeVariant, BadgeSize }
