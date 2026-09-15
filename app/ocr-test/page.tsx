"use client"

import { useState } from "react"
import { extractTextFromImage } from "@/lib/ocr"

export default function OCRTestPage() {
  const [file, setFile] = useState<File | null>(null)
  const [text, setText] = useState("")
  const [loading, setLoading] = useState(false)

  const handleOCR = async () => {
    if (!file) return

    setLoading(true)
    setText("")

    try {
      const extractedText = await extractTextFromImage(file)
      setText(extractedText)
    } catch (error) {
      console.error(error)
      setText("OCR failed. Check the browser console.")
    }

    setLoading(false)
  }

  return (
    <main className="min-h-screen p-8">
      <h1 className="mb-6 text-2xl font-bold">
        OCR Test
      </h1>

      <input
        type="file"
        accept="image/png,image/jpeg,image/jpg"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <button
        onClick={handleOCR}
        disabled={!file || loading}
        className="mt-4 rounded-lg bg-white px-4 py-2 text-black disabled:opacity-50"
      >
        {loading ? "Extracting..." : "Extract Text"}
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