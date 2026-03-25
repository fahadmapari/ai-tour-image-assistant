import { useState } from "react"
import { AppHeader } from "@/components/app-header"
import { TourInput } from "@/components/tour-input"
import { KeywordPanel } from "@/components/keyword-panel"
import { ImageResults } from "@/components/image-results"
import { ImageDetailModal } from "@/components/image-detail-modal"
import { CollapsedBar } from "@/components/collapsed-bar"
import { useKeywordExtraction } from "@/hooks/use-keyword-extraction"
import { useImageSearch } from "@/hooks/use-image-search"
import type { KeywordTier, NormalizedImage } from "@/types"

function App() {
  const extraction = useKeywordExtraction()
  const imageSearch = useImageSearch()
  const [inputExpanded, setInputExpanded] = useState(true)
  const [tourExpanded, setTourExpanded] = useState(true)
  const [selectedImage, setSelectedImage] = useState<NormalizedImage | null>(null)

  const hasResults = imageSearch.status !== "idle"
  const hasKeywords = extraction.status === "success"

  const handleExtract = async (text: string) => {
    imageSearch.reset()
    setInputExpanded(true)
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
    imageSearch.search(extraction.keywords)
    setInputExpanded(false)
  }

  const handleNewSearch = () => {
    extraction.reset()
    imageSearch.reset()
    setInputExpanded(true)
    setTourExpanded(true)
  }

  const totalImages = Array.from(imageSearch.results.values()).reduce(
    (sum, imgs) => sum + imgs.length,
    0
  )

  return (
    <div className="min-h-screen">
      <AppHeader hasResults={hasResults} onNewSearch={handleNewSearch} />

      {/* Collapsed summary bar */}
      {hasResults && !inputExpanded && (
        <CollapsedBar
          keywords={extraction.keywords}
          totalImages={totalImages}
          isLoading={imageSearch.status === "loading"}
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
            collapsed={hasKeywords && !tourExpanded}
            onExpand={() => setTourExpanded(true)}
          />

          {hasKeywords && (
            <div className="mt-6">
              <KeywordPanel
                keywords={extraction.keywords}
                onRemove={extraction.removeKeyword}
                onAdd={handleAddKeyword}
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
        <div className="px-4 pb-16 sm:px-6">
          <ImageResults
            keywords={extraction.keywords}
            results={imageSearch.results}
            isLoading={imageSearch.status === "loading"}
            onSelectImage={setSelectedImage}
          />
        </div>
      )}
      <ImageDetailModal
        image={selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </div>
  )
}

export default App
