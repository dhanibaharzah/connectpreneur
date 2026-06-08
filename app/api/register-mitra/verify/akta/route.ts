import { type NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { fileTypeFromBuffer } from "file-type"
import { verifyAktaDocument } from "@/lib/akta-verification"

const MAX_PDF_SIZE = 10 * 1024 * 1024

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

    const verification = await verifyAktaDocument(buffer, namaPic)

    const baseName = file.name.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "_").substring(0, 80)
    const filename = `documents/${Date.now()}-${baseName || "akta"}.pdf`
    const blob = await put(filename, buffer, {
      access: "public",
      contentType: "application/pdf",
    })

    if (verification.verified) {
      return NextResponse.json({
        verified: true,
        url: blob.url,
        message: "Akta berhasil diverifikasi otomatis",
      })
    }

    return NextResponse.json({
      verified: false,
      url: blob.url,
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

export const maxDuration = 120
