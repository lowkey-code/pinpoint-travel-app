import { cn } from "~/lib/utils"
import { StampBadge } from "./StampBadge"
import { PerforatedDivider } from "./PerforatedDivider"
import type { StampVariant } from "./types"

interface DataItem {
  label: string
  value: string
  mono?: boolean
}

interface BoardingPassCardProps {
  typeLabel: string
  typeIcon?: React.ReactNode
  stampBadge?: { variant: StampVariant; label: string; rotated?: boolean }
  title: string
  description?: string
  dataItems?: DataItem[]
  actions?: React.ReactNode
  accentColor?: string
  className?: string
  children?: React.ReactNode
}

export function BoardingPassCard({
  typeLabel,
  typeIcon,
  stampBadge,
  title,
  description,
  dataItems,
  actions,
  accentColor,
  className,
  children,
}: BoardingPassCardProps) {
  return (
    <div
      className={cn(
        "bg-paper-card border border-paper-line rounded-xl shadow-sm overflow-hidden",
        className
      )}
    >
      {/* Accent stripe */}
      {accentColor && (
        <div className="h-1" style={{ backgroundColor: accentColor }} />
      )}

      {/* Header section */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            {typeIcon && (
              <span className="text-lg shrink-0">{typeIcon}</span>
            )}
            <span className="text-xs uppercase tracking-wide text-ink-utility font-semibold">
              {typeLabel}
            </span>
          </div>
          {stampBadge && (
            <StampBadge variant={stampBadge.variant} rotated={stampBadge.rotated}>
              {stampBadge.label}
            </StampBadge>
          )}
        </div>

        <h3 className="font-sans font-bold text-lg text-ink-primary mt-2">
          {title}
        </h3>

        {description && (
          <p className="text-sm text-ink-secondary mt-1">{description}</p>
        )}
      </div>

      {/* Perforated divider */}
      {(dataItems && dataItems.length > 0) || children ? (
        <PerforatedDivider />
      ) : null}

      {/* Data section */}
      {dataItems && dataItems.length > 0 && (
        <div className="px-4 pb-4 grid grid-cols-2 gap-3">
          {dataItems.map((item, index) => (
            <div key={index}>
              <p className="text-xs uppercase tracking-wide text-ink-utility">
                {item.label}
              </p>
              <p
                className={cn(
                  "text-sm font-medium text-ink-primary mt-0.5",
                  item.mono && "font-mono tabular-nums"
                )}
              >
                {item.value}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Custom children */}
      {children && <div className="px-4 pb-4">{children}</div>}

      {/* Actions */}
      {actions && (
        <>
          <div className="border-t border-paper-line" />
          <div className="p-3">{actions}</div>
        </>
      )}
    </div>
  )
}
