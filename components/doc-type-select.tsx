"use client"

import { useEffect, useRef, useState } from "react"
import { Check, ChevronDown, FileText } from "lucide-react"
import { DOCUMENT_TYPES, type DocumentType } from "@/lib/verification"

export function DocTypeSelect({
  value,
  onChange,
  disabled,
}: {
  value: DocumentType | null
  onChange: (value: DocumentType) => void
  disabled?: boolean
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", onClick)
    return () => document.removeEventListener("mousedown", onClick)
  }, [open])

  const selected = DOCUMENT_TYPES.find((t) => t.value === value)

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 rounded-xl border border-border bg-background/40 px-4 py-3 text-left text-sm transition-colors hover:border-primary/50 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span className="flex items-center gap-2.5">
          <FileText className="size-4 text-primary" />
          <span className={selected ? "text-foreground" : "text-muted-foreground"}>
            {selected ? selected.label : "Select document type"}
          </span>
        </span>
        <ChevronDown className={`size-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <ul
          role="listbox"
          className="glass animate-fade-up absolute z-20 mt-2 w-full overflow-hidden rounded-xl p-1.5 shadow-2xl"
        >
          {DOCUMENT_TYPES.map((t) => {
            const active = t.value === value
            return (
              <li key={t.value} role="option" aria-selected={active}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(t.value)
                    setOpen(false)
                  }}
                  className="flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-left text-sm transition-colors hover:bg-white/10"
                >
                  {t.label}
                  {active && <Check className="size-4 text-primary" />}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
