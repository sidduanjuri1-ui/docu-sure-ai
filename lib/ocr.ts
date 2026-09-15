import Tesseract from "tesseract.js"

export async function extractTextFromImage(file: File) {
  const result = await Tesseract.recognize(file, "eng", {
    logger: (info) => {
      console.log("OCR:", info)
    },
  })

  return result.data.text
}