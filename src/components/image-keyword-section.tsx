import { useState } from "react"
import { ImageCard } from "./image-card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronRight, Loader2 } from "lucide-react"
import type { Keyword, NormalizedImage } from "@/types"

interface ImageKeywordSectionProps {
  keyword: Keyword
  images: NormalizedImage[] | undefined
  isLoading: boolean
  isLoadingMore: boolean
  hasMore: boolean
  onSelectImage: (image: NormalizedImage) => void
  isShortlisted: (image: NormalizedImage) => boolean
  onToggleShortlist: (image: NormalizedImage) => void
  onLoadMore: () => void
}

export function ImageKeywordSection({
  keyword,
  images,
  isLoading,
  isLoadingMore,
  hasMore,
  onSelectImage,
  isShortlisted,
  onToggleShortlist,
  onLoadMore,
}: ImageKeywordSectionProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="flex items-center gap-2 text-left"
      >
        {isCollapsed ? (
          <ChevronRight className={`h-4 w-4 ${keyword.tier === 1 ? "text-tier-1" : "text-tier-2"}`} />
        ) : (
          <ChevronDown className={`h-4 w-4 ${keyword.tier === 1 ? "text-tier-1" : "text-tier-2"}`} />
        )}
        <h3
          className={`text-sm font-medium ${
            keyword.tier === 1 ? "text-tier-1" : "text-tier-2"
          }`}
        >
          {keyword.text}
        </h3>
        {images && (
          <span className="text-xs text-muted-foreground">
            {images.length} images
          </span>
        )}
      </button>

      {!isCollapsed && (
        <>
          {isLoading ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="aspect-4/3 w-full rounded-lg" />
              ))}
            </div>
          ) : images && images.length > 0 ? (
            <>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
                {images.map((image) => (
                  <ImageCard
                    key={image.id}
                    image={image}
                    isShortlisted={isShortlisted(image)}
                    onSelect={onSelectImage}
                    onToggleShortlist={onToggleShortlist}
                  />
                ))}
              </div>
              {hasMore && (
                <>
                  {isLoadingMore && (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="aspect-4/3 w-full rounded-lg" />
                      ))}
                    </div>
                  )}
                  <div className="flex justify-center pt-2">
                    <Button
                      variant="outline"
                      onClick={onLoadMore}
                      disabled={isLoadingMore}
                      className="cursor-pointer gap-2 rounded-full border-primary/20 px-6 text-primary shadow-sm transition-all hover:border-primary/40 hover:bg-primary/5 hover:shadow-md"
                    >
                      {isLoadingMore ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Loading…
                        </>
                      ) : (
                        "Load More"
                      )}
                    </Button>
                  </div>
                </>
              )}
            </>
          ) : (
            <p className="rounded-lg border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground">
              No images found for this keyword.
            </p>
          )}
        </>
      )}
    </div>
  )
}
