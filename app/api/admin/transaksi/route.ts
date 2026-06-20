import { type NextRequest, NextResponse } from "next/server"
import { getAdminLocationScope } from "@/lib/auth"
import { isAdminResponse, requireAdmin } from "@/lib/auth/admin-api"
import { listTransactionsForAdmin } from "@/lib/transactions/transactions"
import {
  TRANSACTION_STATUS_LABELS,
  type TransactionStatus,
} from "@/types/transaction"

export async function GET(request: NextRequest) {
  const user = await requireAdmin(request)
  if (isAdminResponse(user)) return user

  const { searchParams } = new URL(request.url)
  const format = searchParams.get("format")
  const status = searchParams.get("status") || undefined
  const search = searchParams.get("search") || undefined
  const from = searchParams.get("from") || undefined
  const to = searchParams.get("to") || undefined
  const page = Number(searchParams.get("page") || "1")
  const limit = format === "csv" ? 10000 : Number(searchParams.get("limit") || "50")
  const offset = (page - 1) * limit

  const locationScope = await getAdminLocationScope(user)
  const { items, total } = await listTransactionsForAdmin({
    locationScope,
    status,
    search,
    from,
    to,
    limit,
    offset,
  })

  if (format === "csv") {
    const header = [
      "Reference",
      "Status",
      "Bisnis",
      "Pembeli",
      "WA Pembeli",
      "Kuantitas",
      "Catatan",
      "Total Invoice",
      "Kecamatan",
      "Kab/Kota",
      "Dibuat",
      "Invoice Dikirim",
      "Selesai",
    ].join(",")

    const rows = items.map((t) =>
      [
        t.referenceNo,
        TRANSACTION_STATUS_LABELS[t.status as TransactionStatus] || t.status,
        `"${(t.businessName || "").replace(/"/g, '""')}"`,
        `"${t.buyerName.replace(/"/g, '""')}"`,
        t.buyerPhone,
        t.quantity,
        `"${t.notes.replace(/"/g, '""')}"`,
        t.invoiceTotal ?? "",
        `"${(t.locationName || "").replace(/"/g, '""')}"`,
        `"${(t.kabupatenName || "").replace(/"/g, '""')}"`,
        t.createdAt,
        t.invoiceSentAt ?? "",
        t.completedAt ?? "",
      ].join(","),
    )

    const csv = [header, ...rows].join("\n")
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="transaksi-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    })
  }

  return NextResponse.json({ transactions: items, total, page, limit })
}
