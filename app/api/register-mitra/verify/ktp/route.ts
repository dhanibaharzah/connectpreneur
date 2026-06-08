import { type NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { fileTypeFromBuffer } from "file-type"
import { verifyKtpDocument } from "@/lib/ktp-verification"
import { isKtpOcrEnabled } from "@/lib/ocr-config"
import { TimeoutError, withTimeout } from "@/lib/with-timeout"

const MAX_KTP_SIZE = 5 * 1024 * 1024
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const
/** Stay under Vercel Hobby 10s wall; Pro can raise via KTP_HANDLER_DEADLINE_MS */
const HANDLER_DEADLINE_MS = Number(process.env.KTP_HANDLER_DEADLINE_MS ?? 9_000)
const MIN_OCR_BUDGET_MS = Number(process.env.KTP_MIN_OCR_BUDGET_MS ?? 6_000)
const OCR_SKIPPED_REASON =
  "Dokumen KTP tersimpan. Verifikasi otomatis tidak dijalankan (batas waktu server). Admin akan mereview."

export async function POST(request: NextRequest) {
  const startedAt = Date.now()

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

    const ocrEnabled = isKtpOcrEnabled()
    const ocrBudget = HANDLER_DEADLINE_MS - (Date.now() - startedAt) - 400

    let verification: Awaited<ReturnType<typeof verifyKtpDocument>>
    if (!ocrEnabled || ocrBudget < MIN_OCR_BUDGET_MS) {
      console.warn(
        `KTP OCR skipped (enabled=${ocrEnabled}, budgetMs=${ocrBudget}, min=${MIN_OCR_BUDGET_MS})`,
      )
      verification = { verified: false, reason: OCR_SKIPPED_REASON }
    } else {
      try {
        verification = await withTimeout(
          verifyKtpDocument(buffer, namaPic),
          ocrBudget,
          "KTP verify",
        )
      } catch (error) {
        console.error("KTP verify timeout:", error)
        verification = {
          verified: false,
          reason:
            error instanceof TimeoutError
              ? "Verifikasi otomatis membutuhkan waktu terlalu lama. Dokumen tetap disimpan dan akan direview admin."
              : "Gagal membaca KTP. Dokumen tetap disimpan dan akan direview admin.",
        }
      }
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
