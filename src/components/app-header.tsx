import { ImageIcon } from "lucide-react"

export function AppHeader() {
  return (
    <header className="border-b-2 border-border px-6 py-8">
      <div className="flex items-center gap-3">
        <ImageIcon className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold tracking-tighter">
          Image Assistant
        </h1>
      </div>
      <p className="mt-2 text-muted-foreground">
        Paste tour info, extract keywords, find royalty-free images.
      </p>
    </header>
  )
}
