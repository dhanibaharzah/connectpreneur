import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/sql"
import { createTransaction } from "@/lib/transactions/transactions"
import {
  sendRfqConfirmationToBuyer,
  sendRfqNotificationToUmkm,
} from "@/lib/integrations/gowa"
import { checkRfqRateLimit } from "@/lib/marketplace/rfq-rate-limit"
import { normalizePhoneDigits } from "@/lib/shared/phone"

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"
    if (!checkRfqRateLimit(ip)) {
      return NextResponse.json(
        { error: "Terlalu banyak permintaan. Coba lagi nanti." },
        { status: 429 },
      )
    }

    const body = await request.json()
    const { business_slug, buyer_name, buyer_phone, quantity, notes, website } = body

    if (website) {
      return NextResponse.json({ success: true, reference_no: "ignored" }, { status: 201 })
    }

    if (!business_slug || !buyer_name?.trim() || !buyer_phone?.trim()) {
      return NextResponse.json(
        { error: "Nama bisnis, nama, dan nomor WhatsApp harus diisi" },
        { status: 400 },
      )
    }

    if (!notes?.trim()) {
      return NextResponse.json({ error: "Catatan khusus harus diisi" }, { status: 400 })
    }

    const qty = Number(quantity)
    if (Number.isNaN(qty) || qty < 0) {
      return NextResponse.json({ error: "Kuantitas tidak valid" }, { status: 400 })
    }

    const businesses = await sql`
      SELECT id, nama, slug, kontak_pic, location_id
      FROM businesses
      WHERE slug = ${business_slug} AND is_active = true
    `

    if (businesses.length === 0) {
      return NextResponse.json({ error: "Bisnis tidak ditemukan" }, { status: 404 })
    }

    const business = businesses[0]
    const normalizedPhone = normalizePhoneDigits(buyer_phone)

    const transaction = await createTransaction({
      businessId: business.id as number,
      locationId: (business.location_id as number | null) ?? null,
      buyerName: buyer_name.trim(),
      buyerPhone: normalizedPhone,
      quantity: qty,
      notes: notes.trim(),
    })

    try {
      await sendRfqNotificationToUmkm({
        phone: String(business.kontak_pic),
        businessName: business.nama as string,
        buyerName: buyer_name.trim(),
        referenceNo: transaction.referenceNo,
        quantity: qty,
        notes: notes.trim(),
      })
      await sendRfqConfirmationToBuyer({
        phone: normalizedPhone,
        buyerName: buyer_name.trim(),
        businessName: business.nama as string,
        referenceNo: transaction.referenceNo,
      })
    } catch (whatsappError) {
      console.error("RFQ WhatsApp notification error:", whatsappError)
    }

    return NextResponse.json(
      {
        success: true,
        reference_no: transaction.referenceNo,
        message:
          "Terima kasih. Harap menunggu, transaksi Anda sedang diproses oleh Mitra UMKM kami.",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("RFQ submit error:", error)
    return NextResponse.json({ error: "Gagal mengirim permintaan penawaran" }, { status: 500 })
  }
}
