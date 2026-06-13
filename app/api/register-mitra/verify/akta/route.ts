import { type NextRequest, NextResponse } from "next/server"
import { fileTypeFromBuffer } from "file-type"
import { uploadObject } from "@/lib/storage"
import { verifyAktaDocument } from "@/lib/akta-verification"
import { isAktaOcrEnabled } from "@/lib/ocr-config"
import { isOcrServiceConfigured } from "@/lib/ocr-service"

const MAX_PDF_SIZE = 10 * 1024 * 1024
const OCR_SKIPPED_REASON =
  "Dokumen akta tersimpan. Verifikasi otomatis tidak dijalankan (batas waktu server). Admin akan mereview."

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file")
    const namaPic = String(formData.get("nama_pic") ?? "").trim()

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "File akta tidak ditemukan" }, { status: 400 })
    }

    if (!namaPic) {
      return NextResponse.json({ error: "Nama PIC harus diisi sebelum upload akta" }, { status: 400 })
    }

    if (file.size > MAX_PDF_SIZE) {
      return NextResponse.json({ error: "Ukuran file akta maksimal 10MB" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const detectedType = await fileTypeFromBuffer(buffer)

    if (!detectedType || detectedType.mime !== "application/pdf") {
      return NextResponse.json({ error: "Akta harus berupa file PDF" }, { status: 400 })
    }

    const baseName = file.name.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "_").substring(0, 80)
    const storagePath = `documents/${Date.now()}-${baseName || "akta"}.pdf`
    const ocrEnabled = isAktaOcrEnabled() && isOcrServiceConfigured()

    let uploaded: Awaited<ReturnType<typeof uploadObject>>
    let verification: Awaited<ReturnType<typeof verifyAktaDocument>>

    try {
      if (ocrEnabled) {
        ;[uploaded, verification] = await Promise.all([
          uploadObject(storagePath, buffer, "application/pdf"),
          verifyAktaDocument(buffer, namaPic, {
            filename: `${baseName || "akta"}.pdf`,
          }),
        ])
      } else {
        uploaded = await uploadObject(storagePath, buffer, "application/pdf")
        verification = { verified: false, reason: OCR_SKIPPED_REASON }
      }
    } catch (blobError) {
      console.error("Akta storage upload error:", blobError)
      return NextResponse.json(
        { error: "Gagal menyimpan akta. Periksa konfigurasi penyimpanan file." },
        { status: 500 },
      )
    }

    if (verification.verified) {
      return NextResponse.json({
        verified: true,
        url: uploaded.url,
        message: "Akta berhasil diverifikasi otomatis",
      })
    }

    return NextResponse.json({
      verified: false,
      url: uploaded.url,
      warning:
        verification.reason ||
        "Verifikasi otomatis akta gagal. Dokumen tetap disimpan dan akan direview admin.",
    })
  } catch (error) {
    console.error("Akta verify error:", error)
    return NextResponse.json(
      { error: "Gagal memverifikasi akta. Silakan coba lagi." },
      { status: 500 },
    )
  }
}
