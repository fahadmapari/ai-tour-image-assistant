import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles, FileText, Pencil, Plus, X } from "lucide-react";
import type { Keyword } from "@/types";

interface TourInputProps {
  onExtract: (text: string) => void;
  onManualKeywords: (keywords: Keyword[]) => void;
  isLoading: boolean;
  error: string | null;
  retryCountdown?: number | null;
  collapsed?: boolean;
  onExpand?: () => void;
}

export function TourInput({
  onExtract,
  onManualKeywords,
  isLoading,
  error,
  retryCountdown,
  collapsed,
  onExpand,
}: TourInputProps) {
  const [text, setText] = useState("");
  const [mode, setMode] = useState<"auto" | "manual">("auto");
  const [manualInput, setManualInput] = useState("");
  const [manualKeywords, setManualKeywords] = useState<string[]>([]);

  const handleSubmit = () => {
    if (text.trim()) {
      onExtract(text.trim());
    }
  };

  const addManualKeyword = () => {
    const trimmed = manualInput.trim();
    if (trimmed && !manualKeywords.includes(trimmed)) {
      setManualKeywords((prev) => [...prev, trimmed]);
    }
    setManualInput("");
  };

  const handleManualInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addManualKeyword();
    }
  };

  const removeManualKeyword = (kw: string) => {
    setManualKeywords((prev) => prev.filter((k) => k !== kw));
  };

  const handleManualSubmit = () => {
    const all = [...manualKeywords];
    // also capture whatever is still typed in the input
    if (manualInput.trim() && !all.includes(manualInput.trim())) {
      all.push(manualInput.trim());
    }
    if (all.length === 0) return;
    onManualKeywords(
      all.map((kw) => ({ id: crypto.randomUUID(), text: kw, tier: 1 as const })),
    );
    setManualKeywords([]);
    setManualInput("");
  };

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
    );
  }

  return (
    <div className="space-y-4">
      {/* Mode toggle */}
      <div className="flex rounded-lg border border-border bg-muted/40 p-1">
        <button
          onClick={() => setMode("auto")}
          className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            mode === "auto"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Sparkles className="mr-1.5 inline h-3.5 w-3.5" />
          AI Extract
        </button>
        <button
          onClick={() => setMode("manual")}
          className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            mode === "manual"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Pencil className="mr-1.5 inline h-3.5 w-3.5" />
          Manual Entry
        </button>
      </div>

      {mode === "auto" ? (
        <>
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
              className="min-h-36 rounded-xl border-border bg-background/90 placeholder:text-muted-foreground focus:border-ring"
            />
          </div>

          {error && (
            <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-sm text-destructive">
              {error.startsWith("rate_limited")
                ? retryCountdown != null && retryCountdown > 0
                  ? `AI is experiencing high demand. Retry in ${retryCountdown}s.`
                  : "AI is experiencing high demand. You can retry now."
                : error}
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
        </>
      ) : (
        <>
          <div>
            <label className="mb-2 block text-sm font-medium text-muted-foreground">
              Keywords
            </label>
            <div className="flex gap-2">
              <Input
                placeholder="Type a keyword and press Enter..."
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                onKeyDown={handleManualInputKeyDown}
                className="rounded-xl border-border bg-background/90 placeholder:text-muted-foreground focus:border-ring"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={addManualKeyword}
                disabled={!manualInput.trim()}
                className="shrink-0 rounded-xl"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <p className="mt-1.5 text-xs text-muted-foreground">
              Press Enter or comma to add each keyword
            </p>
          </div>

          {manualKeywords.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {manualKeywords.map((kw) => (
                <span
                  key={kw}
                  className="flex items-center gap-1.5 rounded-full border border-border bg-muted/60 px-3 py-1 text-sm"
                >
                  {kw}
                  <button
                    onClick={() => removeManualKeyword(kw)}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          <Button
            onClick={handleManualSubmit}
            disabled={manualKeywords.length === 0 && !manualInput.trim()}
            className="btn-gradient w-full rounded-xl border-0 text-sm font-medium text-white"
            size="lg"
          >
            <Plus className="mr-2 h-4 w-4" />
            Use These Keywords
          </Button>
        </>
      )}
    </div>
  );
}
