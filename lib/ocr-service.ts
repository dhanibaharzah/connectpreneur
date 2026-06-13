import { TimeoutError, withTimeout } from "@/lib/with-timeout"

const DEFAULT_TIMEOUT_MS = Number(process.env.OCR_SERVICE_TIMEOUT_MS ?? 12_000)

export interface OcrServiceVerifyOptions {
  buffer: Buffer
  expectedText: string
  filename: string
  mimeType: string
  timeoutMs?: number
}

export interface OcrServiceVerifyResult {
  verified: boolean
  text: string
  raw: Record<string, unknown>
}

export class OcrServiceError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message)
    this.name = "OcrServiceError"
  }
}

function getOcrServiceConfig() {
  const url = process.env.OCR_SERVICE_URL?.trim()
  const apiKey = process.env.OCR_SERVICE_API_KEY?.trim()

  if (!url || !apiKey) {
    return null
  }

  return { url, apiKey }
}

export function isOcrServiceConfigured(): boolean {
  return getOcrServiceConfig() !== null
}

function pickString(value: unknown): string {
  return typeof value === "string" ? value.trim() : ""
}

function extractText(payload: Record<string, unknown>): string {
  const data =
    payload.data && typeof payload.data === "object" && !Array.isArray(payload.data)
      ? (payload.data as Record<string, unknown>)
      : null

  return (
    pickString(payload.text) ||
    pickString(payload.ocr_text) ||
    pickString(payload.extracted_text) ||
    pickString(data?.text) ||
    pickString(data?.ocr_text) ||
    pickString(data?.extracted_text)
  )
}

function extractVerified(payload: Record<string, unknown>): boolean | null {
  const data =
    payload.data && typeof payload.data === "object" && !Array.isArray(payload.data)
      ? (payload.data as Record<string, unknown>)
      : null

  const candidates = [
    payload.verified,
    payload.matched,
    payload.match,
    payload.success,
    data?.verified,
    data?.matched,
    data?.match,
    data?.success,
  ]

  for (const value of candidates) {
    if (typeof value === "boolean") return value
  }

  return null
}

function parseVerifyResponse(body: unknown): OcrServiceVerifyResult {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new OcrServiceError("Respons OCR service tidak valid")
  }

  const payload = body as Record<string, unknown>
  const verified = extractVerified(payload)
  const text = extractText(payload)

  if (verified === null) {
    throw new OcrServiceError("Respons OCR service tidak memuat status verifikasi")
  }

  return { verified, text, raw: payload }
}

export function parseOcrServiceVerifyResponse(body: unknown): OcrServiceVerifyResult {
  return parseVerifyResponse(body)
}

export async function verifyDocumentWithOcrService(
  options: OcrServiceVerifyOptions,
): Promise<OcrServiceVerifyResult> {
  const config = getOcrServiceConfig()
  if (!config) {
    throw new OcrServiceError("OCR service belum dikonfigurasi")
  }

  const expectedText = options.expectedText.trim()
  if (!expectedText) {
    throw new OcrServiceError("expected_text wajib diisi")
  }

  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS

  return withTimeout(
    (async () => {
      const form = new FormData()
      form.append(
        "file",
        new Blob([new Uint8Array(options.buffer)], { type: options.mimeType }),
        options.filename,
      )
      form.append("expected_text", expectedText)

      const response = await fetch(config.url, {
        method: "POST",
        headers: {
          "X-API-Key": config.apiKey,
        },
        body: form,
      })

      const bodyText = await response.text()
      let body: unknown = null

      if (bodyText) {
        try {
          body = JSON.parse(bodyText)
        } catch {
          throw new OcrServiceError(
            response.ok
              ? "Respons OCR service bukan JSON valid"
              : `OCR service error (${response.status})`,
            response.status,
          )
        }
      }

      if (!response.ok) {
        const message =
          body && typeof body === "object" && !Array.isArray(body)
            ? pickString((body as Record<string, unknown>).error) ||
              pickString((body as Record<string, unknown>).message) ||
              `OCR service error (${response.status})`
            : `OCR service error (${response.status})`
        throw new OcrServiceError(message, response.status)
      }

      return parseVerifyResponse(body)
    })(),
    timeoutMs,
    "OCR service verify",
  )
}

export function isOcrServiceTimeoutError(error: unknown): boolean {
  return error instanceof TimeoutError
}
