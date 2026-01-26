import { Plus, X } from "lucide-react"

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
        <label className="block text-sm font-medium">Links</label>
        <button
          type="button"
          onClick={addLink}
          className="text-xs text-primary hover:underline flex items-center gap-1"
          aria-label="Adicionar link"
        >
          <Plus className="w-3 h-3" />
          Adicionar
        </button>
      </div>

      {links.length === 0 && (
        <p className="text-xs text-muted-foreground italic">Nenhum link adicionado</p>
      )}

      <div className="space-y-2">
        {links.map((link, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="url"
              value={link}
              onChange={(e) => updateLink(index, e.target.value)}
              className="flex-1 px-3 py-2 border border-input rounded-lg bg-background focus:ring-2 focus:ring-ring outline-none text-sm"
              placeholder="https://exemplo.com"
              aria-label={`Link ${index + 1}`}
            />
            <button
              type="button"
              onClick={() => removeLink(index)}
              className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors tap-target"
              aria-label={`Remover link ${index + 1}`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
