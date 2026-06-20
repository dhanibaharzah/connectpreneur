import { type NextRequest, NextResponse } from "next/server"
import {
  buyerHasTransactions,
  createPembeliSession,
  pembeliSessionCookieOptions,
  resolveBuyerProfileAfterOtp,
  verifyPembeliOtpChallenge,
} from "@/lib/pembeli-auth"

export async function POST(request: NextRequest) {
  try {
    const { phone, otp, displayName } = await request.json()

    if (!phone?.trim() || !otp?.trim()) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 })
    }

    const valid = await verifyPembeliOtpChallenge(phone, otp.trim())
    if (!valid) {
      return NextResponse.json({ error: "OTP tidak valid atau sudah kedaluwarsa" }, { status: 401 })
    }

    const profile = await resolveBuyerProfileAfterOtp(phone, displayName)
    const sessionDisplayName = profile.displayName?.trim() || null
    const token = await createPembeliSession({ phone, displayName: sessionDisplayName })

    const response = NextResponse.json({
      success: true,
      profile: {
        phone: profile.phone,
        displayName: sessionDisplayName,
        totalPoints: profile.totalPoints,
        badgeLevel: profile.badgeLevel,
        completedOrders: profile.completedOrders,
      },
    })

    response.cookies.set(pembeliSessionCookieOptions(token))
    return response
  } catch (error) {
    console.error("Pembeli OTP verify error:", error)
    return NextResponse.json({ error: "Gagal verifikasi OTP" }, { status: 500 })
  }
}
