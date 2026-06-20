import { type NextRequest, NextResponse } from "next/server"
import {
  buyerHasTransactions,
  createPembeliSession,
  pembeliSessionCookieOptions,
  resolveBuyerDisplayName,
  verifyPembeliOtpChallenge,
} from "@/lib/pembeli-auth"
import { ensureBuyerProfile, getOrCreateBuyerProfileFromTransactions } from "@/lib/gamification"

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

    const hasTransactions = await buyerHasTransactions(phone)
    let profile

    if (hasTransactions) {
      const resolvedName = await resolveBuyerDisplayName(phone, displayName)
      profile = await getOrCreateBuyerProfileFromTransactions(phone)
      profile = {
        ...profile,
        displayName: resolvedName || profile.displayName,
      }
    } else {
      profile = await ensureBuyerProfile(phone, displayName?.trim() || null)
    }

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
