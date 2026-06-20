import { NextResponse } from "next/server"
import {
  getTransactionsDueForAutoReminder,
  markAutoReminderSent,
} from "@/lib/transactions/transactions"
import { getOrCreateToken } from "@/lib/transactions/transaction-tokens"
import { appUrl } from "@/lib/shared/app-url"
import { sendPaymentReminderToBuyer } from "@/lib/integrations/gowa"
import { sql } from "@/lib/sql"

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization")
  const cronSecret = process.env.CRON_SECRET

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const due = await getTransactionsDueForAutoReminder()
    let sent = 0

    for (const transaction of due) {
      if (transaction.status !== "invoice_sent") continue

      const [business] = await sql`SELECT nama FROM businesses WHERE id = ${transaction.businessId}`
      const paymentToken = await getOrCreateToken(transaction.id, "buyer_payment")
      const paymentUrl = appUrl(`/bayar/${paymentToken}`)

      try {
        await sendPaymentReminderToBuyer({
          phone: transaction.buyerPhone,
          buyerName: transaction.buyerName,
          businessName: (business?.nama as string) || "UMKM",
          referenceNo: transaction.referenceNo,
          paymentUrl,
        })
        await markAutoReminderSent(transaction.id)
        sent++
      } catch (err) {
        console.error(`Auto reminder failed for ${transaction.referenceNo}:`, err)
      }
    }

    return NextResponse.json({ success: true, processed: due.length, sent })
  } catch (error) {
    console.error("Cron payment reminders error:", error)
    return NextResponse.json({ error: "Cron failed" }, { status: 500 })
  }
}
