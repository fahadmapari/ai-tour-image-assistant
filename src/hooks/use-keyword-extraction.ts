import { useState, useCallback } from "react"
import { extractKeywords } from "@/lib/api/worker"
import type { Keyword, AsyncStatus } from "@/types"

export function useKeywordExtraction() {
  const [keywords, setKeywords] = useState<Keyword[]>([])
  const [status, setStatus] = useState<AsyncStatus>("idle")
  const [error, setError] = useState<string | null>(null)

  const extract = useCallback(async (text: string) => {
    setStatus("loading")
    setError(null)

    try {
      const response = await extractKeywords(text)
      const allKeywords = [
        ...response.keywords.tier1,
        ...response.keywords.tier2,
      ]
      setKeywords(allKeywords)
      setStatus("success")
      return allKeywords
    } catch (err) {
      const message = err instanceof Error ? err.message : "Extraction failed"
      setError(message)
      setStatus("error")
      return []
    }
  }, [])

  const addKeyword = useCallback((keyword: Keyword) => {
    setKeywords((prev) => [...prev, keyword])
  }, [])

  const removeKeyword = useCallback((id: string) => {
    setKeywords((prev) => prev.filter((k) => k.id !== id))
  }, [])

  const reset = useCallback(() => {
    setKeywords([])
    setStatus("idle")
    setError(null)
  }, [])

  return { keywords, status, error, extract, addKeyword, removeKeyword, reset }
}
