import { type NextRequest, NextResponse } from "next/server"
import {
  getPembeliSessionFromRequest,
  getTransactionsForBuyerPaginated,
} from "@/lib/auth/pembeli-auth"
import { getOrCreateToken } from "@/lib/transactions/transaction-tokens"
import { appUrl } from "@/lib/shared/app-url"
import { buildPaginationMeta, parseTransactionPagination } from "@/lib/shared/pagination"

export async function GET(request: NextRequest) {
  const session = await getPembeliSessionFromRequest(request)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { page, limit, offset } = parseTransactionPagination(request.nextUrl.searchParams)
  const { items, total } = await getTransactionsForBuyerPaginated(session.phone, {
    limit,
    offset,
  })

  const withLinks = await Promise.all(
    items.map(async (tx) => {
      let invoiceUrl: string | null = null
      let paymentUrl: string | null = null

      if (tx.status !== "pending_review" && tx.status !== "rejected") {
        try {
          if (tx.invoiceSentAt) {
            const invoiceToken = await getOrCreateToken(tx.id, "buyer_invoice")
            invoiceUrl = appUrl(`/invoice/${invoiceToken}`)
          }
          if (["invoice_sent", "payment_proof_uploaded", "completed"].includes(tx.status)) {
            const paymentToken = await getOrCreateToken(tx.id, "buyer_payment")
            paymentUrl = appUrl(`/bayar/${paymentToken}`)
          }
        } catch {
          // token generation optional
        }
      }

      return { ...tx, invoiceUrl, paymentUrl }
    }),
  )

  return NextResponse.json({
    transactions: withLinks,
    pagination: buildPaginationMeta(page, limit, total),
  })
}
