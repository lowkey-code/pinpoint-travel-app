import { X, DeviceMobile, Export, Info } from "@phosphor-icons/react"
import { cn } from "~/lib/utils"

interface InstallBannerProps {
  isIOS: boolean
  hasNativePrompt: boolean
  onInstall: () => void
  onDismiss: () => void
  className?: string
}

export function InstallBanner({
  isIOS,
  hasNativePrompt,
  onInstall,
  onDismiss,
  className,
}: InstallBannerProps) {
  // Determine button label and behavior
  const showNativeInstall = hasNativePrompt && !isIOS
  const buttonLabel = showNativeInstall ? "Instalar" : "Como?"

  return (
    <div
      className={cn(
        "bg-paper-card border border-paper-line rounded-xl p-3 flex items-center gap-3",
        "animate-in fade-in slide-in-from-top-2 duration-300",
        className
      )}
      role="banner"
      aria-label="Instalar aplicativo"
    >
      {/* Icon */}
      <div className="w-10 h-10 bg-action-blue/10 rounded-lg flex items-center justify-center shrink-0">
        <DeviceMobile weight="fill" className="text-action-blue text-xl" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="font-body text-sm font-medium text-ink-primary">
          Instale o Folio
        </p>
        <p className="font-body text-xs text-ink-secondary truncate">
          {isIOS ? "Adicione à tela inicial" : "Acesse offline a qualquer hora"}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        {showNativeInstall ? (
          <button
            onClick={onInstall}
            className="px-3 py-1.5 text-xs font-body font-medium bg-action-blue text-white hover:bg-action-hover rounded-lg btn-press focus-ring"
          >
            {buttonLabel}
          </button>
        ) : (
          <button
            onClick={onInstall}
            className="px-3 py-1.5 text-xs font-body font-medium text-action-blue hover:bg-action-blue/10 rounded-lg btn-press focus-ring flex items-center gap-1"
          >
            {isIOS ? <Export weight="bold" className="text-sm" /> : <Info weight="bold" className="text-sm" />}
            <span className="hidden sm:inline">{buttonLabel}</span>
          </button>
        )}
        <button
          onClick={onDismiss}
          className="p-1.5 text-ink-utility hover:bg-paper-line rounded-lg btn-press focus-ring"
          aria-label="Dispensar"
        >
          <X weight="bold" className="text-sm" />
        </button>
      </div>
    </div>
  )
}

interface InstallInstructionsProps {
  open: boolean
  onClose: () => void
  isIOS: boolean
  isMobile: boolean
}

export function InstallInstructions({ open, onClose, isIOS, isMobile }: InstallInstructionsProps) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center p-4 bg-ink-primary/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-paper-card rounded-2xl p-5 shadow-xl animate-in slide-in-from-bottom-4 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-sans font-bold text-lg text-ink-primary">
            {isIOS ? "Instalar no iOS" : isMobile ? "Instalar no Android" : "Instalar no navegador"}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-paper-line rounded-lg btn-press focus-ring"
            aria-label="Fechar"
          >
            <X weight="bold" className="text-ink-utility" />
          </button>
        </div>

        {isIOS ? (
          <ol className="space-y-4">
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-action-blue text-white rounded-full flex items-center justify-center text-xs font-mono font-bold shrink-0">
                1
              </span>
              <div>
                <p className="font-body text-sm text-ink-primary">
                  Toque no ícone de <strong>Compartilhar</strong>
                </p>
                <p className="font-body text-xs text-ink-secondary mt-0.5">
                  O ícone com uma seta apontando para cima
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-action-blue text-white rounded-full flex items-center justify-center text-xs font-mono font-bold shrink-0">
                2
              </span>
              <div>
                <p className="font-body text-sm text-ink-primary">
                  Role e toque em <strong>"Adicionar à Tela de Início"</strong>
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-action-blue text-white rounded-full flex items-center justify-center text-xs font-mono font-bold shrink-0">
                3
              </span>
              <div>
                <p className="font-body text-sm text-ink-primary">
                  Confirme tocando em <strong>"Adicionar"</strong>
                </p>
              </div>
            </li>
          </ol>
        ) : isMobile ? (
          <ol className="space-y-4">
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-action-blue text-white rounded-full flex items-center justify-center text-xs font-mono font-bold shrink-0">
                1
              </span>
              <div>
                <p className="font-body text-sm text-ink-primary">
                  Toque no menu <strong>⋮</strong> do navegador
                </p>
                <p className="font-body text-xs text-ink-secondary mt-0.5">
                  Três pontos no canto superior direito
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-action-blue text-white rounded-full flex items-center justify-center text-xs font-mono font-bold shrink-0">
                2
              </span>
              <div>
                <p className="font-body text-sm text-ink-primary">
                  Toque em <strong>"Instalar aplicativo"</strong> ou <strong>"Adicionar à tela inicial"</strong>
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-action-blue text-white rounded-full flex items-center justify-center text-xs font-mono font-bold shrink-0">
                3
              </span>
              <div>
                <p className="font-body text-sm text-ink-primary">
                  Confirme tocando em <strong>"Instalar"</strong>
                </p>
              </div>
            </li>
          </ol>
        ) : (
          <ol className="space-y-4">
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-action-blue text-white rounded-full flex items-center justify-center text-xs font-mono font-bold shrink-0">
                1
              </span>
              <div>
                <p className="font-body text-sm text-ink-primary">
                  Clique no ícone de <strong>instalação</strong> na barra de endereço
                </p>
                <p className="font-body text-xs text-ink-secondary mt-0.5">
                  Ou acesse o menu do navegador (⋮)
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-action-blue text-white rounded-full flex items-center justify-center text-xs font-mono font-bold shrink-0">
                2
              </span>
              <div>
                <p className="font-body text-sm text-ink-primary">
                  Clique em <strong>"Instalar Folio"</strong>
                </p>
              </div>
            </li>
          </ol>
        )}

        <button
          onClick={onClose}
          className="w-full mt-4 py-2.5 bg-paper-line hover:bg-paper-line/70 text-ink-primary font-body font-medium rounded-xl btn-press focus-ring"
        >
          Entendi
        </button>
      </div>
    </div>
  )
}

// Backward compatibility alias
export const IOSInstallInstructions = ({ open, onClose }: { open: boolean; onClose: () => void }) => (
  <InstallInstructions open={open} onClose={onClose} isIOS={true} isMobile={true} />
)
