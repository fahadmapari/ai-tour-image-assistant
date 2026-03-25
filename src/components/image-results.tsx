import { ImageKeywordSection } from "./image-keyword-section"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import type { Keyword, NormalizedImage } from "@/types"

interface ImageResultsProps {
  keywords: Keyword[]
  results: Map<string, NormalizedImage[]>
  hasMore: Map<string, boolean>
  loadingKeywords: Set<string>
  tier2Searched: boolean
  onSelectImage: (image: NormalizedImage) => void
  onSearchTier2: () => void
  onLoadMore: (keyword: Keyword) => void
}

export function ImageResults({
  keywords,
  results,
  hasMore,
  loadingKeywords,
  tier2Searched,
  onSelectImage,
  onSearchTier2,
  onLoadMore,
}: ImageResultsProps) {
  const tier1Keywords = keywords.filter((k) => k.tier === 1)
  const tier2Keywords = keywords.filter((k) => k.tier === 2)
  const isTier2Loading = tier2Keywords.some((k) => loadingKeywords.has(k.id))

  return (
    <div className="space-y-10 pt-2">
      {tier1Keywords.length > 0 && (
        <div className="space-y-8">
          <p className="text-xs font-medium text-tier-1">
            Tier 1 — Direct Matches
          </p>
          {tier1Keywords.map((keyword) => (
            <ImageKeywordSection
              key={keyword.id}
              keyword={keyword}
              images={results.get(keyword.id)}
              isLoading={
                loadingKeywords.has(keyword.id) && !results.has(keyword.id)
              }
              isLoadingMore={
                loadingKeywords.has(keyword.id) && results.has(keyword.id)
              }
              hasMore={hasMore.get(keyword.id) ?? false}
              onSelectImage={onSelectImage}
              onLoadMore={() => onLoadMore(keyword)}
            />
          ))}
        </div>
      )}

      {tier1Keywords.length > 0 && tier2Keywords.length > 0 && (
        <div className="border-t border-border" />
      )}

      {tier2Keywords.length > 0 && !tier2Searched && (
        <div className="space-y-4">
          <p className="text-xs font-medium text-tier-2">
            Tier 2 — Related Matches
          </p>
        <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border px-6 py-10">
          <p className="text-sm text-muted-foreground">
            Didn't find any direct matches? Try related
          </p>
          <Button variant="outline" size="sm" onClick={onSearchTier2}>
            <Search className="mr-2 h-3.5 w-3.5" />
            Search Related
          </Button>
        </div>
        </div>
      )}

      {tier2Keywords.length > 0 && tier2Searched && (
        <div className="space-y-8">
          <p className="text-xs font-medium text-tier-2">
            Tier 2 — Related Matches
          </p>
          {tier2Keywords.map((keyword) => (
            <ImageKeywordSection
              key={keyword.id}
              keyword={keyword}
              images={results.get(keyword.id)}
              isLoading={
                loadingKeywords.has(keyword.id) && !results.has(keyword.id)
              }
              isLoadingMore={
                loadingKeywords.has(keyword.id) && results.has(keyword.id)
              }
              hasMore={hasMore.get(keyword.id) ?? false}
              onSelectImage={onSelectImage}
              onLoadMore={() => onLoadMore(keyword)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
