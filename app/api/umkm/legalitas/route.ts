import { type NextRequest, NextResponse } from "next/server"
import { getOrUpdateScore } from "@/lib/business/connect-score"
import { getConnectScoreTier, hasDocument } from "@/lib/business/connect-score-tier"
import { getUmkmSessionFromRequest } from "@/lib/auth/umkm-auth"
import { sql } from "@/lib/sql"

function parseDocumentUrl(value: unknown): string | null | undefined {
  if (value === undefined) return undefined
  if (value === null || value === "") return null
  if (typeof value !== "string") return null
  const trimmed = value.trim()
  if (!trimmed) return null
  if (!trimmed.startsWith("https://")) return null
  return trimmed
}

export async function GET(request: NextRequest) {
  const session = await getUmkmSessionFromRequest(request)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const rows = await sql`
    SELECT akta_pendirian_url, legalitas_url, is_active
    FROM businesses
    WHERE id = ${session.businessId}
  `

  if (rows.length === 0) {
    return NextResponse.json({ error: "Bisnis tidak ditemukan" }, { status: 404 })
  }

  const business = rows[0]
  const scoreResult = await getOrUpdateScore(session.businessId)

  return NextResponse.json({
    akta_pendirian_url: business.akta_pendirian_url ?? "",
    legalitas_url: business.legalitas_url ?? "",
    connect_score: scoreResult?.score ?? null,
    connect_score_tier: getConnectScoreTier(scoreResult?.score ?? null, {
      hasAkta: hasDocument(business.akta_pendirian_url as string | null),
      hasLegalitas: hasDocument(business.legalitas_url as string | null),
      isVerified: business.is_active === true,
    }),
  })
}

export async function PUT(request: NextRequest) {
  const session = await getUmkmSessionFromRequest(request)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const aktaUrl = parseDocumentUrl(body.akta_pendirian_url)
  const legalitasUrl = parseDocumentUrl(body.legalitas_url)

  if (aktaUrl === null || legalitasUrl === null) {
    return NextResponse.json({ error: "URL dokumen tidak valid" }, { status: 400 })
  }

  const existing = await sql`
    SELECT akta_pendirian_url, legalitas_url, is_active
    FROM businesses
    WHERE id = ${session.businessId}
  `

  if (existing.length === 0) {
    return NextResponse.json({ error: "Bisnis tidak ditemukan" }, { status: 404 })
  }

  const current = existing[0]
  const nextAkta = aktaUrl === undefined ? (current.akta_pendirian_url as string | null) : aktaUrl
  const nextLegalitas =
    legalitasUrl === undefined ? (current.legalitas_url as string | null) : legalitasUrl
  const aktaChanged = nextAkta !== (current.akta_pendirian_url as string | null)

  await sql`
    UPDATE businesses
    SET
      akta_pendirian_url = ${nextAkta},
      legalitas_url = ${nextLegalitas},
      akta_ocr_verified = CASE WHEN ${aktaChanged} THEN false ELSE akta_ocr_verified END,
      updated_at = NOW()
    WHERE id = ${session.businessId}
  `

  const updated = await sql`
    SELECT * FROM businesses WHERE id = ${session.businessId}
  `
  const scoreResult = await getOrUpdateScore(session.businessId, updated[0] as never)

  return NextResponse.json({
    success: true,
    akta_pendirian_url: nextAkta ?? "",
    legalitas_url: nextLegalitas ?? "",
    connect_score: scoreResult?.score ?? null,
    connect_score_tier: getConnectScoreTier(scoreResult?.score ?? null, {
      hasAkta: hasDocument(nextAkta),
      hasLegalitas: hasDocument(nextLegalitas),
      isVerified: updated[0].is_active === true,
    }),
  })
}
