import { type NextRequest, NextResponse } from "next/server"
import { getPembeliSessionFromRequest } from "@/lib/auth/pembeli-auth"
import { getPointLedgerForBuyerPaginated } from "@/lib/umkm/gamification"
import { buildPaginationMeta, parseTransactionPagination } from "@/lib/shared/pagination"

export async function GET(request: NextRequest) {
  const session = await getPembeliSessionFromRequest(request)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { page, limit, offset } = parseTransactionPagination(request.nextUrl.searchParams)
  const { items, total } = await getPointLedgerForBuyerPaginated(session.phone, {
    limit,
    offset,
  })

  return NextResponse.json({
    points: items,
    pagination: buildPaginationMeta(page, limit, total),
  })
}
