import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router"
import {
  Sun,
  Moon,
  Export,
  ArrowCounterClockwise,
  ArrowClockwise,
  House,
  Copy,
  Archive,
  Trash,
} from "@phosphor-icons/react"
import { cn } from "~/lib/utils"
import { useTheme } from "~/hooks/use-theme"

interface BookmarkMenuProps {
  onExport: () => void
  canUndo: boolean
  canRedo: boolean
  onUndo: () => void
  onRedo: () => void
  onDuplicate?: () => void
  onArchive?: () => void
  onDelete?: () => void
}

export function BookmarkMenu({
  onExport,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onDuplicate,
  onArchive,
  onDelete,
}: BookmarkMenuProps) {
  const navigate = useNavigate()
  const { theme, setTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const isDark = theme === "dark"

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen])

  // Close on escape
  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false)
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [isOpen])

  const handleAction = (action: () => void) => {
    action()
    setIsOpen(false)
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
    setIsOpen(false)
  }

  return (
    <div ref={menuRef} className="fixed right-0 top-24 z-40">
      {/* Horizontal bookmark tab - sticking from right edge */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center justify-center",
          "h-8 pl-4 pr-3",
          "bg-stamp-amber text-white",
          "shadow-lg transition-all duration-200",
          "hover:pl-5 hover:shadow-xl",
          "focus-ring",
          "bookmark-tab-left",
          isOpen && "pl-5 shadow-xl"
        )}
        aria-label="Menu de ações"
        aria-expanded={isOpen}
      >
        <span className="font-mono text-[10px] font-bold tracking-widest uppercase">
          Menu
        </span>
      </button>

      {/* Expanded menu */}
      <div
        className={cn(
          "absolute right-0 top-full mt-2",
          "origin-top-right",
          "transition-all duration-300 ease-out",
          isOpen
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        )}
      >
        <div
          className={cn(
            "bg-paper-card rounded-l-lg",
            "border border-r-0 border-paper-line shadow-xl",
            "min-w-[200px] overflow-hidden"
          )}
        >
          {/* Menu items */}
          <div className="py-2">
            {/* Back to home */}
            <MenuItem
              icon={<House weight="bold" />}
              label="Voltar ao início"
              onClick={() => handleAction(() => navigate("/itinerary"))}
              delay={0}
              isOpen={isOpen}
            />

            <Divider />

            {/* Theme toggle */}
            <MenuItem
              icon={isDark
                ? <Sun weight="bold" className="text-stamp-amber" />
                : <Moon weight="bold" className="text-stamp-navy" />
              }
              label={isDark ? "Modo Parchment" : "Modo Blueprint"}
              onClick={toggleTheme}
              delay={40}
              isOpen={isOpen}
            />

            <Divider />

            {/* Export */}
            <MenuItem
              icon={<Export weight="bold" />}
              label="Exportar"
              onClick={() => handleAction(onExport)}
              delay={80}
              isOpen={isOpen}
              testId="export-button"
            />

            <Divider />

            {/* Undo */}
            <MenuItem
              icon={<ArrowCounterClockwise weight="bold" />}
              label="Desfazer"
              onClick={() => canUndo && handleAction(onUndo)}
              disabled={!canUndo}
              delay={160}
              isOpen={isOpen}
              testId="undo-button"
            />

            {/* Redo */}
            <MenuItem
              icon={<ArrowClockwise weight="bold" />}
              label="Refazer"
              onClick={() => canRedo && handleAction(onRedo)}
              disabled={!canRedo}
              delay={200}
              isOpen={isOpen}
              testId="redo-button"
            />

            {/* Trip management actions */}
            {(onDuplicate || onArchive || onDelete) && (
              <>
                <Divider />

                {onDuplicate && (
                  <MenuItem
                    icon={<Copy weight="bold" />}
                    label="Duplicar viagem"
                    onClick={() => handleAction(onDuplicate)}
                    delay={240}
                    isOpen={isOpen}
                  />
                )}

                {onArchive && (
                  <MenuItem
                    icon={<Archive weight="bold" />}
                    label="Arquivar viagem"
                    onClick={() => handleAction(onArchive)}
                    delay={280}
                    isOpen={isOpen}
                  />
                )}

                {onDelete && (
                  <MenuItem
                    icon={<Trash weight="bold" className="text-stamp-brick" />}
                    label="Excluir viagem"
                    onClick={() => handleAction(onDelete)}
                    delay={320}
                    isOpen={isOpen}
                    variant="danger"
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

interface MenuItemProps {
  icon: React.ReactNode
  label: string
  onClick: () => void
  disabled?: boolean
  delay: number
  isOpen: boolean
  variant?: "default" | "danger"
  testId?: string
}

function MenuItem({ icon, label, onClick, disabled, delay, isOpen, variant = "default", testId }: MenuItemProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      data-testid={testId}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-2.5",
        "text-left text-sm font-body",
        "transition-all duration-150",
        disabled
          ? "opacity-40 cursor-not-allowed"
          : variant === "danger"
            ? "hover:bg-stamp-brick/10 active:bg-stamp-brick/20"
            : "hover:bg-paper-line/50 active:bg-paper-line",
        isOpen && "animate-in fade-in slide-in-from-right-2",
      )}
      style={{
        animationDelay: isOpen ? `${delay}ms` : "0ms",
        animationDuration: "200ms",
        animationFillMode: "backwards"
      }}
    >
      <span className="w-5 h-5 flex items-center justify-center text-ink-utility shrink-0">
        {icon}
      </span>
      <span className={cn("text-ink-primary", variant === "danger" && "text-stamp-brick")}>
        {label}
      </span>
    </button>
  )
}

function Divider() {
  return <div className="h-px bg-paper-line mx-3 my-1" />
}
