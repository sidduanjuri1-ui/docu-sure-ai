"use client"

import { useRef, useState } from "react"
import { FileCheck2, Trash2, UploadCloud } from "lucide-react"
import { ACCEPTED_MIME, formatFileSize, isAcceptedFile } from "@/lib/verification"

export function UploadBox({
  file,
  onFile,
  onRemove,
  disabled,
}: {
  file: File | null
  onFile: (file: File) => void
  onRemove: () => void
  disabled?: boolean
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFiles = (files: FileList | null) => {
    setError(null)
    const f = files?.[0]
    if (!f) return
    if (!isAcceptedFile(f)) {
      setError("Unsupported file. Please use PDF, JPG, JPEG, or PNG.")
      return
    }
    onFile(f)
  }

  if (file) {
    return (
      <div className="flex items-center gap-4 rounded-xl border border-border bg-background/40 p-4">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/30">
          <FileCheck2 className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{file.name}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {(file.name.split(".").pop()?.toUpperCase() ?? "FILE")} · {formatFileSize(file.size)}
          </p>
        </div>
        <button
          type="button"
          onClick={onRemove}
          disabled={disabled}
          aria-label="Remove file"
          className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs text-muted-foreground transition-colors hover:border-destructive/40 hover:text-destructive disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Trash2 className="size-3.5" />
          Remove
        </button>
      </div>
    )
  }

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            inputRef.current?.click()
          }
        }}
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          handleFiles(e.dataTransfer.files)
        }}
        className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border border-dashed px-6 py-10 text-center transition-colors ${
          dragging ? "border-primary bg-primary/10" : "border-border bg-background/30 hover:border-primary/50"
        }`}
      >
        <span className="flex size-12 items-center justify-center rounded-full bg-primary/15 text-primary ring-1 ring-primary/30">
          <UploadCloud className="size-6" />
        </span>
        <div>
          <p className="text-sm font-medium">Upload Document</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Drag &amp; drop or <span className="text-primary">browse</span> to select a file
          </p>
        </div>
        <p className="text-[0.7rem] uppercase tracking-wide text-muted-foreground">PDF, JPG, JPEG, PNG</p>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_MIME}
          className="sr-only"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>
      {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
    </div>
  )
}
