import { Sun, Moon, Monitor } from "lucide-react"
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
      aria-label="Alternar tema"
      title={
        theme === "light"
          ? "Modo claro"
          : theme === "dark"
          ? "Modo escuro"
          : "Modo sistema"
      }
    >
      {theme === "light" && <Sun className="w-5 h-5" />}
      {theme === "dark" && <Moon className="w-5 h-5" />}
      {theme === "system" && <Monitor className="w-5 h-5" />}
    </button>
  )
}
