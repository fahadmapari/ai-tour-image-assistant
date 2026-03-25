import { useMemo, useState } from "react"
import { BookmarkCheck, Download, Loader2, Save, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { downloadImage, downloadAllImages } from "@/lib/download"
import type { NormalizedImage } from "@/types"

interface ShortlistSheetProps {
  images: NormalizedImage[]
  isOpen: boolean
  saveError: string | null
  onOpen: () => void
  onClose: () => void
  onRemove: (image: NormalizedImage) => void
  onClear: () => void
  onSelectImage: (image: NormalizedImage) => void
  onSave: (name: string) => boolean
}

export function ShortlistSheet({
  images,
  isOpen,
  saveError,
  onOpen,
  onClose,
  onRemove,
  onClear,
  onSelectImage,
  onSave,
}: ShortlistSheetProps) {
  const [groupName, setGroupName] = useState("")
  const [downloadingAll, setDownloadingAll] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState("")
  const [downloadingIds, setDownloadingIds] = useState<Set<string>>(new Set())

  const imageLabel = useMemo(() => {
    if (images.length === 1) return "1 image"
    return `${images.length} images`
  }, [images.length])

  const handleSave = () => {
    const didSave = onSave(groupName)
    if (didSave) setGroupName("")
  }

  const handleDownloadOne = async (image: NormalizedImage) => {
    setDownloadingIds((prev) => new Set(prev).add(image.id))
    try {
      await downloadImage(image)
    } finally {
      setDownloadingIds((prev) => {
        const next = new Set(prev)
        next.delete(image.id)
        return next
      })
    }
  }

  const handleDownloadAll = async () => {
    setDownloadingAll(true)
    setDownloadProgress(`0 / ${images.length}`)
    try {
      await downloadAllImages(images, (completed, total) => {
        setDownloadProgress(`${completed} / ${total}`)
      })
    } finally {
      setDownloadingAll(false)
      setDownloadProgress("")
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={onOpen}
        className="fixed right-4 bottom-4 z-40 flex items-center gap-2 rounded-full border border-primary/25 bg-background px-4 py-3 shadow-lg transition-all hover:border-primary/50 hover:shadow-xl"
      >
        <BookmarkCheck className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium">Shortlist</span>
        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
          {images.length}
        </span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50" onClick={onClose}>
          <div className="absolute inset-0 bg-black/45 backdrop-blur-sm" />
          <aside
            className="absolute top-0 right-0 flex h-full w-full max-w-md flex-col border-l border-border bg-background shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-border px-5 py-4">
              <div>
                <h2 className="text-lg font-semibold">Shortlisted Images</h2>
                <p className="text-sm text-muted-foreground">{imageLabel}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="border-b border-border px-5 py-4">
              <div className="flex gap-2">
                <Input
                  value={groupName}
                  onChange={(event) => setGroupName(event.target.value)}
                  placeholder="Give this collection a name"
                />
                <Button
                  onClick={handleSave}
                  disabled={images.length === 0 || !groupName.trim()}
                >
                  <Save className="h-4 w-4" />
                  Save
                </Button>
              </div>
              {saveError && (
                <p className="mt-2 text-xs text-destructive">{saveError}</p>
              )}
            </div>

            <div className="flex min-h-0 flex-col">
              {images.length > 0 ? (
                <>
                  <div className="flex items-center justify-between px-5 py-3">
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      Ready to save
                    </p>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleDownloadAll}
                        disabled={downloadingAll}
                      >
                        {downloadingAll ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Download className="h-3.5 w-3.5" />
                        )}
                        {downloadingAll ? downloadProgress : "Download All"}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={onClear}>
                        <Trash2 className="h-3.5 w-3.5" />
                        Clear
                      </Button>
                    </div>
                  </div>
                  <div className="grid max-h-[calc(100vh-13.5rem)] grid-cols-2 gap-3 overflow-y-auto px-5 pb-5">
                    {images.map((image) => (
                      <div
                        key={`${image.source}-${image.id}`}
                        className="overflow-hidden rounded-xl border border-border bg-card"
                      >
                        <button
                          type="button"
                          onClick={() => onSelectImage(image)}
                          className="block w-full text-left"
                        >
                          <img
                            src={image.thumbnailUrl}
                            alt={image.description || "Shortlisted image"}
                            className="aspect-4/3 w-full object-cover"
                          />
                        </button>
                        <div className="space-y-2 p-3">
                          <p className="line-clamp-2 text-xs text-muted-foreground">
                            {image.description || image.photographer}
                          </p>
                          <div className="flex items-center justify-between gap-2">
                            <span className="truncate text-xs font-medium">
                              {image.photographer}
                            </span>
                            <div className="flex gap-1">
                              <Button
                                variant="outline"
                                size="icon-sm"
                                onClick={() => handleDownloadOne(image)}
                                disabled={downloadingIds.has(image.id)}
                                aria-label="Download image"
                              >
                                {downloadingIds.has(image.id) ? (
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                  <Download className="h-3.5 w-3.5" />
                                )}
                              </Button>
                              <Button
                                variant="outline"
                                size="icon-sm"
                                onClick={() => onRemove(image)}
                                aria-label="Remove from shortlist"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
                  <BookmarkCheck className="mb-3 h-10 w-10 text-primary/70" />
                  <p className="text-sm font-medium">No shortlisted images yet</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Add images from the grid or modal, then save them as a named collection.
                  </p>
                </div>
              )}
            </div>
          </aside>
        </div>
      )}
    </>
  )
}
