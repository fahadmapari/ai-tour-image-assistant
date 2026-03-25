import { Pencil } from "lucide-react"
import type { Keyword } from "@/types"

interface CollapsedBarProps {
  keywords: Keyword[]
  totalImages: number
  isLoading: boolean
  onExpand: () => void
}

export function CollapsedBar({
  keywords,
  totalImages,
  isLoading,
  onExpand,
}: CollapsedBarProps) {
  const tier1Count = keywords.filter((k) => k.tier === 1).length
  const tier2Count = keywords.filter((k) => k.tier === 2).length

  return (
    <div className="border-b border-border bg-card/50">
      <div className="flex items-center gap-4 px-6 py-2.5">
        {/* Summary counts */}
        <div className="flex shrink-0 items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-tier-1" />
            {tier1Count} direct
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-tier-2" />
            {tier2Count} related
          </span>
          {!isLoading && totalImages > 0 && (
            <>
              <span className="text-border">·</span>
              <span>{totalImages} images</span>
            </>
          )}
        </div>

        {/* Keyword pills - horizontal scroll */}
        <div className="scrollbar-hide flex flex-1 items-center gap-1.5 overflow-x-auto">
          {keywords.map((k) => (
            <span
              key={k.id}
              className={`shrink-0 rounded-md px-2 py-0.5 text-[11px] font-medium ${
                k.tier === 1
                  ? "bg-tier-1-bg text-tier-1"
                  : "bg-tier-2-bg text-tier-2"
              }`}
            >
              {k.text}
            </span>
          ))}
        </div>

        {/* Edit button */}
        <button
          onClick={onExpand}
          className="flex shrink-0 items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground"
        >
          <Pencil className="h-3 w-3" />
          Edit
        </button>
      </div>
    </div>
  )
}
