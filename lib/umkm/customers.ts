import { sql } from "@/lib/sql"

export interface UmkmCustomer {
  buyerPhone: string
  buyerName: string
  transactionCount: number
  lastTransactionAt: string | null
  totalAmount: number
}

export async function getCompletedCustomersForBusiness(businessId: number): Promise<UmkmCustomer[]> {
  const rows = await sql`
    SELECT
      buyer_phone,
      TRIM(buyer_name) AS buyer_name,
      COUNT(*)::int AS transaction_count,
      MAX(completed_at) AS last_transaction_at,
      COALESCE(SUM(invoice_total), 0)::numeric AS total_amount
    FROM transactions
    WHERE business_id = ${businessId}
      AND status = 'completed'
      AND buyer_phone IS NOT NULL
      AND TRIM(buyer_phone) <> ''
    GROUP BY buyer_phone, TRIM(buyer_name)
    ORDER BY MAX(completed_at) DESC NULLS LAST, TRIM(buyer_name) ASC, buyer_phone ASC
  `

  return rows.map((row) => ({
    buyerPhone: String(row.buyer_phone),
    buyerName: String(row.buyer_name ?? ""),
    transactionCount: Number(row.transaction_count),
    lastTransactionAt: row.last_transaction_at ? String(row.last_transaction_at) : null,
    totalAmount: Number(row.total_amount),
  }))
}
