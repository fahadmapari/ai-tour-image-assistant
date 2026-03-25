import { useState, useCallback, useRef } from "react"
import { searchImages } from "@/lib/api/worker"
import { getEnabledSources } from "@/lib/image-source"
import { CONFIG } from "@/lib/config"
import type { ImageSearchResult, ImageSourceFilter, Keyword, NormalizedImage } from "@/types"

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
  const sourceFilterRef = useRef<ImageSourceFilter>("both")

  const searchBySource = useCallback(
    async (query: string, page = 1): Promise<ImageSearchResult[]> => {
      const enabledSources = getEnabledSources(sourceFilterRef.current)
      const { results } = await searchImages(
        query,
        page,
        enabledSources,
        CONFIG.imagesPerPage
      )
      return results
    },
    []
  )

  const fetchKeywords = useCallback(
    async (keywords: Keyword[]) => {
      setLoadingKeywords((prev) => {
        const next = new Set(prev)
        keywords.forEach((k) => next.add(k.id))
        return next
      })

      const allResults = await Promise.allSettled(
        keywords.map(async (keyword) => {
          const sourceResults = await searchBySource(keyword.text)

          const images = sourceResults.flatMap((result) => result.images)
          const total = sourceResults.reduce((sum, result) => sum + result.total, 0)

          return {
            keywordId: keyword.id,
            images,
            hasMore: total > images.length,
          }
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
    },
    [searchBySource]
  )

  const search = useCallback(
    async (keywords: Keyword[], sourceFilter: ImageSourceFilter) => {
      setStatus("loading")
      setResults(new Map())
      setHasMore(new Map())
      setTier2Searched(false)
      pagesRef.current = new Map()
      sourceFilterRef.current = sourceFilter

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

    const sourceResults = await searchBySource(keyword.text, nextPage)
    const newImages: NormalizedImage[] = sourceResults.flatMap(
      (result) => result.images
    )

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
  }, [searchBySource])

  const reset = useCallback(() => {
    setResults(new Map())
    setHasMore(new Map())
    setLoadingKeywords(new Set())
    setStatus("idle")
    setTier2Searched(false)
    pagesRef.current = new Map()
    sourceFilterRef.current = "both"
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
