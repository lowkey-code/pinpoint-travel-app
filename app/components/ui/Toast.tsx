import { Portal } from "@ark-ui/react"
import { useContext } from "react"
import { ToastContext } from "~/hooks/use-toast"
import { CheckCircle, XCircle, Info, X } from "lucide-react"

export function ToastContainer() {
  const context = useContext(ToastContext)
  if (!context) return null

  const { toasts, removeToast } = context

  if (toasts.length === 0) return null

  return (
    <Portal>
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto bg-background border border-border rounded-lg shadow-lg px-4 py-3 flex items-center gap-3 min-w-[300px] max-w-[500px] animate-in slide-in-from-bottom-5 duration-300"
          >
            {toast.type === "success" && (
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0" />
            )}
            {toast.type === "error" && (
              <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0" />
            )}
            {toast.type === "info" && (
              <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
            )}
            <p className="flex-1 text-sm">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 hover:bg-secondary rounded transition-colors shrink-0"
              aria-label="Fechar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </Portal>
  )
}
