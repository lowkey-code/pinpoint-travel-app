import { Dialog as ArkDialog, Portal } from "@ark-ui/react"
import { useState } from "react"
import { OnboardingSteps } from "./OnboardingSteps"

interface OnboardingDialogProps {
  open: boolean
  onComplete: () => void
}

export function OnboardingDialog({ open, onComplete }: OnboardingDialogProps) {
  const [currentStep, setCurrentStep] = useState<0 | 1 | 2 | 3>(0)

  // Don't render anything if not open
  if (!open) return null

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep((s) => (s + 1) as 0 | 1 | 2 | 3)
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((s) => (s - 1) as 0 | 1 | 2 | 3)
    }
  }

  const handleComplete = () => {
    setCurrentStep(0)
    onComplete()
  }

  const handleSkip = () => {
    setCurrentStep(0)
    onComplete()
  }

  const handleDotClick = (step: 0 | 1 | 2 | 3) => {
    setCurrentStep(step)
  }

  const isLastStep = currentStep === 3

  return (
    <ArkDialog.Root
      open={open}
      onOpenChange={() => {}}
      lazyMount
      unmountOnExit
      closeOnEscape={false}
      closeOnInteractOutside={false}
    >
      <Portal>
        <ArkDialog.Backdrop className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[55] animate-in fade-in duration-200" />
        <ArkDialog.Positioner className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <ArkDialog.Content
            data-testid="onboarding-dialog"
            className="bg-paper-card border border-paper-line rounded-xl shadow-2xl max-w-md w-full animate-in fade-in zoom-in-95 duration-200"
          >
            {/* Step Content */}
            <OnboardingSteps step={currentStep} />

            {/* Footer with navigation */}
            <div className="px-6 pb-6">
              {/* Progress Dots */}
              <div className="flex justify-center gap-3 mb-6">
                {([0, 1, 2, 3] as const).map((dot) => (
                  <button
                    key={dot}
                    data-testid={`onboarding-dot-${dot}`}
                    onClick={() => handleDotClick(dot)}
                    className={`w-2 h-2 rounded-full transition-colors cursor-pointer ${
                      currentStep === dot ? "bg-action-blue" : "bg-paper-line hover:bg-ink-utility"
                    }`}
                    aria-label={`Passo ${dot + 1}`}
                  />
                ))}
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-3">
                {currentStep > 0 && (
                  <button
                    data-testid="onboarding-prev-btn"
                    onClick={handlePrev}
                    className="px-4 py-2 rounded-lg font-medium text-ink-secondary hover:text-ink-primary transition-colors"
                  >
                    Anterior
                  </button>
                )}
                <div className="flex-1" />
                {!isLastStep && (
                  <button
                    data-testid="onboarding-next-btn"
                    onClick={handleNext}
                    className="bg-action-blue text-white hover:bg-action-hover px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    Próximo
                  </button>
                )}
                {isLastStep && (
                  <button
                    data-testid="onboarding-complete-btn"
                    onClick={handleComplete}
                    className="bg-action-blue text-white hover:bg-action-hover px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    Começar
                  </button>
                )}
              </div>

              {/* Skip Link */}
              <div className="mt-4 text-center">
                <button
                  data-testid="onboarding-skip-btn"
                  onClick={handleSkip}
                  className="text-ink-secondary hover:text-ink-primary text-sm transition-colors"
                >
                  Pular
                </button>
              </div>
            </div>
          </ArkDialog.Content>
        </ArkDialog.Positioner>
      </Portal>
    </ArkDialog.Root>
  )
}
