import { useEffect, useCallback } from "react"
import {
  X,
  ExternalLink,
  Camera,
  Ruler,
  Tag,
  FileText,
  Bookmark,
  BookmarkCheck,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import type { NormalizedImage } from "@/types"

interface ImageDetailModalProps {
  image: NormalizedImage | null
  isShortlisted: boolean
  onClose: () => void
  onToggleShortlist: (image: NormalizedImage) => void
}

export function ImageDetailModal({
  image,
  isShortlisted,
  onClose,
  onToggleShortlist,
}: ImageDetailModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    },
    [onClose]
  )

  useEffect(() => {
    if (!image) return
    document.addEventListener("keydown", handleKeyDown)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = ""
    }
  }, [image, handleKeyDown])

  if (!image) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl border border-border bg-card shadow-2xl sm:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white/80 backdrop-blur-sm transition-colors hover:bg-black/70 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Image section */}
        <div className="flex min-h-0 flex-1 items-center justify-center bg-black/30 sm:max-w-[60%]">
          <img
            src={image.fullUrl}
            alt={image.description || "Image"}
            className="max-h-[40vh] w-full object-contain sm:max-h-[90vh]"
          />
        </div>

        {/* Info panel */}
        <div className="flex w-full flex-col overflow-y-auto border-t border-border p-5 sm:w-80 sm:min-w-72 sm:border-t-0 sm:border-l">
          {/* Source badge */}
          <span
            className={`mb-4 inline-flex w-fit rounded-md px-2 py-0.5 text-xs font-medium ${
              image.source === "pixabay"
                ? "bg-emerald-500/15 text-emerald-400"
                : "bg-neutral-500/15 text-neutral-300"
            }`}
          >
            {image.source}
          </span>

          {/* Description */}
          {image.description && (
            <div className="mb-5">
              <div className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <FileText className="h-3.5 w-3.5" />
                Description
              </div>
              <p className="text-sm leading-relaxed text-foreground">
                {image.description}
              </p>
            </div>
          )}

          {/* Photographer */}
          <div className="mb-5">
            <div className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Camera className="h-3.5 w-3.5" />
              Photographer
            </div>
            <a
              href={image.photographerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-foreground transition-colors hover:text-primary"
            >
              {image.photographer}
              <ExternalLink className="h-3 w-3 opacity-50" />
            </a>
          </div>

          {/* Dimensions */}
          <div className="mb-5">
            <div className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Ruler className="h-3.5 w-3.5" />
              Dimensions
            </div>
            <p className="text-sm text-foreground">
              {image.width} &times; {image.height}
            </p>
          </div>

          {/* Tags */}
          {image.tags.length > 0 && (
            <div className="mb-5">
              <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <Tag className="h-3.5 w-3.5" />
                Tags
              </div>
              <div className="flex flex-wrap gap-1.5">
                {image.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md bg-secondary px-2 py-0.5 text-xs text-secondary-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-auto space-y-3 pt-4">
            <Button
              variant={isShortlisted ? "secondary" : "outline"}
              className="w-full"
              onClick={() => onToggleShortlist(image)}
            >
              {isShortlisted ? (
                <BookmarkCheck className="h-4 w-4" />
              ) : (
                <Bookmark className="h-4 w-4" />
              )}
              {isShortlisted ? "Shortlisted" : "Shortlist Image"}
            </Button>
            <a
              href={image.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gradient flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white"
            >
              View on {image.source}
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
