import { type NextRequest, NextResponse } from "next/server"
import { getPembeliSessionFromRequest } from "@/lib/auth/pembeli-auth"
import { getPointLedgerForBuyer } from "@/lib/umkm/gamification"

export async function GET(request: NextRequest) {
  const session = await getPembeliSessionFromRequest(request)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const points = await getPointLedgerForBuyer(session.phone)
  return NextResponse.json({ points })
}
