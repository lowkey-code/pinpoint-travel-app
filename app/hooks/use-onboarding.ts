import { useState, useCallback } from "react"

const STORAGE_KEY = "folio_onboarding_completed"

function getStoredValue(): boolean {
  if (typeof window === "undefined") return true
  return localStorage.getItem(STORAGE_KEY) === "true"
}

export function useOnboarding() {
  const [hasCompleted, setHasCompleted] = useState(getStoredValue)

  const complete = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, "true")
    setHasCompleted(true)
  }, [])

  const reset = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setHasCompleted(false)
  }, [])

  return { hasCompleted, complete, reset }
}
