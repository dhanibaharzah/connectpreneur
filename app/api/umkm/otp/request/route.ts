import { type NextRequest, NextResponse } from "next/server"
import {
  checkOtpRateLimit,
  createOtpChallenge,
  createUmkmSession,
  findBusinessesByPhone,
  umkmSessionCookieOptions,
  verifyOtpChallenge,
} from "@/lib/umkm-auth"
import { sendUmkmOtp } from "@/lib/gowa"

export async function POST(request: NextRequest) {
  try {
    const { phone, business_id } = await request.json()

    if (!phone?.trim()) {
      return NextResponse.json({ error: "Nomor WhatsApp harus diisi" }, { status: 400 })
    }

    if (!checkOtpRateLimit(phone)) {
      return NextResponse.json(
        { error: "Terlalu banyak permintaan OTP. Coba lagi dalam 15 menit." },
        { status: 429 },
      )
    }

    const businesses = await findBusinessesByPhone(phone)
    if (businesses.length === 0) {
      return NextResponse.json(
        { error: "Nomor WhatsApp tidak terdaftar sebagai PIC bisnis aktif" },
        { status: 404 },
      )
    }

    const business = business_id
      ? businesses.find((b) => b.id === Number(business_id)) ?? businesses[0]
      : businesses[0]

    const otp = await createOtpChallenge(business.id as number, phone)

    try {
      await sendUmkmOtp(phone, otp)
    } catch (err) {
      console.error("UMKM OTP WhatsApp error:", err)
      return NextResponse.json({ error: "Gagal mengirim OTP via WhatsApp" }, { status: 502 })
    }

    return NextResponse.json({
      success: true,
      business_id: business.id,
      business_name: business.nama,
      businesses:
        businesses.length > 1
          ? businesses.map((b) => ({ id: b.id, nama: b.nama }))
          : undefined,
    })
  } catch (error) {
    console.error("UMKM OTP request error:", error)
    return NextResponse.json({ error: "Gagal memproses permintaan OTP" }, { status: 500 })
  }
}
