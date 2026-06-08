import { extractNameFromKtpText, allNameTokensFound, namesMatch } from "@/lib/name-matching"
import { hasValidNik } from "@/lib/nik"
import { ocrImageBuffer } from "@/lib/ocr-image"

export type VerificationResult =
  | { verified: true }
  | { verified: false; reason: string }

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
