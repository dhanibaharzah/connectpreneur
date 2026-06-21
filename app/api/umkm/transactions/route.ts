import { type NextRequest, NextResponse } from "next/server"
import { getUmkmSessionFromRequest } from "@/lib/auth/umkm-auth"
import { getTransactionsForBusinessPaginated } from "@/lib/transactions/transactions"
import { getOrCreateToken } from "@/lib/transactions/transaction-tokens"
import { parseTransactionListFilters } from "@/lib/transactions/transaction-list-filters"
import { appUrl } from "@/lib/shared/app-url"
import { buildPaginationMeta } from "@/lib/shared/pagination"

export async function GET(request: NextRequest) {
  const session = await getUmkmSessionFromRequest(request)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { page, limit, offset, search, sort } = parseTransactionListFilters(
    request.nextUrl.searchParams,
  )
  const { items, total } = await getTransactionsForBusinessPaginated(session.businessId, {
    limit,
    offset,
    search,
    sort,
  })

  const withLinks = await Promise.all(
    items.map(async (tx) => {
      let invoiceUrl: string | null = null

      if (tx.invoiceSentAt) {
        try {
          const invoiceToken = await getOrCreateToken(tx.id, "buyer_invoice")
          invoiceUrl = appUrl(`/invoice/${invoiceToken}`)
        } catch {
          // token generation optional
        }
      }

      return { ...tx, invoiceUrl }
    }),
  )

  return NextResponse.json({
    transactions: withLinks,
    pagination: buildPaginationMeta(page, limit, total),
  })
}
