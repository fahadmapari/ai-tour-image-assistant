import { useEffect, useMemo, useState } from "react"
import { ImageKeywordSection } from "./image-keyword-section"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  getEnabledSources,
  getImageSourceFilterLabel,
  getImageSourceLabel,
} from "@/lib/image-source"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"
import type {
  ImageSource,
  ImageSourceFilter,
  Keyword,
  NormalizedImage,
} from "@/types"

interface ImageResultsProps {
  keywords: Keyword[]
  results: Map<string, NormalizedImage[]>
  hasMore: Map<string, boolean>
  loadingKeywords: Set<string>
  sourceFilter: ImageSourceFilter
  tier2Searched: boolean
  onSelectImage: (image: NormalizedImage) => void
  isShortlisted: (image: NormalizedImage) => boolean
  onToggleShortlist: (image: NormalizedImage) => void
  onSearchTier2: () => void
  onLoadMore: (keyword: Keyword) => void
}

export function ImageResults({
  keywords,
  results,
  hasMore,
  loadingKeywords,
  sourceFilter,
  tier2Searched,
  onSelectImage,
  isShortlisted,
  onToggleShortlist,
  onSearchTier2,
  onLoadMore,
}: ImageResultsProps) {
  const tier1Keywords = keywords.filter((k) => k.tier === 1)
  const tier2Keywords = keywords.filter((k) => k.tier === 2)
  const availableSources = useMemo(
    () => getEnabledSources(sourceFilter),
    [sourceFilter]
  )
  const [visibleSources, setVisibleSources] = useState<ImageSource[]>(
    availableSources
  )

  useEffect(() => {
    setVisibleSources(availableSources)
  }, [availableSources])

  const toggleVisibleSource = (source: ImageSource) => {
    if (!availableSources.includes(source)) return

    setVisibleSources((current) =>
      current.includes(source)
        ? current.filter((item) => item !== source)
        : [...current, source]
    )
  }

  const filterImages = (images: NormalizedImage[] | undefined) =>
    images?.filter((image) => visibleSources.includes(image.source))

  const renderKeywordSummary = (tierKeywords: Keyword[]) => (
    <div className="flex flex-wrap gap-2">
      {tierKeywords.map((keyword) => (
        <Badge
          key={keyword.id}
          variant="outline"
          className={
            keyword.tier === 1
              ? "h-auto rounded-lg border-tier-1/30 bg-tier-1-bg px-2.5 py-1 text-tier-1"
              : "h-auto rounded-lg border-tier-2/30 bg-tier-2-bg px-2.5 py-1 text-tier-2"
          }
        >
          {keyword.text}
        </Badge>
      ))}
    </div>
  )

  return (
    <div className="space-y-10 pt-2">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">
            View:
          </span>
          {(["pixabay", "unsplash"] as ImageSource[]).map((source) => {
            const isAvailable = availableSources.includes(source)
            const isVisible = visibleSources.includes(source)

            return (
              <Button
                key={source}
                type="button"
                variant={isVisible ? "secondary" : "outline"}
                size="sm"
                disabled={!isAvailable}
                onClick={() => toggleVisibleSource(source)}
                className={cn(
                  "rounded-full px-4",
                  isVisible && "border-primary/20 bg-primary/10 text-primary"
                )}
              >
                {getImageSourceLabel(source)}
              </Button>
            )
          })}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">
            Searching:
          </span>
          <span className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium">
            {getImageSourceFilterLabel(sourceFilter)}
          </span>
        </div>
      </div>

      {tier1Keywords.length > 0 && (
        <div className="space-y-8">
          <div className="space-y-3">
            <p className="text-xs font-medium text-tier-1">
              Tier 1 - Direct Matches
            </p>
            {renderKeywordSummary(tier1Keywords)}
          </div>
          {tier1Keywords.map((keyword) => (
            <ImageKeywordSection
              key={keyword.id}
              keyword={keyword}
              images={filterImages(results.get(keyword.id))}
              isLoading={
                loadingKeywords.has(keyword.id) && !results.has(keyword.id)
              }
              isLoadingMore={
                loadingKeywords.has(keyword.id) && results.has(keyword.id)
              }
              hasMore={hasMore.get(keyword.id) ?? false}
              onSelectImage={onSelectImage}
              isShortlisted={isShortlisted}
              onToggleShortlist={onToggleShortlist}
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
          <div className="space-y-3">
            <p className="text-xs font-medium text-tier-2">
              Tier 2 - Related Matches
            </p>
            {renderKeywordSummary(tier2Keywords)}
          </div>
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
          <div className="space-y-3">
            <p className="text-xs font-medium text-tier-2">
              Tier 2 - Related Matches
            </p>
            {renderKeywordSummary(tier2Keywords)}
          </div>
          {tier2Keywords.map((keyword) => (
            <ImageKeywordSection
              key={keyword.id}
              keyword={keyword}
              images={filterImages(results.get(keyword.id))}
              isLoading={
                loadingKeywords.has(keyword.id) && !results.has(keyword.id)
              }
              isLoadingMore={
                loadingKeywords.has(keyword.id) && results.has(keyword.id)
              }
              hasMore={hasMore.get(keyword.id) ?? false}
              onSelectImage={onSelectImage}
              isShortlisted={isShortlisted}
              onToggleShortlist={onToggleShortlist}
              onLoadMore={() => onLoadMore(keyword)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
