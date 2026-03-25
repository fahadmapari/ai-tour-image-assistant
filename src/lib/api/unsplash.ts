import { CONFIG } from "../config"
import type { UnsplashSearchResponse, NormalizedImage, ImageSearchResult } from "@/types"

export async function searchUnsplash(
  query: string,
  page = 1
): Promise<ImageSearchResult> {
  const params = new URLSearchParams({
    query,
    per_page: String(CONFIG.imagesPerPage),
    page: String(page),
  })

  const response = await fetch(
    `${CONFIG.unsplashBaseUrl}/search/photos?${params}`,
    {
      headers: {
        Authorization: `Client-ID ${CONFIG.unsplashAccessKey}`,
      },
    }
  )

  if (!response.ok) {
    throw new Error(`Unsplash API error: ${response.status}`)
  }

  const data = (await response.json()) as UnsplashSearchResponse

  const images: NormalizedImage[] = data.results.map((photo) => ({
    id: `us-${photo.id}`,
    thumbnailUrl: photo.urls.small,
    fullUrl: photo.urls.regular,
    downloadUrl: photo.urls.regular,
    sourceUrl: photo.links.html,
    source: "unsplash",
    photographer: photo.user.name,
    photographerUrl: photo.user.links.html,
    width: photo.width,
    height: photo.height,
    tags: photo.alt_description?.split(" ") ?? [],
    description: photo.alt_description,
    unsplashDownloadLocation: photo.links.download_location,
  }))

  return { images, total: data.total }
}
