import { Dialog as ArkDialog, Portal } from "@ark-ui/react"
import { X } from "@phosphor-icons/react"
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
    <ArkDialog.Root open={open} onOpenChange={(e) => onOpenChange(e.open)} lazyMount unmountOnExit>
      <Portal>
        <ArkDialog.Backdrop className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[55] animate-in fade-in duration-200" />
        <ArkDialog.Positioner className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <ArkDialog.Content className="bg-paper-card border border-paper-line rounded-xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <ArkDialog.Title className="text-xl font-sans font-bold">
                    {title}
                  </ArkDialog.Title>
                  {description && (
                    <ArkDialog.Description className="text-sm text-ink-secondary mt-1 font-body">
                      {description}
                    </ArkDialog.Description>
                  )}
                </div>
                <ArkDialog.CloseTrigger asChild>
                  <button
                    className="p-1 hover:bg-secondary rounded-lg transition-colors"
                    aria-label="Fechar"
                  >
                    <X className="w-5 h-5" weight="bold" />
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
