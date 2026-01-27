import { forwardRef } from "react"
import { cn } from "~/lib/utils"
import type { ButtonVariant, ButtonSize } from "./types"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: "left" | "right"
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-action-blue text-white hover:bg-action-hover",
  secondary: "bg-secondary text-ink-primary hover:bg-secondary/80 border border-paper-line",
  ghost: "hover:bg-secondary text-ink-primary",
  danger: "bg-stamp-brick text-white hover:bg-stamp-brick/90",
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      icon,
      iconPosition = "left",
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action-blue focus-visible:ring-offset-2",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "tap-target",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {loading ? (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : icon && iconPosition === "left" ? (
          icon
        ) : null}
        {children}
        {!loading && icon && iconPosition === "right" ? icon : null}
      </button>
    )
  }
)

Button.displayName = "Button"
