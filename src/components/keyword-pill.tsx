import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { KeywordTier } from "@/types"

interface KeywordPillProps {
  text: string
  tier: KeywordTier
  onRemove: () => void
}

export function KeywordPill({ text, tier, onRemove }: KeywordPillProps) {
  return (
    <Badge
      variant="outline"
      className={`
        inline-flex items-center gap-1.5 border-2 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider
        ${
          tier === 1
            ? "border-tier-1/40 bg-tier-1-bg text-tier-1"
            : "border-tier-2/40 bg-tier-2-bg text-tier-2"
        }
      `}
    >
      {text}
      <button
        onClick={onRemove}
        className="ml-1 rounded-sm opacity-60 hover:opacity-100 transition-opacity"
        aria-label={`Remove ${text}`}
      >
        <X className="h-3 w-3" />
      </button>
    </Badge>
  )
}
