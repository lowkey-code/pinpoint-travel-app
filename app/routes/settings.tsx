import { ThemeToggle } from "~/components/ui/ThemeToggle"

export default function Settings() {
  return (
    <div className="container max-w-2xl mx-auto p-4 py-8 pb-24">
      <header className="mb-8">
        <h1 className="text-3xl font-sans font-bold mb-2">Ajustes</h1>
        <p className="text-ink-secondary font-body">Configurações do aplicativo</p>
      </header>

      <div className="space-y-6">
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
          <h2 className="font-sans font-semibold mb-3">Sobre</h2>
          <div className="space-y-2 text-sm text-ink-secondary font-body">
            <p><strong className="text-ink-primary">Pinpoint Travel</strong></p>
            <p>Organize seus roteiros de viagem de forma simples e intuitiva.</p>
            <p className="font-mono text-xs text-ink-utility">Folio Design System v3.7</p>
          </div>
        </section>
      </div>
    </div>
  )
}
