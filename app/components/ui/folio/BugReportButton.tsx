import { Bug } from "@phosphor-icons/react"
import { APP_VERSION } from "~/lib/version"

interface BugReportButtonProps {
  variant?: "icon" | "full"
  errorDetails?: string
  className?: string
}

function getBugReportUrl(errorDetails?: string): string {
  const subject = encodeURIComponent(`[Folio ${APP_VERSION}] Bug Report`)

  let bodyText = `Descreva o problema:\n\n\n`

  if (errorDetails) {
    bodyText += `---\nDetalhes do erro:\n${errorDetails}\n\n`
  }

  bodyText += `---\n`
  bodyText += `Versão: ${APP_VERSION}\n`

  if (typeof window !== "undefined") {
    bodyText += `Navegador: ${navigator.userAgent}\n`
    bodyText += `Tela: ${window.innerWidth}x${window.innerHeight}\n`
    bodyText += `URL: ${window.location.href}`
  }

  const body = encodeURIComponent(bodyText)
  return `mailto:suporte@foliotravel.app?subject=${subject}&body=${body}`
}

export function BugReportButton({ variant = "icon", errorDetails, className = "" }: BugReportButtonProps) {
  const url = getBugReportUrl(errorDetails)

  if (variant === "full") {
    return (
      <a
        href={url}
        data-testid="bug-report-button-full"
        className={`inline-flex items-center gap-2 px-4 py-2 bg-paper-card border border-paper-line rounded-lg hover:bg-paper-line/50 transition-colors font-body text-sm text-ink-primary btn-press focus-ring ${className}`}
      >
        <Bug weight="bold" className="w-4 h-4 text-stamp-brick" />
        Reportar problema
      </a>
    )
  }

  return (
    <a
      href={url}
      data-testid="bug-report-button"
      className={`p-2 rounded-lg hover:bg-paper-line/50 transition-colors btn-press focus-ring ${className}`}
      aria-label="Reportar problema"
      title="Reportar problema"
    >
      <Bug weight="bold" className="w-5 h-5 text-ink-utility hover:text-stamp-brick transition-colors" />
    </a>
  )
}

export { getBugReportUrl }
