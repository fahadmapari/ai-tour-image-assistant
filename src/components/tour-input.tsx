import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Loader2, Sparkles, FileText, Pencil } from "lucide-react"

interface TourInputProps {
  onExtract: (text: string) => void
  isLoading: boolean
  error: string | null
  collapsed?: boolean
  onExpand?: () => void
}

export function TourInput({
  onExtract,
  isLoading,
  error,
  collapsed,
  onExpand,
}: TourInputProps) {
  const [text, setText] = useState("")

  const handleSubmit = () => {
    if (text.trim()) {
      onExtract(text.trim())
    }
  }

  if (collapsed && text) {
    return (
      <button
        onClick={onExpand}
        className="flex w-full items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-left transition-colors hover:border-foreground/20"
      >
        <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
        <span className="flex-1 truncate text-sm text-muted-foreground">
          {text.length > 120 ? text.slice(0, 120) + "..." : text}
        </span>
        <Pencil className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
      </button>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <label
          htmlFor="tour-input"
          className="mb-2 block text-sm font-medium text-muted-foreground"
        >
          Tour Information
        </label>
        <Textarea
          id="tour-input"
          placeholder="Paste the tour title, description, and details here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="min-h-36 rounded-xl border-border bg-card text-foreground placeholder:text-muted-foreground/60 focus:border-ring"
        />
      </div>

      {error && (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-sm text-destructive">
          {error}
        </p>
      )}

      <Button
        onClick={handleSubmit}
        disabled={isLoading || !text.trim()}
        className="btn-gradient w-full rounded-xl border-0 text-sm font-medium text-white"
        size="lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Extracting Keywords...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-4 w-4" />
            Extract Keywords
          </>
        )}
      </Button>
    </div>
  )
}
