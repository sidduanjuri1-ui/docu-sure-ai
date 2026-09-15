"use client"

import { useState } from "react"

export default function PDFTestPage() {
  const [file, setFile] = useState<File | null>(null)
  const [text, setText] = useState("")
  const [loading, setLoading] = useState(false)

  const handlePDF = async () => {
    if (!file) return

    setLoading(true)
    setText("")

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/pdf-ocr", {
        method: "POST",
        body: formData,
      })

      const responseText = await response.text()
console.log("PDF API RESPONSE:", responseText)

const data = responseText ? JSON.parse(responseText) : {}

      if (!response.ok) {
        throw new Error(
  data.error || `PDF processing failed (HTTP ${response.status})`
)
      }

      setText(data.text || "No text found in PDF.")
    } catch (error) {
      console.error(error)
      setText(
        error instanceof Error
          ? error.message
          : "PDF processing failed.",
      )
    }

    setLoading(false)
  }

  return (
    <main className="min-h-screen p-8">
      <h1 className="mb-6 text-2xl font-bold">
        PDF Test
      </h1>

      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <button
        onClick={handlePDF}
        disabled={!file || loading}
        className="mt-4 rounded-lg bg-white px-4 py-2 text-black disabled:opacity-50"
      >
        {loading ? "Extracting..." : "Extract PDF Text"}
      </button>

      {text && (
        <div className="mt-6 rounded-lg border p-4">
          <h2 className="mb-2 font-semibold">
            Extracted Text
          </h2>

          <pre className="whitespace-pre-wrap text-sm">
            {text}
          </pre>
        </div>
      )}
    </main>
  )
}