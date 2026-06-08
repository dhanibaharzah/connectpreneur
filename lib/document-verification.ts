import sharp from "sharp"
import { PDFParse } from "pdf-parse"
import { createWorker, type Worker } from "tesseract.js"
import { extractNameFromKtpText, allNameTokensFound, namesMatch } from "@/lib/name-matching"
import { hasValidNik } from "@/lib/nik"
import { getTesseractWorkerOptions } from "@/lib/tesseract-config"

export type VerificationResult =
  | { verified: true }
  | { verified: false; reason: string }

let ocrWorker: Worker | null = null
let ocrWorkerInit: Promise<Worker> | null = null

async function getOcrWorker(): Promise<Worker> {
  if (ocrWorker) return ocrWorker

  if (!ocrWorkerInit) {
    ocrWorkerInit = createWorker("ind+eng", undefined, getTesseractWorkerOptions())
      .then((worker) => {
        ocrWorker = worker
        return worker
      })
      .catch((error) => {
        ocrWorkerInit = null
        throw error
      })
  }

  return ocrWorkerInit
}

function resetOcrWorker(): void {
  ocrWorker = null
  ocrWorkerInit = null
}

async function preprocessKtpImage(buffer: Buffer): Promise<Buffer> {
  return sharp(buffer)
    .rotate()
    .grayscale()
    .normalize()
    .sharpen()
    .resize({ width: 2400, withoutEnlargement: false })
    .jpeg({ quality: 92 })
    .toBuffer()
}

async function ocrImageBuffer(buffer: Buffer): Promise<string> {
  try {
    const worker = await getOcrWorker()
    const processed = await preprocessKtpImage(buffer)
    const { data } = await worker.recognize(processed)
    return data.text
  } catch (error) {
    resetOcrWorker()
    throw error
  }
}

async function extractPdfText(buffer: Buffer): Promise<string> {
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

export async function verifyKtpDocument(
  imageBuffer: Buffer,
  expectedName: string,
): Promise<VerificationResult> {
  const trimmedName = expectedName.trim()
  if (!trimmedName) {
    return { verified: false, reason: "Nama PIC harus diisi sebelum verifikasi KTP" }
  }

  let ocrText: string
  try {
    ocrText = await ocrImageBuffer(imageBuffer)
  } catch (error) {
    console.error("KTP OCR error:", error)
    return {
      verified: false,
      reason: "Gagal membaca KTP. Unggah ulang foto depan KTP yang lebih jelas.",
    }
  }

  if (!hasValidNik(ocrText)) {
    return {
      verified: false,
      reason: "NIK 16 digit tidak ditemukan di KTP. Pastikan foto depan KTP jelas dan tidak terpotong.",
    }
  }

  const extractedName = extractNameFromKtpText(ocrText)
  const nameMatched =
    allNameTokensFound(trimmedName, ocrText) ||
    (extractedName && namesMatch(trimmedName, extractedName)) ||
    namesMatch(trimmedName, ocrText)

  if (!nameMatched) {
    return {
      verified: false,
      reason: "Nama di KTP tidak cocok dengan Nama PIC yang Anda isi. Periksa kembali dan unggah ulang.",
    }
  }

  return { verified: true }
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

export async function fetchDocumentBuffer(url: string): Promise<Buffer> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch document (${response.status})`)
  }
  const arrayBuffer = await response.arrayBuffer()
  return Buffer.from(arrayBuffer)
}
