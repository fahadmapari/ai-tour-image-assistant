import { useState, useCallback, useRef, useEffect } from "react"
import { extractKeywords } from "@/lib/api/worker"
import type { Keyword, AsyncStatus } from "@/types"

export function useKeywordExtraction() {
  const [keywords, setKeywords] = useState<Keyword[]>([])
  const [status, setStatus] = useState<AsyncStatus>("idle")
  const [error, setError] = useState<string | null>(null)
  const [retryCountdown, setRetryCountdown] = useState<number | null>(null)
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const clearCountdown = useCallback(() => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current)
      countdownRef.current = null
    }
    setRetryCountdown(null)
  }, [])

  useEffect(() => () => clearCountdown(), [clearCountdown])

  const startCountdown = useCallback((seconds: number) => {
    clearCountdown()
    setRetryCountdown(seconds)
    countdownRef.current = setInterval(() => {
      setRetryCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(countdownRef.current!)
          countdownRef.current = null
          return null
        }
        return prev - 1
      })
    }, 1000)
  }, [clearCountdown])

  const extract = useCallback(async (text: string) => {
    setStatus("loading")
    setError(null)
    clearCountdown()

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

      if (message.startsWith("rate_limited:")) {
        const seconds = parseInt(message.split(":")[1], 10)
        startCountdown(seconds)
        setError(`rate_limited:${seconds}`)
      } else {
        setError(message)
      }

      setStatus("error")
      return []
    }
  }, [clearCountdown, startCountdown])

  const addKeyword = useCallback((keyword: Keyword) => {
    setKeywords((prev) => [...prev, keyword])
  }, [])

  const removeKeyword = useCallback((id: string) => {
    setKeywords((prev) => prev.filter((k) => k.id !== id))
  }, [])

  const setManualKeywords = useCallback((kws: Keyword[]) => {
    setKeywords(kws)
    setStatus("success")
    setError(null)
    clearCountdown()
  }, [clearCountdown])

  const reset = useCallback(() => {
    setKeywords([])
    setStatus("idle")
    setError(null)
    clearCountdown()
  }, [clearCountdown])

  return { keywords, status, error, retryCountdown, extract, addKeyword, removeKeyword, setManualKeywords, reset }
}
