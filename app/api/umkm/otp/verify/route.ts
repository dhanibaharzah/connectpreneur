import { type NextRequest, NextResponse } from "next/server"
import {
  createUmkmSession,
  umkmSessionCookieOptions,
  verifyOtpChallenge,
} from "@/lib/umkm-auth"
import { sql } from "@/lib/sql"

export async function POST(request: NextRequest) {
  try {
    const { phone, otp, business_id } = await request.json()

    if (!phone?.trim() || !otp?.trim() || !business_id) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 })
    }

    const valid = await verifyOtpChallenge(Number(business_id), phone, otp.trim())
    if (!valid) {
      return NextResponse.json({ error: "OTP tidak valid atau sudah kedaluwarsa" }, { status: 401 })
    }

    const [business] = await sql`
      SELECT id, nama FROM businesses WHERE id = ${Number(business_id)} AND is_active = true
    `

    if (!business) {
      return NextResponse.json({ error: "Bisnis tidak ditemukan" }, { status: 404 })
    }

    const token = await createUmkmSession({
      businessId: business.id as number,
      phone,
      businessName: business.nama as string,
    })

    const response = NextResponse.json({
      success: true,
      business: { id: business.id, nama: business.nama },
    })

    response.cookies.set(umkmSessionCookieOptions(token))
    return response
  } catch (error) {
    console.error("UMKM OTP verify error:", error)
    return NextResponse.json({ error: "Gagal verifikasi OTP" }, { status: 500 })
  }
}
