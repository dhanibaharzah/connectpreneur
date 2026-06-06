import { type NextRequest, NextResponse } from "next/server"
import {
  createPembeliSession,
  findTransactionsByPhone,
  pembeliSessionCookieOptions,
  verifyPembeliOtpChallenge,
} from "@/lib/pembeli-auth"
import { getOrCreateBuyerProfileFromTransactions } from "@/lib/gamification"

export async function POST(request: NextRequest) {
  try {
    const { phone, otp } = await request.json()

    if (!phone?.trim() || !otp?.trim()) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 })
    }

    const valid = await verifyPembeliOtpChallenge(phone, otp.trim())
    if (!valid) {
      return NextResponse.json({ error: "OTP tidak valid atau sudah kedaluwarsa" }, { status: 401 })
    }

    const transactions = await findTransactionsByPhone(phone)
    if (transactions.length === 0) {
      return NextResponse.json({ error: "Transaksi tidak ditemukan" }, { status: 404 })
    }

    const profile = await getOrCreateBuyerProfileFromTransactions(phone)
    const displayName = profile.displayName ?? transactions[0].buyerName

    const token = await createPembeliSession({ phone, displayName })

    const response = NextResponse.json({
      success: true,
      profile: {
        phone: profile.phone,
        displayName,
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
