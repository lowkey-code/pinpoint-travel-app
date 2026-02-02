import { useState, useEffect } from "react"
import { Dialog, Portal } from "@ark-ui/react"
import { DeviceMobile, Desktop, Warning } from "@phosphor-icons/react"

const STORAGE_KEY = "folio_desktop_warning_dismissed"

function isDesktop(): boolean {
  if (typeof window === "undefined") return false
  return window.innerWidth >= 768
}

function wasDismissed(): boolean {
  if (typeof window === "undefined") return true
  return sessionStorage.getItem(STORAGE_KEY) === "true"
}

export function DesktopWarningDialog() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (isDesktop() && !wasDismissed()) {
      setOpen(true)
    }
  }, [])

  const handleDismiss = () => {
    sessionStorage.setItem(STORAGE_KEY, "true")
    setOpen(false)
  }

  if (!open) return null

  return (
    <Dialog.Root open={open} onOpenChange={(details) => !details.open && handleDismiss()}>
      <Portal>
        <Dialog.Backdrop className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm" />
        <Dialog.Positioner className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <Dialog.Content
            className="bg-paper-card border border-paper-line rounded-2xl shadow-2xl max-w-sm w-full animate-in fade-in zoom-in-95 duration-200"
            data-testid="desktop-warning-dialog"
          >
            <div className="p-6 text-center">
              {/* Icon */}
              <div className="w-16 h-16 mx-auto mb-4 bg-stamp-amber/10 rounded-2xl flex items-center justify-center">
                <div className="relative">
                  <Desktop weight="duotone" className="w-8 h-8 text-stamp-amber" />
                  <Warning
                    weight="fill"
                    className="w-4 h-4 text-stamp-amber absolute -top-1 -right-1"
                  />
                </div>
              </div>

              {/* Title */}
              <Dialog.Title className="font-sans font-bold text-xl text-ink-primary mb-2">
                Versão Desktop em Construção
              </Dialog.Title>

              {/* Description */}
              <Dialog.Description className="font-body text-ink-secondary mb-6 space-y-3">
                <p>
                  O Folio foi projetado para dispositivos móveis. A experiência no desktop ainda está sendo aprimorada.
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-action-blue">
                  <DeviceMobile weight="bold" className="w-4 h-4" />
                  <span>Recomendamos usar no celular</span>
                </div>
              </Dialog.Description>

              {/* Actions */}
              <div className="space-y-3">
                <button
                  onClick={handleDismiss}
                  className="w-full px-4 py-3 bg-action-blue text-white rounded-xl font-body font-medium hover:bg-action-hover btn-press focus-ring"
                  data-testid="desktop-warning-continue-btn"
                >
                  Continuar mesmo assim
                </button>
                <p className="text-xs text-ink-utility font-body">
                  Este aviso não será exibido novamente nesta sessão
                </p>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
