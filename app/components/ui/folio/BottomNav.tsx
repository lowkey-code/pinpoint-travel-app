import { NavLink } from "react-router"
import { House, Airplane, Gear } from "@phosphor-icons/react"

interface NavItem {
  icon: React.ComponentType<{ weight?: "regular" | "bold" | "fill"; className?: string }>
  label: string
  href: string
}

const navItems: NavItem[] = [
  { icon: House, label: "Início", href: "/" },
  { icon: Airplane, label: "Viagens", href: "/itinerary" },
  { icon: Gear, label: "Ajustes", href: "/settings" },
]

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-paper-card border-t border-paper-line safe-bottom md:hidden">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 px-4 py-2 min-w-[64px] tap-target transition-colors ${
                isActive ? "text-action-blue" : "text-ink-secondary hover:text-ink-primary"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  weight={isActive ? "fill" : "regular"}
                  className="w-6 h-6"
                />
                <span className="text-xs font-body">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
