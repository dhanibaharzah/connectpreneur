import sharp from "sharp"
import { createWorker, type Worker } from "tesseract.js"
import { getTesseractWorkerOptions } from "@/lib/tesseract-config"

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

export async function ocrImageBuffer(buffer: Buffer): Promise<string> {
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
