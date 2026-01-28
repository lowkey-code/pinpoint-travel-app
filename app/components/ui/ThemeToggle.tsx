import { Scroll, Compass, Desktop } from "@phosphor-icons/react"
import { useTheme } from "~/hooks/use-theme"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const cycleTheme = () => {
    if (theme === "light") setTheme("dark")
    else if (theme === "dark") setTheme("system")
    else setTheme("light")
  }

  return (
    <button
      onClick={cycleTheme}
      className="p-2 hover:bg-secondary rounded-lg transition-colors"
      aria-label="Alternar aparência"
      title={
        theme === "light"
          ? "Parchment"
          : theme === "dark"
          ? "Blueprint"
          : "Sistema"
      }
    >
      {theme === "light" && <Scroll className="w-5 h-5" weight="bold" />}
      {theme === "dark" && <Compass className="w-5 h-5" weight="bold" />}
      {theme === "system" && <Desktop className="w-5 h-5" weight="bold" />}
    </button>
  )
}
