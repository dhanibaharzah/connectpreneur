import { type NextRequest, NextResponse } from "next/server"
import { getValidToken } from "@/lib/transaction-tokens"
import { getTransactionById, formatCurrency } from "@/lib/transactions"
import { isDbConnectionError, sql, withDbRetry } from "@/lib/sql"

type RouteContext = { params: Promise<{ token: string }> }

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { token } = await context.params
    const record = await getValidToken(token, "buyer_invoice")
    if (!record) {
      return NextResponse.json({ error: "Invoice tidak ditemukan" }, { status: 404 })
    }

    const transaction = await withDbRetry(() => getTransactionById(record.transaction_id as number))
    if (!transaction || !transaction.invoiceTotal) {
      return NextResponse.json({ error: "Invoice belum tersedia" }, { status: 404 })
    }

    const [business] = await withDbRetry(async () => sql`
      SELECT nama, alamat, kota_provinsi, bank_name, bank_account_number, bank_account_name, logo_url
      FROM businesses WHERE id = ${transaction.businessId}
    `)

    return NextResponse.json({
      transaction,
      business,
      formatted_total: formatCurrency(transaction.invoiceTotal),
      invoice_url: `/invoice/${token}`,
    })
  } catch (error) {
    console.error("Invoice API error:", error)
    if (isDbConnectionError(error)) {
      return NextResponse.json(
        { error: "Koneksi database timeout. Silakan refresh halaman dalam beberapa detik." },
        { status: 503 },
      )
    }
    return NextResponse.json({ error: "Gagal memuat invoice" }, { status: 500 })
  }
}
