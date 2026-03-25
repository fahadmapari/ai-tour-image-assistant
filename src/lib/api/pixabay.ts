import { CONFIG } from "../config"
import type { PixabayResponse, NormalizedImage, ImageSearchResult } from "@/types"

export async function searchPixabay(
  query: string,
  page = 1
): Promise<ImageSearchResult> {
  const params = new URLSearchParams({
    key: CONFIG.pixabayApiKey,
    q: query,
    image_type: "photo",
    per_page: String(CONFIG.imagesPerPage),
    page: String(page),
    safesearch: "true",
  })

  const response = await fetch(`${CONFIG.pixabayBaseUrl}?${params}`)

  if (!response.ok) {
    throw new Error(`Pixabay API error: ${response.status}`)
  }

  const data = (await response.json()) as PixabayResponse

  const images: NormalizedImage[] = data.hits.map((hit) => ({
    id: `px-${hit.id}`,
    thumbnailUrl: hit.webformatURL,
    fullUrl: hit.largeImageURL,
    sourceUrl: hit.pageURL,
    source: "pixabay",
    photographer: hit.user,
    photographerUrl: `https://pixabay.com/users/${hit.user}`,
    width: hit.webformatWidth,
    height: hit.webformatHeight,
    tags: hit.tags.split(", "),
    description: hit.tags,
  }))

  return { images, total: data.totalHits }
}
