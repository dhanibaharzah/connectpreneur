import { type NextRequest, NextResponse } from "next/server"
import { getUmkmSessionFromRequest } from "@/lib/auth/umkm-auth"
import { requirePicPhoneProof } from "@/lib/auth/pic-phone-otp"
import {
  getUmkmBusinessProfile,
  parseUmkmBusinessProfileUpdate,
  updateUmkmBusinessProfile,
} from "@/lib/umkm/business-profile"

export async function GET(request: NextRequest) {
  const session = await getUmkmSessionFromRequest(request)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const profile = await getUmkmBusinessProfile(session.businessId)
    if (!profile) {
      return NextResponse.json({ error: "Bisnis tidak ditemukan" }, { status: 404 })
    }
    return NextResponse.json({ profile })
  } catch (error) {
    console.error("Get UMKM profile error:", error)
    return NextResponse.json({ error: "Gagal memuat profil bisnis" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  const session = await getUmkmSessionFromRequest(request)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = (await request.json()) as Record<string, unknown>
    const parsed = parseUmkmBusinessProfileUpdate(body)
    if ("error" in parsed) {
      return NextResponse.json({ error: parsed.error }, { status: 400 })
    }

    if (parsed.data.kontak_pic !== undefined) {
      const current = await getUmkmBusinessProfile(session.businessId)
      const phoneProof = await requirePicPhoneProof({
        phone: parsed.data.kontak_pic,
        proofToken:
          typeof body.kontak_pic_proof_token === "string" ? body.kontak_pic_proof_token : null,
        currentPhone: current?.kontak_pic,
        excludeBusinessId: session.businessId,
      })
      if (!phoneProof.ok) {
        return NextResponse.json({ error: phoneProof.error }, { status: 400 })
      }
    }

    const result = await updateUmkmBusinessProfile(session.businessId, parsed.data)
    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: result.status })
    }

    return NextResponse.json({ success: true, profile: result })
  } catch (error) {
    console.error("Update UMKM profile error:", error)
    return NextResponse.json({ error: "Gagal menyimpan profil bisnis" }, { status: 500 })
  }
}
