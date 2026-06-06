import { type NextRequest, NextResponse } from "next/server"
import {
  buyerHasTransactions,
  checkOtpRateLimit,
  createPembeliOtpChallenge,
} from "@/lib/pembeli-auth"
import { sendPembeliOtp } from "@/lib/gowa"

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json()

    if (!phone?.trim()) {
      return NextResponse.json({ error: "Nomor WhatsApp harus diisi" }, { status: 400 })
    }

    if (!checkOtpRateLimit(phone)) {
      return NextResponse.json(
        { error: "Terlalu banyak permintaan OTP. Coba lagi dalam 15 menit." },
        { status: 429 },
      )
    }

    const hasTransactions = await buyerHasTransactions(phone)
    if (!hasTransactions) {
      return NextResponse.json(
        { error: "Belum ada transaksi dengan nomor WhatsApp ini" },
        { status: 404 },
      )
    }

    const otp = await createPembeliOtpChallenge(phone)

    try {
      await sendPembeliOtp(phone, otp)
    } catch (err) {
      console.error("Pembeli OTP WhatsApp error:", err)
      return NextResponse.json({ error: "Gagal mengirim OTP via WhatsApp" }, { status: 502 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Pembeli OTP request error:", error)
    return NextResponse.json({ error: "Gagal memproses permintaan OTP" }, { status: 500 })
  }
}
