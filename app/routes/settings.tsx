import { useState } from "react"
import { useNavigate } from "react-router"
import { CaretLeft, DeviceMobile, Check } from "@phosphor-icons/react"
import { ThemeToggle } from "~/components/ui/ThemeToggle"
import { InstallInstructions } from "~/components/ui/folio"
import { usePWAInstall } from "~/hooks/use-pwa-install"

export default function Settings() {
  const navigate = useNavigate()
  const { canInstall, isInstalled, isIOS, isMobile, hasNativePrompt, install, isDismissed } = usePWAInstall()
  const [showInstallInstructions, setShowInstallInstructions] = useState(false)

  const showInstallSection = !isInstalled && (canInstall || isDismissed)

  const handleInstall = async () => {
    if (hasNativePrompt && !isIOS) {
      await install()
    } else {
      setShowInstallInstructions(true)
    }
  }

  return (
    <div className="max-w-md mx-auto p-4 pb-24">
      <header className="flex items-center gap-3 pt-2 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="touch-target hover:bg-paper-line rounded-lg btn-press focus-ring"
          aria-label="Voltar"
        >
          <CaretLeft weight="bold" className="text-ink-utility" />
        </button>
        <div>
          <h1 className="text-xl font-sans font-bold">Ajustes</h1>
          <p className="text-xs text-ink-secondary font-body">Configurações do aplicativo</p>
        </div>
      </header>

      <div className="space-y-4">
        {/* Theme Section */}
        <section className="bg-paper-card border border-paper-line rounded-xl p-4">
          <h2 className="font-sans font-semibold mb-3">Aparência</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-body">Tema</p>
              <p className="text-sm text-ink-secondary font-body">Claro, escuro ou automático</p>
            </div>
            <ThemeToggle />
          </div>
        </section>

        {/* Install Section */}
        {showInstallSection && (
          <section className="bg-paper-card border border-paper-line rounded-xl p-4">
            <h2 className="font-sans font-semibold mb-3">Instalação</h2>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-action-blue/10 rounded-lg flex items-center justify-center">
                  <DeviceMobile weight="fill" className="text-action-blue" />
                </div>
                <div>
                  <p className="font-body">Instalar aplicativo</p>
                  <p className="text-sm text-ink-secondary font-body">
                    Acesse offline a qualquer momento
                  </p>
                </div>
              </div>
              <button
                onClick={handleInstall}
                className="px-4 py-2 bg-action-blue text-white text-sm font-body font-medium rounded-lg hover:bg-action-hover btn-press focus-ring"
              >
                Instalar
              </button>
            </div>
          </section>
        )}

        {isInstalled && (
          <section className="bg-paper-card border border-paper-line rounded-xl p-4">
            <h2 className="font-sans font-semibold mb-3">Instalação</h2>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-stamp-sage/10 rounded-lg flex items-center justify-center">
                <Check weight="bold" className="text-stamp-sage" />
              </div>
              <div>
                <p className="font-body text-ink-primary">Aplicativo instalado</p>
                <p className="text-sm text-ink-secondary font-body">
                  Você está usando o Folio como app
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Data Section */}
        <section className="bg-paper-card border border-paper-line rounded-xl p-4">
          <h2 className="font-sans font-semibold mb-3">Dados</h2>
          <div className="space-y-2 text-sm text-ink-secondary font-body">
            <p>Seus dados são salvos localmente no navegador.</p>
            <p>Para exportar ou importar viagens, acesse a viagem específica.</p>
          </div>
        </section>

        {/* About Section */}
        <section className="bg-paper-card border border-paper-line rounded-xl p-4">
          <h2 className="font-sans font-semibold mb-4">Sobre</h2>
          <div className="flex items-start gap-4">
            <img
              src="/logo.svg"
              alt="Folio"
              className="w-14 h-14 rounded-xl shadow-sm"
            />
            <div className="space-y-1">
              <p className="font-sans font-bold text-ink-primary">Folio</p>
              <p className="text-sm text-ink-secondary font-body">
                Planejador de viagens offline-first
              </p>
              <p className="font-mono text-[10px] text-ink-utility tracking-wider">
                VELLUM DESIGN SYSTEM
              </p>
            </div>
          </div>
        </section>
      </div>

      <InstallInstructions
        open={showInstallInstructions}
        onClose={() => setShowInstallInstructions(false)}
        isIOS={isIOS}
        isMobile={isMobile}
      />
    </div>
  )
}
