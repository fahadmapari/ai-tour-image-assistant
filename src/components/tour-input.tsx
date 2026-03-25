import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Loader2, Sparkles } from "lucide-react"

interface TourInputProps {
  onExtract: (text: string) => void
  isLoading: boolean
  error: string | null
}

export function TourInput({ onExtract, isLoading, error }: TourInputProps) {
  const [text, setText] = useState("")

  const handleSubmit = () => {
    if (text.trim()) {
      onExtract(text.trim())
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label
          htmlFor="tour-input"
          className="mb-2 block text-sm font-semibold uppercase tracking-widest text-muted-foreground"
        >
          Tour Information
        </label>
        <Textarea
          id="tour-input"
          placeholder="Paste the tour title, description, and details here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="min-h-[200px] border-2 border-border bg-card text-foreground placeholder:text-muted-foreground focus:border-primary"
        />
      </div>

      {error && (
        <p className="border-2 border-destructive bg-destructive/10 px-4 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <Button
        onClick={handleSubmit}
        disabled={isLoading || !text.trim()}
        className="w-full border-2 border-primary font-semibold uppercase tracking-wider"
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
