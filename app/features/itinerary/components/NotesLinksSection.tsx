import { NotePencil } from "@phosphor-icons/react"
import { CollapsibleSection } from "./CollapsibleSection"
import { LinksEditor } from "./LinksEditor"

interface NotesLinksSectionProps {
  notes: string
  links: string[]
  onNotesChange: (value: string) => void
  onLinksChange: (links: string[]) => void
  defaultOpen?: boolean
}

export function NotesLinksSection({
  notes,
  links,
  onNotesChange,
  onLinksChange,
  defaultOpen = false,
}: NotesLinksSectionProps) {
  const hasContent = Boolean(notes || links.some((l) => l.trim()))

  return (
    <CollapsibleSection
      title="Notas e Links"
      icon={<NotePencil weight="bold" className="w-4 h-4" />}
      defaultOpen={defaultOpen || hasContent}
    >
      {/* Notes */}
      <div>
        <label htmlFor="notes-textarea" className="block text-xs font-medium mb-1 font-body text-ink-secondary">
          Observações
        </label>
        <textarea
          id="notes-textarea"
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-paper-line rounded-lg bg-paper-card focus:ring-2 focus:ring-action-blue outline-none resize-none font-body text-sm"
          placeholder="Dicas, lembretes, informações úteis…"
        />
      </div>

      {/* Links */}
      <div className="pt-2">
        <LinksEditor links={links} onChange={onLinksChange} />
      </div>
    </CollapsibleSection>
  )
}
