import { KeywordTierSection } from "./keyword-tier-section"
import { Button } from "@/components/ui/button"
import { getImageSourceFilterLabel, IMAGE_SOURCE_FILTER_OPTIONS } from "@/lib/image-source"
import { Search, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ImageSourceFilter, Keyword, KeywordTier } from "@/types"

interface KeywordPanelProps {
  keywords: Keyword[]
  sourceFilter: ImageSourceFilter
  onRemove: (id: string) => void
  onAdd: (text: string, tier: KeywordTier) => void
  onSourceFilterChange: (filter: ImageSourceFilter) => void
  onSearch: () => void
  isSearching: boolean
}

export function KeywordPanel({
  keywords,
  sourceFilter,
  onRemove,
  onAdd,
  onSourceFilterChange,
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

      <div className="space-y-3">
        <div>
          <h3 className="text-sm font-medium">Image Sources</h3>
          <p className="text-sm text-muted-foreground">
            Choose whether to search Pixabay, Unsplash, or both.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {IMAGE_SOURCE_FILTER_OPTIONS.map((option) => {
            const isActive = option === sourceFilter

            return (
              <Button
                key={option}
                type="button"
                variant={isActive ? "secondary" : "outline"}
                size="sm"
                onClick={() => onSourceFilterChange(option)}
                className={cn(
                  "rounded-full px-4",
                  isActive && "border-primary/20 bg-primary/10 text-primary"
                )}
              >
                {getImageSourceFilterLabel(option)}
              </Button>
            )
          })}
        </div>
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
