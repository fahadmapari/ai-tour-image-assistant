import type { NormalizedImage } from "@/types"

interface ImageCardProps {
  image: NormalizedImage
}

export function ImageCard({ image }: ImageCardProps) {
  return (
    <a
      href={image.sourceUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="hover-glow group block overflow-hidden rounded-lg border border-border transition-all"
    >
      <div className="relative aspect-4/3 overflow-hidden">
        <img
          src={image.thumbnailUrl}
          alt={image.description || "Image"}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
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
    </a>
  )
}
