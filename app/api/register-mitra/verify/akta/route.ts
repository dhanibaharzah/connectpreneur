import { type NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { fileTypeFromBuffer } from "file-type"
import { verifyAktaDocument } from "@/lib/akta-verification"
import { isAktaOcrEnabled } from "@/lib/ocr-config"
import { TimeoutError, withTimeout } from "@/lib/with-timeout"

const MAX_PDF_SIZE = 10 * 1024 * 1024
const HANDLER_DEADLINE_MS = Number(process.env.AKTA_HANDLER_DEADLINE_MS ?? 25_000)
const MIN_OCR_BUDGET_MS = Number(process.env.AKTA_MIN_OCR_BUDGET_MS ?? 8_000)
const OCR_SKIPPED_REASON =
  "Dokumen akta tersimpan. Verifikasi otomatis tidak dijalankan (batas waktu server). Admin akan mereview."

export async function POST(request: NextRequest) {
  const startedAt = Date.now()

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
    const filename = `documents/${Date.now()}-${baseName || "akta"}.pdf`

    let blob
    try {
      blob = await put(filename, buffer, {
        access: "public",
        contentType: "application/pdf",
      })
    } catch (blobError) {
      console.error("Akta blob upload error:", blobError)
      return NextResponse.json(
        { error: "Gagal menyimpan akta. Periksa konfigurasi penyimpanan file." },
        { status: 500 },
      )
    }

    const ocrEnabled = isAktaOcrEnabled()
    const ocrBudget = HANDLER_DEADLINE_MS - (Date.now() - startedAt) - 400

    let verification: Awaited<ReturnType<typeof verifyAktaDocument>>
    if (!ocrEnabled || ocrBudget < MIN_OCR_BUDGET_MS) {
      console.warn(
        `Akta OCR skipped (enabled=${ocrEnabled}, budgetMs=${ocrBudget}, min=${MIN_OCR_BUDGET_MS})`,
      )
      verification = { verified: false, reason: OCR_SKIPPED_REASON }
    } else {
      try {
        verification = await withTimeout(
          verifyAktaDocument(buffer, namaPic),
          ocrBudget,
          "Akta verify",
        )
      } catch (error) {
        console.error("Akta verify timeout:", error)
        verification = {
          verified: false,
          reason:
            error instanceof TimeoutError
              ? "Verifikasi otomatis membutuhkan waktu terlalu lama. Dokumen tetap disimpan dan akan direview admin."
              : "Gagal membaca akta. Dokumen tetap disimpan dan akan direview admin.",
        }
      }
    }

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

export const maxDuration = 60
