import { BookmarkCheck, ImageIcon, RotateCcw } from "lucide-react"

interface AppHeaderProps {
  hasResults: boolean
  activeView: "search" | "saved"
  savedGroupCount: number
  shortlistCount: number
  onNewSearch: () => void
  onShowSearch: () => void
  onShowSaved: () => void
}

export function AppHeader({
  hasResults,
  activeView,
  savedGroupCount,
  shortlistCount,
  onNewSearch,
  onShowSearch,
  onShowSaved,
}: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
            <ImageIcon className="h-3.5 w-3.5 text-primary-foreground" />
          </div>
          <span className="text-sm font-semibold">Image Assistant</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onShowSearch}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              activeView === "search"
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Search
          </button>
          <button
            onClick={onShowSaved}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              activeView === "saved"
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <BookmarkCheck className="h-3.5 w-3.5" />
            Saved Images
            <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px]">
              {savedGroupCount}
            </span>
          </button>
          {shortlistCount > 0 && (
            <span className="rounded-full border border-primary/20 bg-primary/10 px-2 py-1 text-[10px] font-semibold text-primary">
              {shortlistCount} shortlisted
            </span>
          )}
          {hasResults && activeView === "search" && (
            <button
              onClick={onNewSearch}
              className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground"
            >
              <RotateCcw className="h-3 w-3" />
              New Search
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
