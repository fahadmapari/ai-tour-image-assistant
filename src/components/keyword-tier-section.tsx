import { useState } from "react"
import { Input } from "@/components/ui/input"
import { KeywordPill } from "./keyword-pill"
import { Plus } from "lucide-react"
import type { Keyword, KeywordTier } from "@/types"

interface KeywordTierSectionProps {
  tier: KeywordTier
  label: string
  description: string
  keywords: Keyword[]
  onRemove: (id: string) => void
  onAdd: (text: string, tier: KeywordTier) => void
}

export function KeywordTierSection({
  tier,
  label,
  description,
  keywords,
  onRemove,
  onAdd,
}: KeywordTierSectionProps) {
  const [newKeyword, setNewKeyword] = useState("")

  const handleAdd = () => {
    if (newKeyword.trim()) {
      onAdd(newKeyword.trim(), tier)
      setNewKeyword("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAdd()
    }
  }

  return (
    <div className="space-y-3">
      <div>
        <h3
          className={`text-sm font-bold uppercase tracking-widest ${
            tier === 1 ? "text-tier-1" : "text-tier-2"
          }`}
        >
          {label}
        </h3>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {keywords.map((keyword) => (
          <KeywordPill
            key={keyword.id}
            text={keyword.text}
            tier={keyword.tier}
            onRemove={() => onRemove(keyword.id)}
          />
        ))}

        <div className="inline-flex items-center gap-1">
          <Input
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add keyword..."
            className="h-8 w-36 border-2 border-dashed border-border bg-transparent text-xs"
          />
          <button
            onClick={handleAdd}
            disabled={!newKeyword.trim()}
            className="flex h-8 w-8 items-center justify-center border-2 border-dashed border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors disabled:opacity-30"
            aria-label="Add keyword"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
