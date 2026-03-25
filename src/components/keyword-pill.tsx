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
        inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium
        ${
          tier === 1
            ? "border-tier-1/30 bg-tier-1-bg text-tier-1"
            : "border-tier-2/30 bg-tier-2-bg text-tier-2"
        }
      `}
    >
      {text}
      <button
        onClick={onRemove}
        className="ml-0.5 rounded-sm opacity-50 transition-opacity hover:opacity-100"
        aria-label={`Remove ${text}`}
      >
        <X className="h-3 w-3" />
      </button>
    </Badge>
  )
}
