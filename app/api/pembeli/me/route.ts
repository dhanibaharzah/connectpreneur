import { type NextRequest, NextResponse } from "next/server"
import { getPembeliSessionFromRequest } from "@/lib/pembeli-auth"
import { getOrCreateBuyerProfileFromTransactions } from "@/lib/gamification"

export async function GET(request: NextRequest) {
  const session = await getPembeliSessionFromRequest(request)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const profile = await getOrCreateBuyerProfileFromTransactions(session.phone)

  return NextResponse.json({
    phone: session.phone,
    displayName: profile.displayName ?? session.displayName,
    totalPoints: profile.totalPoints,
    badgeLevel: profile.badgeLevel,
    completedOrders: profile.completedOrders,
  })
}
