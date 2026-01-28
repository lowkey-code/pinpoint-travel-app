import { cn } from "~/lib/utils"

interface BarcodeProps {
  bars?: number
  className?: string
}

export function Barcode({ bars = 10, className }: BarcodeProps) {
  return (
    <div className={cn("barcode text-ink-primary", className)}>
      {Array.from({ length: bars }).map((_, i) => (
        <span key={i} />
      ))}
    </div>
  )
}
