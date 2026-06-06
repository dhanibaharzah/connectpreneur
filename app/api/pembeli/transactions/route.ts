import { type NextRequest, NextResponse } from "next/server"
import { findTransactionsByPhone, getPembeliSessionFromRequest } from "@/lib/pembeli-auth"
import { getOrCreateToken } from "@/lib/transaction-tokens"
import { appUrl } from "@/lib/app-url"

export async function GET(request: NextRequest) {
  const session = await getPembeliSessionFromRequest(request)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const transactions = await findTransactionsByPhone(session.phone)

  const withLinks = await Promise.all(
    transactions.map(async (tx) => {
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

  return NextResponse.json({ transactions: withLinks })
}
