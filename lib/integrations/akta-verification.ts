import {
  isOcrServiceConfigured,
  isOcrServiceTimeoutError,
  OcrServiceError,
  verifyDocumentWithOcrService,
} from "@/lib/integrations/ocr-service"

export type VerificationResult =
  | { verified: true }
  | { verified: false; reason: string }

const AKTA_VERIFY_FAIL_REASON =
  "Dokumen Akta tersimpan. Verifikasi otomatis tidak berhasil. Admin akan mereview."

export async function verifyAktaDocument(
  pdfBuffer: Buffer,
  expectedOwnerName: string,
  options?: { filename?: string },
): Promise<VerificationResult> {
  const trimmedName = expectedOwnerName.trim()
  if (!trimmedName) {
    return { verified: false, reason: "Nama PIC harus diisi sebelum verifikasi akta" }
  }

  if (!isOcrServiceConfigured()) {
    return {
      verified: false,
      reason: "Verifikasi otomatis akta belum dikonfigurasi di server.",
    }
  }

  try {
    const result = await verifyDocumentWithOcrService({
      buffer: pdfBuffer,
      expectedText: trimmedName,
      filename: options?.filename ?? "akta.pdf",
      mimeType: "application/pdf",
    })

    if (!result.verified) {
      return { verified: false, reason: AKTA_VERIFY_FAIL_REASON }
    }

    return { verified: true }
  } catch (error) {
    console.error("Akta OCR service error:", error)
    if (isOcrServiceTimeoutError(error)) {
      return {
        verified: false,
        reason:
          "Verifikasi otomatis membutuhkan waktu terlalu lama. Dokumen tetap disimpan dan akan direview admin.",
      }
    }
    if (error instanceof OcrServiceError) {
      return { verified: false, reason: AKTA_VERIFY_FAIL_REASON }
    }
    return { verified: false, reason: AKTA_VERIFY_FAIL_REASON }
  }
}
