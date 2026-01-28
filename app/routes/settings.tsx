import { useNavigate } from "react-router"
import { CaretLeft } from "@phosphor-icons/react"
import { ThemeToggle } from "~/components/ui/ThemeToggle"

export default function Settings() {
  const navigate = useNavigate()

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
    </div>
  )
}
