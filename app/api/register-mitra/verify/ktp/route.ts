import { type NextRequest, NextResponse } from "next/server"
import { fileTypeFromBuffer } from "file-type"
import { newStorageObjectId, uploadObject } from "@/lib/integrations/storage"
import { verifyKtpDocument } from "@/lib/integrations/ktp-verification"
import { isKtpOcrEnabled } from "@/lib/integrations/ocr-config"
import { isOcrServiceConfigured } from "@/lib/integrations/ocr-service"

const MAX_KTP_SIZE = 5 * 1024 * 1024
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const
const OCR_SKIPPED_REASON =
  "Dokumen KTP tersimpan. Verifikasi otomatis tidak berhasil. Admin akan mereview."

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file")
    const namaPic = String(formData.get("nama_pic") ?? "").trim()

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "File KTP tidak ditemukan" }, { status: 400 })
    }

    if (!namaPic) {
      return NextResponse.json({ error: "Nama PIC harus diisi sebelum upload KTP" }, { status: 400 })
    }

    if (file.size > MAX_KTP_SIZE) {
      return NextResponse.json({ error: "Ukuran foto KTP maksimal 5MB" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const detectedType = await fileTypeFromBuffer(buffer)

    if (
      !detectedType ||
      !ALLOWED_IMAGE_TYPES.includes(detectedType.mime as (typeof ALLOWED_IMAGE_TYPES)[number])
    ) {
      return NextResponse.json(
        { error: "Format KTP tidak didukung. Gunakan JPG, PNG, atau WebP." },
        { status: 400 },
      )
    }

    const ext = detectedType.mime === "image/png" ? "png" : detectedType.mime === "image/webp" ? "webp" : "jpg"
    const baseName = file.name.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "_").substring(0, 80)
    const storagePath = `documents/ktp/${newStorageObjectId()}-${baseName || "ktp"}.${ext}`
    const ocrEnabled = isKtpOcrEnabled() && isOcrServiceConfigured()

    let uploaded: Awaited<ReturnType<typeof uploadObject>>
    let verification: Awaited<ReturnType<typeof verifyKtpDocument>>

    try {
      if (ocrEnabled) {
        ;[uploaded, verification] = await Promise.all([
          uploadObject(storagePath, buffer, detectedType.mime),
          verifyKtpDocument(buffer, namaPic, {
            mimeType: detectedType.mime,
            filename: `${baseName || "ktp"}.${ext}`,
          }),
        ])
      } else {
        uploaded = await uploadObject(storagePath, buffer, detectedType.mime)
        verification = { verified: false, reason: OCR_SKIPPED_REASON }
      }
    } catch (blobError) {
      console.error("KTP storage upload error:", blobError)
      return NextResponse.json(
        { error: "Gagal menyimpan KTP. Periksa konfigurasi penyimpanan file." },
        { status: 500 },
      )
    }

    if (verification.verified) {
      return NextResponse.json({
        verified: true,
        url: uploaded.url,
        message: "KTP berhasil diverifikasi otomatis",
      })
    }

    return NextResponse.json({
      verified: false,
      url: uploaded.url,
      warning:
        verification.reason ||
        "Verifikasi otomatis KTP gagal. Dokumen tetap disimpan dan akan direview admin.",
    })
  } catch (error) {
    console.error("KTP verify error:", error)
    return NextResponse.json(
      { error: "Gagal memverifikasi KTP. Silakan coba lagi." },
      { status: 500 },
    )
  }
}
