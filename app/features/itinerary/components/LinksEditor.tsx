import { Plus, X } from "@phosphor-icons/react"

interface LinksEditorProps {
  links: string[]
  onChange: (links: string[]) => void
}

export function LinksEditor({ links, onChange }: LinksEditorProps) {
  const addLink = () => {
    onChange([...links, ""])
  }

  const removeLink = (index: number) => {
    onChange(links.filter((_, i) => i !== index))
  }

  const updateLink = (index: number, value: string) => {
    onChange(links.map((link, i) => (i === index ? value : link)))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium font-body">Links</label>
        <button
          type="button"
          onClick={addLink}
          className="text-xs text-action-blue hover:underline flex items-center gap-1 font-body"
          aria-label="Adicionar link"
        >
          <Plus className="w-3 h-3" weight="bold" />
          Adicionar
        </button>
      </div>

      {links.length === 0 && (
        <p className="text-xs text-ink-utility italic font-body">Nenhum link adicionado</p>
      )}

      <div className="space-y-2">
        {links.map((link, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="url"
              value={link}
              onChange={(e) => updateLink(index, e.target.value)}
              className="flex-1 px-3 py-2 border border-paper-line rounded-lg bg-paper-card focus:ring-2 focus:ring-action-blue outline-none text-sm font-body"
              placeholder="https://exemplo.com"
              aria-label={`Link ${index + 1}`}
            />
            <button
              type="button"
              onClick={() => removeLink(index)}
              className="p-2 hover:bg-stamp-brick/10 text-stamp-brick rounded-lg transition-colors tap-target"
              aria-label={`Remover link ${index + 1}`}
            >
              <X className="w-4 h-4" weight="bold" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
