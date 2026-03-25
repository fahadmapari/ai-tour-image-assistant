import { CONFIG } from "./config"
import type { NormalizedImage } from "@/types"

function getFilename(image: NormalizedImage): string {
  const ext = "jpg"
  const slug = (image.description || image.photographer || image.id)
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 50)
  return `${slug}-${image.source}.${ext}`
}

async function triggerUnsplashDownloadTracking(image: NormalizedImage) {
  if (image.source !== "unsplash" || !image.unsplashDownloadLocation) return
  try {
    await fetch(image.unsplashDownloadLocation, {
      headers: { Authorization: `Client-ID ${CONFIG.unsplashAccessKey}` },
    })
  } catch {
    // Fire-and-forget tracking — don't block the download
  }
}

export async function downloadImage(image: NormalizedImage): Promise<void> {
  triggerUnsplashDownloadTracking(image)

  const response = await fetch(image.downloadUrl)
  const blob = await response.blob()
  const url = URL.createObjectURL(blob)

  const a = document.createElement("a")
  a.href = url
  a.download = getFilename(image)
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export async function downloadAllImages(
  images: NormalizedImage[],
  onProgress?: (completed: number, total: number) => void
): Promise<void> {
  const total = images.length
  let completed = 0

  for (const image of images) {
    await downloadImage(image)
    completed++
    onProgress?.(completed, total)
    // Small delay between downloads to avoid overwhelming the browser
    if (completed < total) {
      await new Promise((r) => setTimeout(r, 300))
    }
  }
}
