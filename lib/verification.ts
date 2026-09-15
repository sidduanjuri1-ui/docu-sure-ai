// Mock/demo verification engine for DocuSure AI.
//
// This is intentionally structured so that a real OCR + AI backend can be
// dropped in later: replace `analyzeDocument` with a call to your API route
// (e.g. POST /api/verify with the file), keeping the same return shape so the
// UI does not need to change.

export type DocumentType =
  | "internship_certificate"
  | "offer_letter"
  | "experience_certificate"

export const DOCUMENT_TYPES: { value: DocumentType; label: string }[] = [
 { value: "internship_certificate", label: "Internship Certificate" },
{ value: "offer_letter", label: "Offer Letter" },
{ value: "experience_certificate", label: "Experience Certificate" },
]

export type VerificationStatus = "Likely Valid" | "Needs Review" | "Suspicious"

export interface VerificationCheck {
  label: string
  passed: boolean
  detail: string
}

export interface VerificationResult {
  riskScore: number // 0 (low risk) - 100 (high risk)
  status: VerificationStatus
  summary: string
  checks: VerificationCheck[]
}

function statusForScore(score: number): VerificationStatus {
  if (score <= 33) return "Likely Valid"
  if (score <= 66) return "Needs Review"
  return "Suspicious"
}

function summaryForStatus(status: VerificationStatus): string {
  switch (status) {
    case "Likely Valid":
      return "Our AI analysis did not surface notable inconsistencies. This is an AI-assisted assessment, not a guarantee of authenticity."
    case "Needs Review":
      return "Some indicators warrant a closer manual review before relying on this document. This is an AI-assisted assessment, not a guarantee of authenticity."
    case "Suspicious":
      return "Multiple indicators suggest this document may contain inconsistencies. Please verify with the issuing organization. This is an AI-assisted assessment."
  }
}

// Deterministic pseudo-random value derived from the file so repeat runs on
// the same document feel stable (real backend would use actual OCR signals).
function seedFromFile(file: { name: string; size: number }): number {
  let hash = 0
  const key = `${file.name}:${file.size}`
  for (let i = 0; i < key.length; i++) {
    hash = (hash << 5) - hash + key.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

/**
 * Simulates document analysis. Swap this for a real OCR/AI call later.
 */
export async function analyzeDocument(
  file: { name: string; size: number; type: string },
  _docType: DocumentType,
): Promise<VerificationResult> {
  // Simulate network + processing latency.
  await new Promise((resolve) => setTimeout(resolve, 2600))

  const seed = seedFromFile(file)
  const riskScore = seed % 101

  const checkPool: VerificationCheck[] = [
    {
      label: "Metadata consistency",
      passed: seed % 2 === 0,
      detail: "Creation date and document properties align with expected patterns.",
    },
    {
      label: "Font & layout uniformity",
      passed: seed % 3 !== 0,
      detail: "Typography and spacing appear consistent throughout the document.",
    },
    {
      label: "Digital tampering signals",
      passed: seed % 5 !== 0,
      detail: "No obvious signs of image splicing or region editing were detected.",
    },
    {
      label: "Issuer & signature cues",
      passed: seed % 4 !== 0,
      detail: "Letterhead, signature block, and contact details look plausible.",
    },
    {
      label: "Text extraction quality",
      passed: seed % 7 !== 0,
      detail: "Key fields could be read clearly for analysis.",
    },
  ]

  const status = statusForScore(riskScore)

  return {
    riskScore,
    status,
    summary: summaryForStatus(status),
    checks: checkPool,
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B"
  const units = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${units[i]}`
}

export const ACCEPTED_EXTENSIONS = ["pdf", "jpg", "jpeg", "png"]
export const ACCEPTED_MIME = "application/pdf,image/jpeg,image/png,.pdf,.jpg,.jpeg,.png"

export function isAcceptedFile(file: File): boolean {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? ""
  return ACCEPTED_EXTENSIONS.includes(ext)
}

export function docTypeLabel(value: DocumentType): string {
  return DOCUMENT_TYPES.find((d) => d.value === value)?.label ?? value
}

interface StatusStyle {
  text: string
  bg: string
  ring: string
  bar: string
}

export const STATUS_STYLE: Record<VerificationStatus, StatusStyle> = {
  "Likely Valid": {
    text: "text-emerald-300",
    bg: "bg-emerald-400/10",
    ring: "ring-emerald-400/30",
    bar: "bg-emerald-400",
  },
  "Needs Review": {
    text: "text-amber-300",
    bg: "bg-amber-400/10",
    ring: "ring-amber-400/30",
    bar: "bg-amber-400",
  },
  Suspicious: {
    text: "text-red-300",
    bg: "bg-red-400/10",
    ring: "ring-red-400/30",
    bar: "bg-red-400",
  },
}
