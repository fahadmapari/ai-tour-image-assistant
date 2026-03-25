import { useState, useCallback } from "react"
import { searchPixabay } from "@/lib/api/pixabay"
import { searchUnsplash } from "@/lib/api/unsplash"
import type { Keyword, NormalizedImage } from "@/types"

type SearchStatus = "idle" | "loading" | "done"

export function useImageSearch() {
  const [results, setResults] = useState<Map<string, NormalizedImage[]>>(
    new Map()
  )
  const [status, setStatus] = useState<SearchStatus>("idle")

  const search = useCallback(async (keywords: Keyword[]) => {
    setStatus("loading")
    setResults(new Map())

    const allResults = await Promise.allSettled(
      keywords.map(async (keyword) => {
        const [pixabayResult, unsplashResult] = await Promise.allSettled([
          searchPixabay(keyword.text),
          searchUnsplash(keyword.text),
        ])

        const images: NormalizedImage[] = []

        if (pixabayResult.status === "fulfilled") {
          images.push(...pixabayResult.value.images)
        }
        if (unsplashResult.status === "fulfilled") {
          images.push(...unsplashResult.value.images)
        }

        return { keywordId: keyword.id, images }
      })
    )

    const newResults = new Map<string, NormalizedImage[]>()
    for (const result of allResults) {
      if (result.status === "fulfilled") {
        newResults.set(result.value.keywordId, result.value.images)
      }
    }

    setResults(newResults)
    setStatus("done")
  }, [])

  const reset = useCallback(() => {
    setResults(new Map())
    setStatus("idle")
  }, [])

  return { results, status, search, reset }
}
