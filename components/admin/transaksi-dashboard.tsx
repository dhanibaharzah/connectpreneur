"use client"

import { useCallback, useEffect, useState } from "react"
import AdminShell, { getAdminAuthHeaders, type AdminUser } from "@/components/admin/admin-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Download, Search } from "lucide-react"
import {
  TRANSACTION_STATUSES,
  TRANSACTION_STATUS_LABELS,
  type Transaction,
  type TransactionStatus,
} from "@/types/transaction"

interface TransaksiDashboardProps {
  user: AdminUser
}

export default function TransaksiDashboard({ user }: TransaksiDashboardProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState("")
  const [search, setSearch] = useState("")
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [page, setPage] = useState(1)

  const fetchData = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), limit: "50" })
    if (status) params.set("status", status)
    if (search) params.set("search", search)
    if (from) params.set("from", from)
    if (to) params.set("to", to)

    const res = await fetch(`/api/admin/transaksi?${params}`, {
      credentials: "include",
      headers: getAdminAuthHeaders(),
    })
    const data = await res.json()
    setTransactions(data.transactions || [])
    setTotal(data.total || 0)
    setLoading(false)
  }, [page, status, search, from, to])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const exportCsv = async () => {
    const params = new URLSearchParams({ format: "csv" })
    if (status) params.set("status", status)
    if (search) params.set("search", search)
    if (from) params.set("from", from)
    if (to) params.set("to", to)

    const res = await fetch(`/api/admin/transaksi?${params}`, {
      credentials: "include",
      headers: getAdminAuthHeaders(),
    })
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `transaksi-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <AdminShell user={user}>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Transaksi</h1>
            <p className="text-muted-foreground text-sm">Monitoring permintaan penawaran (read-only)</p>
          </div>
          <Button variant="outline" size="sm" onClick={exportCsv}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>

        <Card>
          <CardContent className="p-4 flex flex-wrap gap-3">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input className="pl-9" placeholder="Cari ref, pembeli, bisnis..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} />
            </div>
            <select className="border rounded-md px-3 py-2 text-sm bg-background" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1) }}>
              <option value="">Semua Status</option>
              {TRANSACTION_STATUSES.map((s) => (
                <option key={s} value={s}>{TRANSACTION_STATUS_LABELS[s]}</option>
              ))}
            </select>
            <Input type="date" value={from} onChange={(e) => { setFrom(e.target.value); setPage(1) }} className="w-auto" />
            <Input type="date" value={to} onChange={(e) => { setTo(e.target.value); setPage(1) }} className="w-auto" />
          </CardContent>
        </Card>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : transactions.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">Belum ada transaksi.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border bg-white">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-3 font-medium">Ref</th>
                  <th className="text-left p-3 font-medium">Bisnis</th>
                  <th className="text-left p-3 font-medium">Pembeli</th>
                  <th className="text-left p-3 font-medium">Lokasi</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-right p-3 font-medium">Total</th>
                  <th className="text-left p-3 font-medium">Tanggal</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id} className="border-t">
                    <td className="p-3 font-mono text-xs">{tx.referenceNo}</td>
                    <td className="p-3">{tx.businessName}</td>
                    <td className="p-3">
                      <div>{tx.buyerName}</div>
                      <div className="text-xs text-muted-foreground">{tx.buyerPhone}</div>
                    </td>
                    <td className="p-3 text-xs">
                      <div>{tx.locationName || "-"}</div>
                      <div className="text-muted-foreground">{tx.kabupatenName || ""}</div>
                    </td>
                    <td className="p-3">
                      <Badge variant="secondary">
                        {TRANSACTION_STATUS_LABELS[tx.status as TransactionStatus]}
                      </Badge>
                    </td>
                    <td className="p-3 text-right">
                      {tx.invoiceTotal != null ? `Rp ${tx.invoiceTotal.toLocaleString("id-ID")}` : "-"}
                    </td>
                    <td className="p-3 text-xs text-muted-foreground">
                      {new Date(tx.createdAt).toLocaleDateString("id-ID")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {total > 50 && (
          <div className="flex justify-center gap-2">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Sebelumnya</Button>
            <span className="text-sm text-muted-foreground self-center">Halaman {page}</span>
            <Button variant="outline" size="sm" disabled={page * 50 >= total} onClick={() => setPage((p) => p + 1)}>Berikutnya</Button>
          </div>
        )}
      </div>
    </AdminShell>
  )
}
