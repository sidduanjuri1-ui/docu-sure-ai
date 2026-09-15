import { NextResponse } from "next/server"
import { extractTextFromPDF } from "@/lib/pdf-ocr"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file")

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "No PDF file provided" },
        { status: 400 }
      )
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are supported" },
        { status: 400 }
      )
    }

    console.log("PDF received:", file.name, file.size)

    const text = await extractTextFromPDF(file)

    console.log("PDF text extracted:", text.length, "characters")

    return NextResponse.json({
      success: true,
      text,
    })
  } catch (error) {
    console.error("PDF OCR error:", error)

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}