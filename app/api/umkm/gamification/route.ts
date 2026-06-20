import { type NextRequest, NextResponse } from "next/server"
import { getUmkmSessionFromRequest } from "@/lib/auth/umkm-auth"
import { getBusinessGamificationStats } from "@/lib/umkm/gamification"

export async function GET(request: NextRequest) {
  const session = await getUmkmSessionFromRequest(request)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const stats = await getBusinessGamificationStats(session.businessId)
  if (!stats) {
    return NextResponse.json({ error: "Bisnis tidak ditemukan" }, { status: 404 })
  }

  return NextResponse.json(stats)
}
