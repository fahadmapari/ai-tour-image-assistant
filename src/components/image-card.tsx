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
      className="group block border-2 border-border bg-card transition-colors hover:border-primary"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={image.thumbnailUrl}
          alt={image.description || "Image"}
          loading="lazy"
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
        <span
          className={`absolute top-2 right-2 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
            image.source === "pixabay"
              ? "bg-emerald-500/90 text-white"
              : "bg-white/90 text-black"
          }`}
        >
          {image.source}
        </span>
      </div>
      <div className="border-t-2 border-border px-3 py-2">
        <p className="truncate text-xs text-muted-foreground">
          {image.photographer}
        </p>
      </div>
    </a>
  )
}
