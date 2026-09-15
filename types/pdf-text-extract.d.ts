declare module "pdf-text-extract" {
  type Callback = (error: Error | null, pages: string[]) => void

  function pdfTextExtract(
    buffer: Buffer,
    callback: Callback
  ): void

  export default pdfTextExtract
}