import { type NextRequest, NextResponse } from "next/server"
import { getUmkmSessionFromRequest } from "@/lib/auth/umkm-auth"
import {
  assertPhoneAvailableForPic,
  checkPicPhoneOtpRateLimit,
  createPicPhoneOtpChallenge,
  isValidPicPhone,
} from "@/lib/auth/pic-phone-otp"
import { sendPicPhoneOtp } from "@/lib/integrations/gowa"
import { normalizePhoneDigits } from "@/lib/shared/phone"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const phone = typeof body.phone === "string" ? body.phone : ""
    const excludeFromBody =
      body.exclude_business_id != null && body.exclude_business_id !== ""
        ? Number(body.exclude_business_id)
        : null

    if (!phone.trim()) {
      return NextResponse.json({ error: "Nomor WhatsApp harus diisi" }, { status: 400 })
    }

    if (!isValidPicPhone(phone)) {
      return NextResponse.json(
        { error: "Format nomor WhatsApp tidak valid. Gunakan format 628xxx." },
        { status: 400 },
      )
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

    if (!checkPicPhoneOtpRateLimit(phone)) {
      return NextResponse.json(
        { error: "Terlalu banyak permintaan OTP. Coba lagi dalam 15 menit." },
        { status: 429 },
      )
    }

    const otp = await createPicPhoneOtpChallenge(phone)

    try {
      await sendPicPhoneOtp(phone, otp)
    } catch (err) {
      console.error("PIC phone OTP WhatsApp error:", err)
      return NextResponse.json(
        {
          error:
            "Gagal mengirim OTP ke nomor tersebut. Pastikan nomor WhatsApp aktif dan dapat menerima pesan.",
        },
        { status: 502 },
      )
    }

    return NextResponse.json({
      success: true,
      phone: normalizePhoneDigits(phone),
    })
  } catch (error) {
    console.error("PIC phone OTP request error:", error)
    return NextResponse.json({ error: "Gagal memproses permintaan OTP" }, { status: 500 })
  }
}
