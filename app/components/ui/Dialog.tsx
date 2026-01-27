import { Dialog as ArkDialog, Portal } from "@ark-ui/react"
import { X } from "lucide-react"
import type { ReactNode } from "react"

interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  children: ReactNode
}

export function Dialog({ open, onOpenChange, title, description, children }: DialogProps) {
  return (
    <ArkDialog.Root open={open} onOpenChange={(e) => onOpenChange(e.open)}>
      <Portal>
        <ArkDialog.Backdrop className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-in fade-in duration-200" />
        <ArkDialog.Positioner className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <ArkDialog.Content className="bg-background border border-border rounded-xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <ArkDialog.Title className="text-xl font-serif font-bold">
                    {title}
                  </ArkDialog.Title>
                  {description && (
                    <ArkDialog.Description className="text-sm text-muted-foreground mt-1">
                      {description}
                    </ArkDialog.Description>
                  )}
                </div>
                <ArkDialog.CloseTrigger asChild>
                  <button
                    className="p-1 hover:bg-secondary rounded-lg transition-colors"
                    aria-label="Fechar"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </ArkDialog.CloseTrigger>
              </div>
              {children}
            </div>
          </ArkDialog.Content>
        </ArkDialog.Positioner>
      </Portal>
    </ArkDialog.Root>
  )
}
