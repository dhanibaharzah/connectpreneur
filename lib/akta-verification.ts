import { ensureDomPolyfills } from "@/lib/dom-polyfills"
import { namesMatch } from "@/lib/name-matching"
import { ocrImageBuffer } from "@/lib/ocr-image"

export type VerificationResult =
  | { verified: true }
  | { verified: false; reason: string }

async function extractPdfText(buffer: Buffer): Promise<string> {
  ensureDomPolyfills()
  const { PDFParse } = await import("pdf-parse")

  const parser = new PDFParse({ data: new Uint8Array(buffer) })
  try {
    const result = await parser.getText({ first: 5 })
    const text = result.text?.trim() ?? ""
    if (text.length >= 30) return text

    const screenshot = await parser.getScreenshot({
      first: 3,
      scale: 2,
      imageBuffer: true,
    })

    const ocrChunks: string[] = []
    for (const page of screenshot.pages) {
      if (page.data) {
        ocrChunks.push(await ocrImageBuffer(Buffer.from(page.data)))
      }
    }

    return [text, ...ocrChunks].filter(Boolean).join("\n")
  } finally {
    await parser.destroy()
  }
}

export async function verifyAktaDocument(
  pdfBuffer: Buffer,
  expectedOwnerName: string,
): Promise<VerificationResult> {
  const trimmedName = expectedOwnerName.trim()
  if (!trimmedName) {
    return { verified: false, reason: "Nama PIC harus diisi sebelum verifikasi akta" }
  }

  let text: string
  try {
    text = await extractPdfText(pdfBuffer)
  } catch (error) {
    console.error("Akta text extraction error:", error)
    return {
      verified: false,
      reason: "Gagal membaca akta. Unggah ulang PDF akta yang lebih jelas.",
    }
  }

  if (text.trim().length < 20) {
    return {
      verified: false,
      reason:
        "Teks akta tidak terbaca. Unggah PDF dengan kualitas scan lebih baik atau file yang memiliki teks dapat dibaca.",
    }
  }

  if (!namesMatch(trimmedName, text)) {
    return {
      verified: false,
      reason:
        "Nama pemilik di akta tidak cocok dengan Nama PIC. Pastikan akta sesuai dan Nama PIC sama dengan KTP.",
    }
  }

  return { verified: true }
}
