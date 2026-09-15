import pdfTextExtract from "pdf-text-extract"

export async function extractTextFromPDF(file: File) {
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  return new Promise<string>((resolve, reject) => {
    pdfTextExtract(buffer, (error, pages) => {
      if (error) {
        reject(error)
        return
      }

      resolve(pages.join("\n").trim())
    })
  })
}
