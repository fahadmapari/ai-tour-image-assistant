import { useEffect, useMemo, useState } from "react"
import { AppHeader } from "@/components/app-header"
import { TourInput } from "@/components/tour-input"
import { KeywordPanel } from "@/components/keyword-panel"
import { ImageResults } from "@/components/image-results"
import { ImageDetailModal } from "@/components/image-detail-modal"
import { CollapsedBar } from "@/components/collapsed-bar"
import { ShortlistSheet } from "@/components/shortlist-sheet"
import { SavedImageGroups } from "@/components/saved-image-groups"
import { useKeywordExtraction } from "@/hooks/use-keyword-extraction"
import { useImageSearch } from "@/hooks/use-image-search"
import type {
  ImageSourceFilter,
  KeywordTier,
  NormalizedImage,
  SavedImageGroup,
} from "@/types"

const SAVED_IMAGES_STORAGE_KEY = "image-assistant-saved-groups"

function getImageKey(image: NormalizedImage) {
  return `${image.source}-${image.id}`
}

function getInitialSavedGroups(): SavedImageGroup[] {
  if (typeof window === "undefined") return []

  try {
    const rawGroups = window.localStorage.getItem(SAVED_IMAGES_STORAGE_KEY)
    if (!rawGroups) return []

    const parsedGroups = JSON.parse(rawGroups) as SavedImageGroup[]
    return Array.isArray(parsedGroups) ? parsedGroups : []
  } catch {
    return []
  }
}

function App() {
  const extraction = useKeywordExtraction()
  const imageSearch = useImageSearch()
  const [inputExpanded, setInputExpanded] = useState(true)
  const [tourExpanded, setTourExpanded] = useState(true)
  const [selectedImage, setSelectedImage] = useState<NormalizedImage | null>(null)
  const [shortlistedImages, setShortlistedImages] = useState<NormalizedImage[]>([])
  const [savedGroups, setSavedGroups] = useState<SavedImageGroup[]>(getInitialSavedGroups)
  const [isShortlistOpen, setIsShortlistOpen] = useState(false)
  const [activeView, setActiveView] = useState<"search" | "saved">("search")
  const [saveError, setSaveError] = useState<string | null>(null)
  const [selectedSourceFilter, setSelectedSourceFilter] =
    useState<ImageSourceFilter>("both")
  const [appliedSourceFilter, setAppliedSourceFilter] =
    useState<ImageSourceFilter>("both")

  useEffect(() => {
    if (typeof window === "undefined") return
    window.localStorage.setItem(
      SAVED_IMAGES_STORAGE_KEY,
      JSON.stringify(savedGroups)
    )
  }, [savedGroups])

  const hasResults = imageSearch.status !== "idle"
  const hasKeywords = extraction.status === "success"
  const shortlistedKeys = useMemo(
    () => new Set(shortlistedImages.map(getImageKey)),
    [shortlistedImages]
  )

  const handleExtract = async (text: string) => {
    imageSearch.reset()
    setInputExpanded(true)
    setActiveView("search")
    await extraction.extract(text)
    setTourExpanded(false)
  }

  const handleAddKeyword = (text: string, tier: KeywordTier) => {
    extraction.addKeyword({
      id: crypto.randomUUID(),
      text,
      tier,
    })
  }

  const handleSearch = () => {
    setAppliedSourceFilter(selectedSourceFilter)
    imageSearch.search(extraction.keywords, selectedSourceFilter)
    setInputExpanded(false)
    setActiveView("search")
  }

  const handleSearchTier2 = () => {
    imageSearch.searchTier2(extraction.keywords)
  }

  const handleNewSearch = () => {
    extraction.reset()
    imageSearch.reset()
    setInputExpanded(true)
    setTourExpanded(true)
    setSelectedImage(null)
    setActiveView("search")
    setSelectedSourceFilter("both")
    setAppliedSourceFilter("both")
  }

  const toggleShortlist = (image: NormalizedImage) => {
    setSaveError(null)
    setShortlistedImages((currentImages) => {
      const imageKey = getImageKey(image)
      const exists = currentImages.some((item) => getImageKey(item) === imageKey)

      if (exists) {
        return currentImages.filter((item) => getImageKey(item) !== imageKey)
      }

      return [image, ...currentImages]
    })
  }

  const removeShortlistedImage = (image: NormalizedImage) => {
    setShortlistedImages((currentImages) =>
      currentImages.filter((item) => getImageKey(item) !== getImageKey(image))
    )
  }

  const clearShortlist = () => {
    setShortlistedImages([])
    setSaveError(null)
  }

  const saveShortlistedImages = (name: string) => {
    const trimmedName = name.trim()

    if (!trimmedName) {
      setSaveError("Please enter a name for this image group.")
      return false
    }

    if (shortlistedImages.length === 0) {
      setSaveError("Shortlist a few images before saving.")
      return false
    }

    const nextGroup: SavedImageGroup = {
      id: crypto.randomUUID(),
      name: trimmedName,
      createdAt: new Date().toISOString(),
      images: shortlistedImages,
    }

    setSavedGroups((currentGroups) => [nextGroup, ...currentGroups])
    setShortlistedImages([])
    setSaveError(null)
    setIsShortlistOpen(false)
    setActiveView("saved")
    return true
  }

  const openSavedImage = (groupId: string, imageIndex: number) => {
    const group = savedGroups.find((item) => item.id === groupId)
    const image = group?.images[imageIndex] ?? null
    if (image) setSelectedImage(image)
  }

  const deleteSavedGroup = (groupId: string) => {
    setSavedGroups((currentGroups) =>
      currentGroups.filter((group) => group.id !== groupId)
    )
  }

  const totalImages = Array.from(imageSearch.results.values()).reduce(
    (sum, imgs) => sum + imgs.length,
    0
  )

  const isSelectedImageShortlisted = selectedImage
    ? shortlistedKeys.has(getImageKey(selectedImage))
    : false

  return (
    <div className="min-h-screen">
      <AppHeader
        hasResults={hasResults}
        activeView={activeView}
        savedGroupCount={savedGroups.length}
        shortlistCount={shortlistedImages.length}
        onNewSearch={handleNewSearch}
        onShowSearch={() => setActiveView("search")}
        onShowSaved={() => setActiveView("saved")}
      />

      {activeView === "search" && (
        <>
          {/* Collapsed summary bar */}
          {hasResults && !inputExpanded && (
            <CollapsedBar
              keywords={extraction.keywords}
              totalImages={totalImages}
              isLoading={
                imageSearch.status === "loading" ||
                imageSearch.loadingKeywords.size > 0
              }
              sourceFilter={appliedSourceFilter}
              onExpand={() => setInputExpanded(true)}
            />
          )}

          {/* Input section */}
          {inputExpanded && (
            <div
              className={
                hasResults
                  ? "mx-auto max-w-3xl px-6 py-6"
                  : "mx-auto max-w-2xl px-6"
              }
            >
              {/* Hero text for landing state */}
              {!hasResults && !hasKeywords && (
                <div className="pt-20 pb-8 text-center">
                  <h2 className="text-3xl font-semibold tracking-tight">
                    Find the perfect images
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Paste tour descriptions to extract keywords and search
                    royalty-free images.
                  </p>
                </div>
              )}

              {/* Compact spacing when keywords already shown */}
              {!hasResults && hasKeywords && <div className="pt-8" />}

              <TourInput
                onExtract={handleExtract}
                isLoading={extraction.status === "loading"}
                error={extraction.error}
                retryCountdown={extraction.retryCountdown}
                collapsed={hasKeywords && !tourExpanded}
                onExpand={() => setTourExpanded(true)}
              />

              {hasKeywords && (
                <div className="mt-6">
                  <KeywordPanel
                    keywords={extraction.keywords}
                    sourceFilter={selectedSourceFilter}
                    onRemove={extraction.removeKeyword}
                    onAdd={handleAddKeyword}
                    onSourceFilterChange={setSelectedSourceFilter}
                    onSearch={handleSearch}
                    isSearching={imageSearch.status === "loading"}
                  />
                </div>
              )}

              {/* Collapse link when results are visible */}
              {hasResults && (
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => setInputExpanded(false)}
                    className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Collapse panel
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Results - full width */}
          {hasResults && (
            <div className="px-4 pb-24 sm:px-6">
              <ImageResults
                keywords={extraction.keywords}
                results={imageSearch.results}
                hasMore={imageSearch.hasMore}
                loadingKeywords={imageSearch.loadingKeywords}
                sourceFilter={appliedSourceFilter}
                tier2Searched={imageSearch.tier2Searched}
                onSelectImage={setSelectedImage}
                isShortlisted={(image) => shortlistedKeys.has(getImageKey(image))}
                onToggleShortlist={toggleShortlist}
                onSearchTier2={handleSearchTier2}
                onLoadMore={imageSearch.loadMore}
              />
            </div>
          )}
        </>
      )}

      {activeView === "saved" && (
        <SavedImageGroups
          groups={savedGroups}
          onDeleteGroup={deleteSavedGroup}
          onOpenImage={openSavedImage}
        />
      )}

      <ShortlistSheet
        images={shortlistedImages}
        isOpen={isShortlistOpen}
        saveError={saveError}
        onOpen={() => setIsShortlistOpen(true)}
        onClose={() => setIsShortlistOpen(false)}
        onRemove={removeShortlistedImage}
        onClear={clearShortlist}
        onSelectImage={setSelectedImage}
        onSave={saveShortlistedImages}
      />

      <ImageDetailModal
        image={selectedImage}
        isShortlisted={isSelectedImageShortlisted}
        onClose={() => setSelectedImage(null)}
        onToggleShortlist={toggleShortlist}
      />
    </div>
  )
}

export default App
