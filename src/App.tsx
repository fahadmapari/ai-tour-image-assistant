import { AppHeader } from "@/components/app-header"
import { TourInput } from "@/components/tour-input"
import { KeywordPanel } from "@/components/keyword-panel"
import { ImageResults } from "@/components/image-results"
import { useKeywordExtraction } from "@/hooks/use-keyword-extraction"
import { useImageSearch } from "@/hooks/use-image-search"
import type { KeywordTier } from "@/types"

function App() {
  const extraction = useKeywordExtraction()
  const imageSearch = useImageSearch()

  const handleExtract = async (text: string) => {
    imageSearch.reset()
    await extraction.extract(text)
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
  }

  return (
    <div className="mx-auto min-h-screen max-w-6xl border-x-2 border-border">
      <AppHeader />

      <main className="space-y-6 p-6">
        <TourInput
          onExtract={handleExtract}
          isLoading={extraction.status === "loading"}
          error={extraction.error}
        />

        {extraction.status === "success" && (
          <KeywordPanel
            keywords={extraction.keywords}
            onRemove={extraction.removeKeyword}
            onAdd={handleAddKeyword}
            onSearch={handleSearch}
            isSearching={imageSearch.status === "loading"}
          />
        )}

        {imageSearch.status !== "idle" && (
          <ImageResults
            keywords={extraction.keywords}
            results={imageSearch.results}
            isLoading={imageSearch.status === "loading"}
          />
        )}
      </main>
    </div>
  )
}

export default App
