import { type NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { fileTypeFromBuffer } from "file-type"
import { verifyKtpDocument } from "@/lib/document-verification"

const MAX_KTP_SIZE = 5 * 1024 * 1024
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const

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

    const verification = await verifyKtpDocument(buffer, namaPic)

    const ext = detectedType.mime === "image/png" ? "png" : detectedType.mime === "image/webp" ? "webp" : "jpg"
    const filename = `documents/ktp/${Date.now()}-ktp.${ext}`
    let blob
    try {
      blob = await put(filename, buffer, {
        access: "public",
        contentType: detectedType.mime,
      })
    } catch (blobError) {
      console.error("KTP blob upload error:", blobError)
      return NextResponse.json(
        { error: "Gagal menyimpan KTP. Periksa konfigurasi penyimpanan file." },
        { status: 500 },
      )
    }

    if (verification.verified) {
      return NextResponse.json({
        verified: true,
        url: blob.url,
        message: "KTP berhasil diverifikasi otomatis",
      })
    }

    return NextResponse.json({
      verified: false,
      url: blob.url,
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

export const maxDuration = 60
