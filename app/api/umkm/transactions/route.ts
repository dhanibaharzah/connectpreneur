import { type NextRequest, NextResponse } from "next/server"
import { getUmkmSessionFromRequest } from "@/lib/auth/umkm-auth"
import { getTransactionsForBusinessPaginated } from "@/lib/transactions/transactions"
import { buildPaginationMeta, parseTransactionPagination } from "@/lib/shared/pagination"

export async function GET(request: NextRequest) {
  const session = await getUmkmSessionFromRequest(request)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { page, limit, offset } = parseTransactionPagination(request.nextUrl.searchParams)
  const { items, total } = await getTransactionsForBusinessPaginated(session.businessId, {
    limit,
    offset,
  })

  return NextResponse.json({
    transactions: items,
    pagination: buildPaginationMeta(page, limit, total),
  })
}
