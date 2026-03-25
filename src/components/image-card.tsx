import { useState } from "react"
import { Bookmark, BookmarkCheck, Download, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { downloadImage } from "@/lib/download"
import type { NormalizedImage } from "@/types"

interface ImageCardProps {
  image: NormalizedImage
  isShortlisted: boolean
  onSelect: (image: NormalizedImage) => void
  onToggleShortlist: (image: NormalizedImage) => void
}

export function ImageCard({
  image,
  isShortlisted,
  onSelect,
  onToggleShortlist,
}: ImageCardProps) {
  const [downloading, setDownloading] = useState(false)

  const handleDownload = async (event: React.MouseEvent) => {
    event.stopPropagation()
    setDownloading(true)
    try {
      await downloadImage(image)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={() => onSelect(image)}
      className="hover-glow group block w-full overflow-hidden rounded-lg border border-border text-left transition-all"
    >
      <div className="relative aspect-4/3 overflow-hidden">
        <img
          src={image.thumbnailUrl}
          alt={image.description || "Image"}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-1.5 left-1.5 z-10 flex gap-1">
          <Button
            variant={isShortlisted ? "default" : "secondary"}
            size="icon-sm"
            onClick={(event) => {
              event.stopPropagation()
              onToggleShortlist(image)
            }}
            aria-label={
              isShortlisted ? "Remove from shortlist" : "Add to shortlist"
            }
          >
            {isShortlisted ? (
              <BookmarkCheck className="h-3.5 w-3.5" />
            ) : (
              <Bookmark className="h-3.5 w-3.5" />
            )}
          </Button>
          <Button
            variant="secondary"
            size="icon-sm"
            onClick={handleDownload}
            disabled={downloading}
            aria-label="Download image"
          >
            {downloading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Download className="h-3.5 w-3.5" />
            )}
          </Button>
        </div>
        {/* Source badge */}
        <span
          className={`absolute top-1.5 right-1.5 rounded-md px-1.5 py-0.5 text-[10px] font-medium ${
            image.source === "pixabay"
              ? "bg-emerald-500/80 text-white"
              : "bg-white/80 text-black backdrop-blur-sm"
          }`}
        >
          {image.source}
        </span>
        {/* Photographer overlay on hover */}
        <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 to-transparent px-2.5 pb-2 pt-6 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <p className="truncate text-xs text-white/90">
            {image.photographer}
          </p>
        </div>
      </div>
    </button>
  )
}
