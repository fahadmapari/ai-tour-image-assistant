import { ImageCard } from "./image-card"
import { Skeleton } from "@/components/ui/skeleton"
import type { Keyword, NormalizedImage } from "@/types"

interface ImageKeywordSectionProps {
  keyword: Keyword
  images: NormalizedImage[] | undefined
  isLoading: boolean
}

export function ImageKeywordSection({
  keyword,
  images,
  isLoading,
}: ImageKeywordSectionProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-baseline gap-3">
        <h3
          className={`text-sm font-bold uppercase tracking-widest ${
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
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-0">
              <Skeleton className="aspect-[4/3] w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ))}
        </div>
      ) : images && images.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {images.map((image) => (
            <ImageCard key={image.id} image={image} />
          ))}
        </div>
      ) : (
        <p className="border-2 border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground">
          No images found for this keyword.
        </p>
      )}
    </div>
  )
}
