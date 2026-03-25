import { useState } from "react"
import { BookmarkCheck, CalendarDays, Download, ExternalLink, FolderOpen, Loader2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { downloadImage, downloadAllImages } from "@/lib/download"
import type { NormalizedImage, SavedImageGroup } from "@/types"

interface SavedImageGroupsProps {
  groups: SavedImageGroup[]
  onDeleteGroup: (groupId: string) => void
  onOpenImage: (groupId: string, imageIndex: number) => void
}

export function SavedImageGroups({
  groups,
  onDeleteGroup,
  onOpenImage,
}: SavedImageGroupsProps) {
  const [downloadingGroupId, setDownloadingGroupId] = useState<string | null>(null)
  const [groupProgress, setGroupProgress] = useState("")
  const [downloadingIds, setDownloadingIds] = useState<Set<string>>(new Set())

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

  const handleDownloadAll = async (group: SavedImageGroup) => {
    setDownloadingGroupId(group.id)
    setGroupProgress(`0 / ${group.images.length}`)
    try {
      await downloadAllImages(group.images, (completed, total) => {
        setGroupProgress(`${completed} / ${total}`)
      })
    } finally {
      setDownloadingGroupId(null)
      setGroupProgress("")
    }
  }
  if (groups.length === 0) {
    return (
      <section className="mx-auto max-w-5xl px-6 py-14">
        <div className="rounded-2xl border border-dashed border-border bg-card/60 px-8 py-14 text-center">
          <FolderOpen className="mx-auto mb-4 h-12 w-12 text-primary/70" />
          <h2 className="text-2xl font-semibold">No saved image groups yet</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Save a shortlist from the search view and it will appear here.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-8">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-primary">
            Saved Images
          </p>
          <h2 className="mt-2 text-3xl font-semibold">Named Collections</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          {groups.length} saved {groups.length === 1 ? "group" : "groups"}
        </p>
      </div>

      <div className="space-y-8">
        {groups.map((group) => (
          <article
            key={group.id}
            className="rounded-2xl border border-border bg-card/70 p-5 shadow-sm"
          >
            <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <BookmarkCheck className="h-4 w-4 text-primary" />
                  <h3 className="text-xl font-semibold">{group.name}</h3>
                </div>
                <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {new Date(group.createdAt).toLocaleString()}
                  </span>
                  <span>{group.images.length} images</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleDownloadAll(group)}
                  disabled={downloadingGroupId === group.id}
                >
                  {downloadingGroupId === group.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  {downloadingGroupId === group.id ? groupProgress : "Download All"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onDeleteGroup(group.id)}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
              {group.images.map((image, index) => (
                <div
                  key={`${group.id}-${image.source}-${image.id}`}
                  className="overflow-hidden rounded-xl border border-border bg-background"
                >
                  <button
                    type="button"
                    onClick={() => onOpenImage(group.id, index)}
                    className="block w-full text-left"
                  >
                    <img
                      src={image.thumbnailUrl}
                      alt={image.description || "Saved image"}
                      className="aspect-4/3 w-full object-cover"
                    />
                  </button>
                  <div className="space-y-2 p-3">
                    <p className="line-clamp-2 text-xs text-muted-foreground">
                      {image.description || image.photographer}
                    </p>
                    <div className="flex items-center justify-between gap-2">
                      <a
                        href={image.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-medium text-primary"
                      >
                        Open source
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
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
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
