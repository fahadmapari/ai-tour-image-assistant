import { ImageKeywordSection } from "./image-keyword-section"
import type { Keyword, NormalizedImage } from "@/types"

interface ImageResultsProps {
  keywords: Keyword[]
  results: Map<string, NormalizedImage[]>
  isLoading: boolean
}

export function ImageResults({
  keywords,
  results,
  isLoading,
}: ImageResultsProps) {
  const tier1Keywords = keywords.filter((k) => k.tier === 1)
  const tier2Keywords = keywords.filter((k) => k.tier === 2)

  const totalImages = Array.from(results.values()).reduce(
    (sum, imgs) => sum + imgs.length,
    0
  )

  return (
    <div className="space-y-8 border-2 border-border p-6">
      <div>
        <h2 className="text-lg font-bold tracking-tight">Results</h2>
        {!isLoading && (
          <p className="text-sm text-muted-foreground">
            {totalImages} images found across {results.size} keywords
          </p>
        )}
      </div>

      {tier1Keywords.length > 0 && (
        <div className="space-y-6">
          <p className="text-xs font-bold uppercase tracking-widest text-tier-1">
            Tier 1 — Direct Matches
          </p>
          {tier1Keywords.map((keyword) => (
            <ImageKeywordSection
              key={keyword.id}
              keyword={keyword}
              images={results.get(keyword.id)}
              isLoading={isLoading}
            />
          ))}
        </div>
      )}

      {tier1Keywords.length > 0 && tier2Keywords.length > 0 && (
        <div className="border-t-2 border-border" />
      )}

      {tier2Keywords.length > 0 && (
        <div className="space-y-6">
          <p className="text-xs font-bold uppercase tracking-widest text-tier-2">
            Tier 2 — Related Matches
          </p>
          {tier2Keywords.map((keyword) => (
            <ImageKeywordSection
              key={keyword.id}
              keyword={keyword}
              images={results.get(keyword.id)}
              isLoading={isLoading}
            />
          ))}
        </div>
      )}
    </div>
  )
}
