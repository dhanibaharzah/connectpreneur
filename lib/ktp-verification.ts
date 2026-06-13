import { hasValidNik } from "@/lib/nik"
import {
  isOcrServiceConfigured,
  isOcrServiceTimeoutError,
  OcrServiceError,
  verifyDocumentWithOcrService,
} from "@/lib/ocr-service"

export type VerificationResult =
  | { verified: true }
  | { verified: false; reason: string }

const KTP_VERIFY_FAIL_REASON =
  "Dokumen KTP tersimpan. Verifikasi otomatis tidak berhasil. Admin akan mereview."

export async function verifyKtpDocument(
  imageBuffer: Buffer,
  expectedName: string,
  options?: { mimeType?: string; filename?: string },
): Promise<VerificationResult> {
  const trimmedName = expectedName.trim()
  if (!trimmedName) {
    return { verified: false, reason: "Nama PIC harus diisi sebelum verifikasi KTP" }
  }

  if (!isOcrServiceConfigured()) {
    return {
      verified: false,
      reason: "Verifikasi otomatis KTP belum dikonfigurasi di server.",
    }
  }

  try {
    const result = await verifyDocumentWithOcrService({
      buffer: imageBuffer,
      expectedText: trimmedName,
      filename: options?.filename ?? "ktp.jpg",
      mimeType: options?.mimeType ?? "image/jpeg",
    })

    if (!result.verified) {
      return { verified: false, reason: KTP_VERIFY_FAIL_REASON }
    }

    if (result.text && !hasValidNik(result.text)) {
      return {
        verified: false,
        reason:
          "NIK 16 digit tidak ditemukan di KTP. Pastikan foto depan KTP jelas dan tidak terpotong.",
      }
    }

    return { verified: true }
  } catch (error) {
    console.error("KTP OCR service error:", error)
    if (isOcrServiceTimeoutError(error)) {
      return {
        verified: false,
        reason:
          "Verifikasi otomatis membutuhkan waktu terlalu lama. Dokumen tetap disimpan dan akan direview admin.",
      }
    }
    if (error instanceof OcrServiceError) {
      return { verified: false, reason: KTP_VERIFY_FAIL_REASON }
    }
    return {
      verified: false,
      reason: "Gagal membaca KTP. Unggah ulang foto depan KTP yang lebih jelas.",
    }
  }
}
