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
              isLoading={isLoading}
            />
          ))}
        </div>
      )}

      {tier1Keywords.length > 0 && tier2Keywords.length > 0 && (
        <div className="border-t border-border" />
      )}

      {tier2Keywords.length > 0 && (
        <div className="space-y-8">
          <p className="text-xs font-medium text-tier-2">
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
