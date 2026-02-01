import {
  Airplane,
  Plus,
  UploadSimple,
  SunHorizon,
  Sun,
  Moon,
  WifiSlash,
  Export,
} from "@phosphor-icons/react"

interface OnboardingStepsProps {
  step: 0 | 1 | 2 | 3
}

export function OnboardingSteps({ step }: OnboardingStepsProps) {
  return (
    <div data-testid={`onboarding-step-${step}`} className="py-8 px-6">
      {step === 0 && (
        <>
          <div className="flex items-center justify-center">
            <Airplane
              size={48}
              weight="duotone"
              className="text-action-blue"
            />
          </div>
          <h2 className="font-sans font-bold text-xl text-ink-primary text-center mt-4">
            Bem-vindo ao Folio
          </h2>
          <p className="font-body text-ink-secondary text-center max-w-xs mx-auto mt-2">
            Seu companheiro de viagem offline-first. Planeje, organize e
            aproveite.
          </p>
        </>
      )}

      {step === 1 && (
        <>
          <div className="flex items-center justify-center gap-2">
            <Plus size={32} weight="bold" className="text-action-blue" />
            <UploadSimple size={32} weight="bold" className="text-action-blue" />
          </div>
          <h2 className="font-sans font-bold text-xl text-ink-primary text-center mt-4">
            Comece sua jornada
          </h2>
          <p className="font-body text-ink-secondary text-center max-w-xs mx-auto mt-2">
            Crie uma viagem do zero ou importe um roteiro existente.
          </p>
        </>
      )}

      {step === 2 && (
        <>
          <div className="flex items-center justify-center gap-2">
            <SunHorizon size={24} weight="bold" className="text-action-blue" />
            <Sun size={24} weight="bold" className="text-action-blue" />
            <Moon size={24} weight="bold" className="text-action-blue" />
          </div>
          <h2 className="font-sans font-bold text-xl text-ink-primary text-center mt-4">
            Organize seu dia
          </h2>
          <p className="font-body text-ink-secondary text-center max-w-xs mx-auto mt-2">
            Divida suas atividades em manhã, tarde e noite.
          </p>
        </>
      )}

      {step === 3 && (
        <>
          <div className="flex items-center justify-center gap-2">
            <WifiSlash size={32} weight="bold" className="text-action-blue" />
            <Export size={32} weight="bold" className="text-action-blue" />
          </div>
          <h2 className="font-sans font-bold text-xl text-ink-primary text-center mt-4">
            Sempre com você
          </h2>
          <p className="font-body text-ink-secondary text-center max-w-xs mx-auto mt-2">
            Funciona offline. Exporte e compartilhe quando quiser.
          </p>
        </>
      )}
    </div>
  )
}
