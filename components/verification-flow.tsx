"use client"

import { useState } from "react"
import { Loader2, ScanSearch } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DocTypeSelect } from "@/components/doc-type-select"
import { UploadBox } from "@/components/upload-box"
import {
  ProgressTracker,
  type Phase,
} from "@/components/progress-tracker"
import { ResultCard } from "@/components/result-card"
import { useHistory } from "@/components/history-provider"
import { useAuth } from "@/components/auth-provider"
import {
  analyzeDocument,
  type DocumentType,
  type VerificationResult,
} from "@/lib/verification"
import { supabase } from "@/lib/supabase"

export function VerificationFlow() {
  const { addRecord } = useHistory()
  const { user } = useAuth()

  const [docType, setDocType] = useState<DocumentType | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [phase, setPhase] = useState<Phase>("select")
  const [result, setResult] = useState<VerificationResult | null>(null)

  const busy = phase === "analysing"

  const canStart =
    Boolean(docType && file && user) &&
    phase !== "analysing"

  const handleFile = (f: File) => {
    setFile(f)
    setResult(null)
    setPhase("ready")
  }

  const handleRemove = () => {
    setFile(null)
    setResult(null)
    setPhase("select")
  }

  const handleStart = async () => {
    if (!docType || !file || !user) return

    setResult(null)
    setPhase("analysing")

    try {
      const safeFileName = file.name.replace(
        /[^a-zA-Z0-9._-]/g,
        "_",
      )

      const filePath = `${user.id}/${crypto.randomUUID()}-${safeFileName}`

      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("documents")
        .upload(filePath, file, {
          contentType: file.type,
          upsert: false,
        })

      if (uploadError) {
        throw uploadError
      }

      // Current analysis function
      const res = await analyzeDocument(
        {
          name: file.name,
          size: file.size,
          type: file.type,
        },
        docType,
      )

      const assessment =
        res.status === "Likely Valid"
          ? "likely_valid"
          : res.status === "Needs Review"
            ? "needs_review"
            : "suspicious"

      // Save document information to Supabase
      // Convert document type to the exact format used by Supabase
const dbDocType =
  String(docType)
    .trim()
    .toLowerCase()
    .replace(/-/g, "_")

console.log("DOC TYPE BEING SENT:", dbDocType)

// Save document information to Supabase
const { data, error: dbError } = await supabase
  .from("documents")
  .insert({
    user_id: user.id,
    file_name: file.name,
    document_type: dbDocType,
    file_path: filePath,
    status: "completed",
    risk_score: res.riskScore,
    assessment: assessment,
  })
  .select()
  .single()

      if (dbError) {
        throw dbError
      }

      // Show result
      setResult(res)
      setPhase("done")

      // Add to history
      addRecord({
        fileName: file.name,
        docType: docType,
        result: res,
      })

      console.log("Document saved:", data)
    } catch (error) {
      console.error(
        "Verification failed:",
        error instanceof Error
          ? error.message
          : JSON.stringify(error),
      )

      setPhase("ready")

      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong while verifying the document.",
      )
    }
  }

  return (
    <section className="mx-auto w-full max-w-2xl space-y-6">
      <div className="glass rounded-2xl p-6">
        <p className="mb-1 text-sm font-medium">
          What type of document are you verifying?
        </p>

        <p className="mb-4 text-xs text-muted-foreground">
          Select a document type before uploading.
        </p>

        <DocTypeSelect
          value={docType}
          onChange={setDocType}
          disabled={busy}
        />
      </div>

      <div className="glass rounded-2xl p-6">
        <UploadBox
          file={file}
          onFile={handleFile}
          onRemove={handleRemove}
          disabled={busy}
        />

        {!docType && file && (
          <p className="mt-3 text-xs text-amber-300">
            Please select a document type above to continue.
          </p>
        )}

        {!user && (
          <p className="mt-3 text-xs text-amber-300">
            Please log in before starting verification.
          </p>
        )}

        <Button
          onClick={handleStart}
          disabled={!canStart}
          className="mt-4 h-11 w-full text-sm"
        >
          {busy ? (
            <>
              <Loader2 className="size-4 animate-spin-slow" />
              Analysing…
            </>
          ) : (
            <>
              <ScanSearch className="size-4" />
              Start Verification
            </>
          )}
        </Button>
      </div>

      <div className="glass rounded-2xl p-6">
        <p className="mb-5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Verification status
        </p>

        <ProgressTracker phase={phase} />
      </div>

      {result && phase === "done" && (
        <ResultCard result={result} />
      )}
    </section>
  )
}