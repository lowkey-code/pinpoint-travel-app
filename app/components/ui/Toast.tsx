import { Portal } from "@ark-ui/react"
import { useContext } from "react"
import { ToastContext } from "~/hooks/use-toast"
import { CheckCircle, XCircle, Info, X } from "@phosphor-icons/react"

export function ToastContainer() {
  const context = useContext(ToastContext)
  if (!context) return null

  const { toasts, removeToast } = context

  if (toasts.length === 0) return null

  return (
    <Portal>
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[70] flex flex-col gap-2 pointer-events-none safe-bottom">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto bg-paper-card border border-paper-line rounded-lg shadow-lg px-4 py-3 flex items-center gap-3 min-w-[300px] max-w-[500px] animate-in slide-in-from-bottom-5 duration-300"
          >
            {toast.type === "success" && (
              <CheckCircle className="w-5 h-5 text-stamp-sage shrink-0" weight="fill" />
            )}
            {toast.type === "error" && (
              <XCircle className="w-5 h-5 text-stamp-brick shrink-0" weight="fill" />
            )}
            {toast.type === "info" && (
              <Info className="w-5 h-5 text-action-blue shrink-0" weight="fill" />
            )}
            <p className="flex-1 text-sm font-body">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 hover:bg-secondary rounded transition-colors shrink-0"
              aria-label="Fechar"
            >
              <X className="w-4 h-4" weight="bold" />
            </button>
          </div>
        ))}
      </div>
    </Portal>
  )
}
