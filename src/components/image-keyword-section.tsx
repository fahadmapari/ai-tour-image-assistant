import { ImageCard } from "./image-card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import type { Keyword, NormalizedImage } from "@/types"

interface ImageKeywordSectionProps {
  keyword: Keyword
  images: NormalizedImage[] | undefined
  isLoading: boolean
  isLoadingMore: boolean
  hasMore: boolean
  onSelectImage: (image: NormalizedImage) => void
  onLoadMore: () => void
}

export function ImageKeywordSection({
  keyword,
  images,
  isLoading,
  isLoadingMore,
  hasMore,
  onSelectImage,
  onLoadMore,
}: ImageKeywordSectionProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-baseline gap-3">
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
      </div>

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
                onSelect={onSelectImage}
              />
            ))}
          </div>
          {hasMore && (
            <div className="flex justify-center pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onLoadMore}
                disabled={isLoadingMore}
              >
                {isLoadingMore ? "Loading…" : "Load More"}
              </Button>
            </div>
          )}
        </>
      ) : (
        <p className="rounded-lg border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground">
          No images found for this keyword.
        </p>
      )}
    </div>
  )
}
