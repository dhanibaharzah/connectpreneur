import { type NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"
import sharp from "sharp"
import { fileTypeFromBuffer } from "file-type"
import { getValidToken, markTokenUsed } from "@/lib/transaction-tokens"
import { getTransactionById, uploadPaymentProof } from "@/lib/transactions"
import { sendPaymentProofNotificationToUmkm } from "@/lib/gowa"
import { isDbConnectionError, sql, withDbRetry } from "@/lib/sql"
const MAX_SIZE = 5 * 1024 * 1024

type RouteContext = { params: Promise<{ token: string }> }

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { token } = await context.params
    const record = await getValidToken(token, "buyer_payment")
    if (!record) {
      return NextResponse.json({ error: "Link tidak valid atau sudah kedaluwarsa" }, { status: 404 })
    }

    const transaction = await withDbRetry(() => getTransactionById(record.transaction_id as number))
    if (!transaction) {
      return NextResponse.json({ error: "Transaksi tidak ditemukan" }, { status: 404 })
    }

    const [business] = await withDbRetry(async () => sql`
      SELECT nama, bank_name, bank_account_number, bank_account_name
      FROM businesses WHERE id = ${transaction.businessId}
    `)

    return NextResponse.json({
      transaction,
      business,
      already_uploaded: transaction.status !== "invoice_sent",
    })
  } catch (error) {
    console.error("Payment proof GET error:", error)
    if (isDbConnectionError(error)) {
      return NextResponse.json(
        { error: "Koneksi database timeout. Silakan refresh halaman." },
        { status: 503 },
      )
    }
    return NextResponse.json({ error: "Gagal memuat halaman" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const { token } = await context.params
    const record = await getValidToken(token, "buyer_payment")
    if (!record) {
      return NextResponse.json({ error: "Link tidak valid atau sudah kedaluwarsa" }, { status: 404 })
    }

    const transaction = await withDbRetry(() => getTransactionById(record.transaction_id as number))
    if (!transaction || transaction.status !== "invoice_sent") {
      return NextResponse.json(
        { error: "Bukti transfer sudah diupload atau transaksi tidak valid" },
        { status: 400 },
      )
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    if (!file) {
      return NextResponse.json({ error: "File tidak ditemukan" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    if (buffer.length > MAX_SIZE) {
      return NextResponse.json({ error: "Ukuran file maksimal 5MB" }, { status: 400 })
    }

    const detected = await fileTypeFromBuffer(buffer)
    if (!detected || !["image/jpeg", "image/png", "image/webp"].includes(detected.mime)) {
      return NextResponse.json({ error: "Format file harus JPG, PNG, atau WebP" }, { status: 400 })
    }

    let output = buffer
    if (detected.mime !== "image/webp") {
      output = await sharp(buffer).jpeg({ quality: 80 }).toBuffer()
    }

    const blob = await put(`transaksi/bukti-${transaction.referenceNo}-${Date.now()}.jpg`, output, {
      access: "public",
      contentType: "image/jpeg",
    })

    const updated = await uploadPaymentProof(transaction.id, blob.url)
    if (!updated) {
      return NextResponse.json({ error: "Gagal menyimpan bukti transfer" }, { status: 500 })
    }

    await markTokenUsed(token)

    const [business] = await sql`
      SELECT nama, kontak_pic FROM businesses WHERE id = ${transaction.businessId}
    `

    try {
      await sendPaymentProofNotificationToUmkm({
        phone: String(business.kontak_pic),
        businessName: business.nama as string,
        referenceNo: transaction.referenceNo,
        buyerName: transaction.buyerName,
      })
    } catch (err) {
      console.error("Payment proof notification error:", err)
    }

    return NextResponse.json({ success: true, payment_proof_url: blob.url })
  } catch (error) {
    console.error("Payment proof upload error:", error)
    if (isDbConnectionError(error)) {
      return NextResponse.json(
        { error: "Koneksi database timeout. Silakan coba lagi." },
        { status: 503 },
      )
    }
    return NextResponse.json({ error: "Gagal upload bukti transfer" }, { status: 500 })
  }
}
