import { type NextRequest, NextResponse } from "next/server"
import { getUmkmSessionFromRequest } from "@/lib/auth/umkm-auth"
import {
  assertPhoneAvailableForPic,
  createPicPhoneProofToken,
  isValidPicPhone,
  verifyPicPhoneOtpChallenge,
} from "@/lib/auth/pic-phone-otp"
import { normalizePhoneDigits } from "@/lib/shared/phone"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const phone = typeof body.phone === "string" ? body.phone : ""
    const otp = typeof body.otp === "string" ? body.otp : ""
    const excludeFromBody =
      body.exclude_business_id != null && body.exclude_business_id !== ""
        ? Number(body.exclude_business_id)
        : null

    if (!phone.trim() || !otp.trim()) {
      return NextResponse.json({ error: "Nomor WhatsApp dan OTP harus diisi" }, { status: 400 })
    }

    if (!isValidPicPhone(phone)) {
      return NextResponse.json({ error: "Format nomor WhatsApp tidak valid" }, { status: 400 })
    }

    const session = await getUmkmSessionFromRequest(request)
    const excludeBusinessId =
      excludeFromBody != null && Number.isFinite(excludeFromBody)
        ? excludeFromBody
        : (session?.businessId ?? null)

    const availability = await assertPhoneAvailableForPic({
      phone,
      excludeBusinessId,
    })
    if (!availability.ok) {
      return NextResponse.json({ error: availability.error }, { status: 409 })
    }

    const valid = await verifyPicPhoneOtpChallenge(phone, otp.trim())
    if (!valid) {
      return NextResponse.json({ error: "OTP tidak valid atau sudah kedaluwarsa" }, { status: 401 })
    }

    const normalized = normalizePhoneDigits(phone)
    const proof_token = await createPicPhoneProofToken(normalized)

    return NextResponse.json({
      success: true,
      phone: normalized,
      proof_token,
    })
  } catch (error) {
    console.error("PIC phone OTP verify error:", error)
    return NextResponse.json({ error: "Gagal verifikasi OTP" }, { status: 500 })
  }
}
