import { KeywordTierSection } from "./keyword-tier-section"
import { Button } from "@/components/ui/button"
import { Search, Loader2 } from "lucide-react"
import type { Keyword, KeywordTier } from "@/types"

interface KeywordPanelProps {
  keywords: Keyword[]
  onRemove: (id: string) => void
  onAdd: (text: string, tier: KeywordTier) => void
  onSearch: () => void
  isSearching: boolean
}

export function KeywordPanel({
  keywords,
  onRemove,
  onAdd,
  onSearch,
  isSearching,
}: KeywordPanelProps) {
  const tier1 = keywords.filter((k) => k.tier === 1)
  const tier2 = keywords.filter((k) => k.tier === 2)

  return (
    <div className="space-y-6 rounded-xl border border-border bg-card p-6">
      <div>
        <h2 className="text-base font-semibold">Keywords</h2>
        <p className="text-sm text-muted-foreground">
          Edit keywords before searching. Add or remove as needed.
        </p>
      </div>

      <KeywordTierSection
        tier={1}
        label="Tier 1 — Direct"
        description="Exact places, landmarks, and attractions"
        keywords={tier1}
        onRemove={onRemove}
        onAdd={onAdd}
      />

      <div className="border-t border-border" />

      <KeywordTierSection
        tier={2}
        label="Tier 2 — Related"
        description="Themes, cultural elements, and related topics"
        keywords={tier2}
        onRemove={onRemove}
        onAdd={onAdd}
      />

      <Button
        onClick={onSearch}
        disabled={isSearching || keywords.length === 0}
        className="btn-gradient w-full rounded-xl border-0 text-sm font-medium text-white"
        size="lg"
      >
        {isSearching ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Searching Images...
          </>
        ) : (
          <>
            <Search className="mr-2 h-4 w-4" />
            Search Images
          </>
        )}
      </Button>
    </div>
  )
}
