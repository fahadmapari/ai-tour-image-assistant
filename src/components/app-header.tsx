import { ImageIcon, RotateCcw } from "lucide-react"

interface AppHeaderProps {
  hasResults: boolean
  onNewSearch: () => void
}

export function AppHeader({ hasResults, onNewSearch }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
            <ImageIcon className="h-3.5 w-3.5 text-primary-foreground" />
          </div>
          <span className="text-sm font-semibold">Image Assistant</span>
        </div>
        {hasResults && (
          <button
            onClick={onNewSearch}
            className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground"
          >
            <RotateCcw className="h-3 w-3" />
            New Search
          </button>
        )}
      </div>
    </header>
  )
}
