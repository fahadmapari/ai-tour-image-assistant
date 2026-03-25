import { useState } from "react"
import { Input } from "@/components/ui/input"
import { KeywordPill } from "./keyword-pill"
import { Plus, ChevronDown, ChevronRight } from "lucide-react"
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
  const [isCollapsed, setIsCollapsed] = useState(false)

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
      <button
        type="button"
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="flex w-full items-center gap-2 text-left"
      >
        {isCollapsed ? (
          <ChevronRight className={`h-4 w-4 ${tier === 1 ? "text-tier-1" : "text-tier-2"}`} />
        ) : (
          <ChevronDown className={`h-4 w-4 ${tier === 1 ? "text-tier-1" : "text-tier-2"}`} />
        )}
        <div className="flex-1">
          <h3
            className={`text-sm font-medium ${
              tier === 1 ? "text-tier-1" : "text-tier-2"
            }`}
          >
            {label}
            {isCollapsed && keywords.length > 0 && (
              <span className="ml-2 text-xs font-normal text-muted-foreground">
                ({keywords.length})
              </span>
            )}
          </h3>
          {!isCollapsed && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      </button>

      {!isCollapsed && (
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
              className="h-7 w-32 rounded-lg border-dashed bg-transparent text-xs"
            />
            <button
              onClick={handleAdd}
              disabled={!newKeyword.trim()}
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-dashed border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary disabled:opacity-30"
              aria-label="Add keyword"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
