import { createContext, useContext, useState, useCallback } from "react"
import type { ReactNode } from "react"

export interface Toast {
  id: string
  message: string
  type: "success" | "error" | "info"
}

interface ToastContextValue {
  toasts: Toast[]
  addToast: (message: string, type: Toast["type"]) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within ToastProvider")
  }
  return {
    success: (message: string) => context.addToast(message, "success"),
    error: (message: string) => context.addToast(message, "error"),
    info: (message: string) => context.addToast(message, "info"),
  }
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((message: string, type: Toast["type"]) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3000)
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  )
}

export { ToastContext }
