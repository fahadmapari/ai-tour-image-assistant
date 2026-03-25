import type { ImageSource, ImageSourceFilter } from "@/types"

export const IMAGE_SOURCE_FILTER_OPTIONS: ImageSourceFilter[] = [
  "both",
  "pixabay",
  "unsplash",
]

export function getImageSourceFilterLabel(filter: ImageSourceFilter) {
  switch (filter) {
    case "pixabay":
      return "Pixabay only"
    case "unsplash":
      return "Unsplash only"
    default:
      return "Pixabay + Unsplash"
  }
}

export function getImageSourceLabel(source: ImageSource) {
  return source === "pixabay" ? "Pixabay" : "Unsplash"
}

export function getEnabledSources(filter: ImageSourceFilter): ImageSource[] {
  if (filter === "both") {
    return ["pixabay", "unsplash"]
  }

  return [filter]
}
