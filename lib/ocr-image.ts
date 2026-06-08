import sharp from "sharp"
import { createWorker, type Worker } from "tesseract.js"
import { getTesseractWorkerOptions } from "@/lib/tesseract-config"
import { TimeoutError, withTimeout } from "@/lib/with-timeout"

const WORKER_INIT_TIMEOUT_MS = Number(process.env.OCR_WORKER_INIT_TIMEOUT_MS ?? 5_000)
const RECOGNIZE_TIMEOUT_MS = Number(process.env.OCR_RECOGNIZE_TIMEOUT_MS ?? 6_000)
const KTP_MAX_WIDTH = 1400

async function preprocessKtpImage(buffer: Buffer): Promise<Buffer> {
  return sharp(buffer)
    .rotate()
    .grayscale()
    .normalize()
    .resize({ width: KTP_MAX_WIDTH, withoutEnlargement: true })
    .jpeg({ quality: 85 })
    .toBuffer()
}

/** OCR one image. Uses a fresh worker per call (safe on serverless). */
export async function ocrImageBuffer(
  buffer: Buffer,
  options?: { languages?: string },
): Promise<string> {
  const languages = options?.languages ?? "ind"
  let worker: Worker | null = null

  try {
    worker = await withTimeout(
      createWorker(languages, undefined, getTesseractWorkerOptions()),
      WORKER_INIT_TIMEOUT_MS,
      "OCR worker init",
    )

    const processed = await preprocessKtpImage(buffer)
    const { data } = await withTimeout(
      worker.recognize(processed),
      RECOGNIZE_TIMEOUT_MS,
      "OCR recognize",
    )

    return data.text
  } finally {
    if (worker) {
      await worker.terminate().catch(() => {})
    }
  }
}

export function isOcrTimeoutError(error: unknown): boolean {
  return error instanceof TimeoutError
}
