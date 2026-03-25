import { GoogleGenerativeAI } from "@google/generative-ai"
import { SYSTEM_PROMPT } from "./prompt"

interface Env {
  GEMINI_API_KEY: string
  ALLOWED_ORIGIN: string
  PIXABAY_API_KEY: string
  UNSPLASH_ACCESS_KEY: string
}

interface NormalizedImage {
  id: string
  thumbnailUrl: string
  fullUrl: string
  sourceUrl: string
  source: "pixabay" | "unsplash"
  photographer: string
  photographerUrl: string
  width: number
  height: number
  tags: string[]
  description: string | null
}

interface ImageSearchResult {
  images: NormalizedImage[]
  total: number
}

function corsHeaders(origin: string, allowedOrigin: string): HeadersInit {
  return {
    "Access-Control-Allow-Origin": allowedOrigin === "*" ? "*" : origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  }
}

async function searchPixabay(
  query: string,
  page: number,
  perPage: number,
  apiKey: string
): Promise<ImageSearchResult> {
  const params = new URLSearchParams({
    key: apiKey,
    q: query,
    image_type: "photo",
    per_page: String(perPage),
    page: String(page),
    safesearch: "true",
  })

  const response = await fetch(`https://pixabay.com/api/?${params}`)
  if (!response.ok) throw new Error(`Pixabay API error: ${response.status}`)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = (await response.json()) as any

  const images: NormalizedImage[] = data.hits.map((hit: any) => ({
    id: `px-${hit.id}`,
    thumbnailUrl: hit.webformatURL,
    fullUrl: hit.largeImageURL,
    sourceUrl: hit.pageURL,
    source: "pixabay" as const,
    photographer: hit.user,
    photographerUrl: `https://pixabay.com/users/${hit.user}`,
    width: hit.webformatWidth,
    height: hit.webformatHeight,
    tags: hit.tags.split(", "),
    description: hit.tags,
  }))

  return { images, total: data.totalHits }
}

async function searchUnsplash(
  query: string,
  page: number,
  perPage: number,
  accessKey: string
): Promise<ImageSearchResult> {
  const params = new URLSearchParams({
    query,
    per_page: String(perPage),
    page: String(page),
  })

  const response = await fetch(
    `https://api.unsplash.com/search/photos?${params}`,
    { headers: { Authorization: `Client-ID ${accessKey}` } }
  )
  if (!response.ok) throw new Error(`Unsplash API error: ${response.status}`)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = (await response.json()) as any

  const images: NormalizedImage[] = data.results.map((photo: any) => ({
    id: `us-${photo.id}`,
    thumbnailUrl: photo.urls.small,
    fullUrl: photo.urls.regular,
    sourceUrl: photo.links.html,
    source: "unsplash" as const,
    photographer: photo.user.name,
    photographerUrl: photo.user.links.html,
    width: photo.width,
    height: photo.height,
    tags: photo.alt_description?.split(" ") ?? [],
    description: photo.alt_description,
  }))

  return { images, total: data.total }
}

async function handleExtractKeywords(
  request: Request,
  env: Env,
  headers: HeadersInit
): Promise<Response> {
  const body = await request.json<{ text?: string }>()

  if (!body.text || body.text.trim().length === 0) {
    return Response.json({ error: "Text is required" }, { status: 400, headers })
  }

  const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY)
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: body.text }] }],
    systemInstruction: { role: "model", parts: [{ text: SYSTEM_PROMPT }] },
  })

  const responseText = result.response.text()
  const cleaned = responseText.replace(/```json\n?|```\n?/g, "").trim()
  const parsed = JSON.parse(cleaned)

  if (!parsed.keywords?.tier1 || !parsed.keywords?.tier2) {
    throw new Error("Invalid response structure from AI")
  }

  return Response.json(parsed, { status: 200, headers })
}

async function handleSearchImages(
  request: Request,
  env: Env,
  headers: HeadersInit
): Promise<Response> {
  const body = await request.json<{
    query?: string
    page?: number
    sources?: string[]
    perPage?: number
  }>()

  if (!body.query || body.query.trim().length === 0) {
    return Response.json({ error: "Query is required" }, { status: 400, headers })
  }

  const query = body.query.trim()
  const page = body.page ?? 1
  const sources = body.sources ?? ["pixabay", "unsplash"]
  const perPage = body.perPage ?? 6

  const searches: Promise<ImageSearchResult>[] = []

  if (sources.includes("pixabay")) {
    searches.push(searchPixabay(query, page, perPage, env.PIXABAY_API_KEY))
  }
  if (sources.includes("unsplash")) {
    searches.push(searchUnsplash(query, page, perPage, env.UNSPLASH_ACCESS_KEY))
  }

  const settled = await Promise.allSettled(searches)
  const results = settled.flatMap((r) =>
    r.status === "fulfilled" ? [r.value] : []
  )

  return Response.json({ results }, { status: 200, headers })
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get("Origin") || ""
    const headers = corsHeaders(origin, env.ALLOWED_ORIGIN)

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers })
    }

    if (request.method !== "POST") {
      return Response.json(
        { error: "Method not allowed" },
        { status: 405, headers }
      )
    }

    const url = new URL(request.url)

    try {
      if (url.pathname === "/api/extract-keywords") {
        return await handleExtractKeywords(request, env, headers)
      }

      if (url.pathname === "/api/search-images") {
        return await handleSearchImages(request, env, headers)
      }

      return Response.json({ error: "Not found" }, { status: 404, headers })
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Internal server error"
      return Response.json({ error: message }, { status: 500, headers })
    }
  },
}
