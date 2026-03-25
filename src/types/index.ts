export type KeywordTier = 1 | 2

export interface Keyword {
  id: string
  text: string
  tier: KeywordTier
}

export interface WorkerResponse {
  keywords: {
    tier1: Keyword[]
    tier2: Keyword[]
  }
}

export interface WorkerErrorResponse {
  error: string
}

export interface PixabayHit {
  id: number
  pageURL: string
  tags: string
  webformatURL: string
  webformatWidth: number
  webformatHeight: number
  largeImageURL: string
  user: string
  userImageURL: string
}

export interface PixabayResponse {
  total: number
  totalHits: number
  hits: PixabayHit[]
}

export interface UnsplashPhoto {
  id: string
  width: number
  height: number
  description: string | null
  alt_description: string | null
  urls: {
    raw: string
    full: string
    regular: string
    small: string
    thumb: string
  }
  links: {
    html: string
    download: string
  }
  user: {
    username: string
    name: string
    links: {
      html: string
    }
  }
}

export interface UnsplashSearchResponse {
  total: number
  total_pages: number
  results: UnsplashPhoto[]
}

export interface NormalizedImage {
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

export interface SavedImageGroup {
  id: string
  name: string
  createdAt: string
  images: NormalizedImage[]
}

export interface ImageSearchResult {
  images: NormalizedImage[]
  total: number
}

export type AsyncStatus = "idle" | "loading" | "success" | "error"
