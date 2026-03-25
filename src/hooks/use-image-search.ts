import { useState, useCallback, useRef } from "react"
import { searchPixabay } from "@/lib/api/pixabay"
import { searchUnsplash } from "@/lib/api/unsplash"
import type { Keyword, NormalizedImage } from "@/types"

type SearchStatus = "idle" | "loading" | "done"

export function useImageSearch() {
  const [results, setResults] = useState<Map<string, NormalizedImage[]>>(
    new Map()
  )
  const [hasMore, setHasMore] = useState<Map<string, boolean>>(new Map())
  const [loadingKeywords, setLoadingKeywords] = useState<Set<string>>(
    new Set()
  )
  const [status, setStatus] = useState<SearchStatus>("idle")
  const [tier2Searched, setTier2Searched] = useState(false)
  const pagesRef = useRef<Map<string, number>>(new Map())

  const fetchKeywords = useCallback(async (keywords: Keyword[]) => {
    setLoadingKeywords((prev) => {
      const next = new Set(prev)
      keywords.forEach((k) => next.add(k.id))
      return next
    })

    const allResults = await Promise.allSettled(
      keywords.map(async (keyword) => {
        const [pixabayResult, unsplashResult] = await Promise.allSettled([
          searchPixabay(keyword.text),
          searchUnsplash(keyword.text),
        ])

        const images: NormalizedImage[] = []
        let total = 0

        if (pixabayResult.status === "fulfilled") {
          images.push(...pixabayResult.value.images)
          total += pixabayResult.value.total
        }
        if (unsplashResult.status === "fulfilled") {
          images.push(...unsplashResult.value.images)
          total += unsplashResult.value.total
        }

        return { keywordId: keyword.id, images, hasMore: total > images.length }
      })
    )

    setResults((prev) => {
      const next = new Map(prev)
      for (const result of allResults) {
        if (result.status === "fulfilled") {
          next.set(result.value.keywordId, result.value.images)
        }
      }
      return next
    })

    setHasMore((prev) => {
      const next = new Map(prev)
      for (const result of allResults) {
        if (result.status === "fulfilled") {
          next.set(result.value.keywordId, result.value.hasMore)
        }
      }
      return next
    })

    for (const result of allResults) {
      if (result.status === "fulfilled") {
        pagesRef.current.set(result.value.keywordId, 1)
      }
    }

    setLoadingKeywords((prev) => {
      const next = new Set(prev)
      keywords.forEach((k) => next.delete(k.id))
      return next
    })
  }, [])

  const search = useCallback(
    async (keywords: Keyword[]) => {
      setStatus("loading")
      setResults(new Map())
      setHasMore(new Map())
      setTier2Searched(false)
      pagesRef.current = new Map()

      const tier1 = keywords.filter((k) => k.tier === 1)
      await fetchKeywords(tier1)
      setStatus("done")
    },
    [fetchKeywords]
  )

  const searchTier2 = useCallback(
    async (keywords: Keyword[]) => {
      setTier2Searched(true)
      const tier2 = keywords.filter((k) => k.tier === 2)
      await fetchKeywords(tier2)
    },
    [fetchKeywords]
  )

  const loadMore = useCallback(async (keyword: Keyword) => {
    const currentPage = pagesRef.current.get(keyword.id) ?? 1
    const nextPage = currentPage + 1

    setLoadingKeywords((prev) => new Set(prev).add(keyword.id))

    const [pixabayResult, unsplashResult] = await Promise.allSettled([
      searchPixabay(keyword.text, nextPage),
      searchUnsplash(keyword.text, nextPage),
    ])

    const newImages: NormalizedImage[] = []

    if (pixabayResult.status === "fulfilled") {
      newImages.push(...pixabayResult.value.images)
    }
    if (unsplashResult.status === "fulfilled") {
      newImages.push(...unsplashResult.value.images)
    }

    setResults((prev) => {
      const next = new Map(prev)
      const existing = next.get(keyword.id) ?? []
      next.set(keyword.id, [...existing, ...newImages])
      return next
    })

    pagesRef.current.set(keyword.id, nextPage)
    setHasMore((prev) => new Map(prev).set(keyword.id, newImages.length > 0))

    setLoadingKeywords((prev) => {
      const next = new Set(prev)
      next.delete(keyword.id)
      return next
    })
  }, [])

  const reset = useCallback(() => {
    setResults(new Map())
    setHasMore(new Map())
    setLoadingKeywords(new Set())
    setStatus("idle")
    setTier2Searched(false)
    pagesRef.current = new Map()
  }, [])

  return {
    results,
    status,
    hasMore,
    loadingKeywords,
    tier2Searched,
    search,
    searchTier2,
    loadMore,
    reset,
  }
}
