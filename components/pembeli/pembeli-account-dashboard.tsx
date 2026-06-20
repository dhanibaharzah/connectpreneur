"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { ExternalLink, Loader2, LogOut, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BuyerBadge } from "@/components/shared/buyer-badge"
import { ExpandableList, ExpandableListItem } from "@/components/shared/expandable-list"
import { TransactionPagination } from "@/components/shared/transaction-pagination"
import { usePembeliAuth } from "@/components/pembeli/pembeli-auth-context"
import type { PaginationMeta } from "@/lib/shared/pagination"
import { DEFAULT_TRANSACTION_PAGE_SIZE } from "@/lib/shared/pagination"
import {
  TRANSACTION_STATUS_LABELS,
  type Transaction,
  type TransactionStatus,
} from "@/types/transaction"
import type { PointLedgerEntry } from "@/types/gamification"

type TransactionWithLinks = Transaction & {
  invoiceUrl?: string | null
  paymentUrl?: string | null
}

const STATUS_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  pending_review: "secondary",
  approved: "default",
  invoice_sent: "outline",
  payment_proof_uploaded: "default",
  completed: "default",
  rejected: "destructive",
  cancelled: "destructive",
}

interface PembeliAccountDashboardProps {
  onLogout?: () => void
}

export function PembeliAccountDashboard({ onLogout }: PembeliAccountDashboardProps) {
  const { user, logout } = usePembeliAuth()
  const [loading, setLoading] = useState(true)
  const [transactions, setTransactions] = useState<TransactionWithLinks[]>([])
  const [points, setPoints] = useState<PointLedgerEntry[]>([])
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    limit: DEFAULT_TRANSACTION_PAGE_SIZE,
    total: 0,
    totalPages: 0,
  })

  const loadDashboard = useCallback(async (page = 1) => {
    const [txRes, pointsRes] = await Promise.all([
      fetch(`/api/pembeli/transactions?page=${page}`, { credentials: "include" }),
      fetch("/api/pembeli/points", { credentials: "include" }),
    ])

    if (txRes.status === 401) {
      throw new Error("Unauthorized")
    }

    const txData = await txRes.json()
    const pointsData = await pointsRes.json()

    setTransactions(txData.transactions || [])
    setPagination(
      txData.pagination ?? {
        page,
        limit: DEFAULT_TRANSACTION_PAGE_SIZE,
        total: txData.transactions?.length ?? 0,
        totalPages: 1,
      },
    )
    setPoints(pointsData.points || [])
  }, [])

  useEffect(() => {
    loadDashboard()
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [loadDashboard])

  const changeTxPage = async (page: number) => {
    setLoading(true)
    setExpandedId(null)
    try {
      await loadDashboard(page)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    onLogout?.()
  }

  if (!user) return null

  if (loading && transactions.length === 0) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">{user.displayName || "Pembeli"}</h1>
          <p className="text-sm text-muted-foreground">Riwayat transaksi & poin reward</p>
        </div>
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          <LogOut className="mr-1 h-4 w-4" />
          Keluar
        </Button>
      </div>

      <Card>
        <CardContent className="space-y-4 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              <h2 className="font-semibold">Poin & Badge</h2>
            </div>
            <BuyerBadge level={user.badgeLevel} size="md" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-muted/50 p-4">
              <p className="text-xs text-muted-foreground">Total Poin</p>
              <p className="text-2xl font-bold text-primary">{user.totalPoints}</p>
            </div>
            <div className="rounded-lg bg-muted/50 p-4">
              <p className="text-xs text-muted-foreground">Pesanan Selesai</p>
              <p className="text-2xl font-bold">{user.completedOrders}</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            +50 poin per transaksi selesai. Badge Top Pembeli: ≥5 pesanan selesai atau ≥500 poin.
          </p>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <h2 className="font-semibold">Transaksi ({pagination.total})</h2>
        <ExpandableList isEmpty={transactions.length === 0} emptyMessage="Belum ada transaksi.">
          {transactions.map((tx) => (
            <ExpandableListItem
              key={tx.id}
              open={expandedId === tx.id}
              onToggle={() => setExpandedId(expandedId === tx.id ? null : tx.id)}
              title={tx.businessName || tx.referenceNo}
              subtitle={tx.businessName ? tx.referenceNo : undefined}
              trailing={
                <>
                  {tx.invoiceTotal != null && (
                    <span className="hidden text-xs font-medium text-foreground sm:inline">
                      Rp {tx.invoiceTotal.toLocaleString("id-ID")}
                    </span>
                  )}
                  <Badge variant={STATUS_VARIANT[tx.status] || "secondary"} className="shrink-0">
                    {TRANSACTION_STATUS_LABELS[tx.status as TransactionStatus]}
                  </Badge>
                </>
              }
            >
              {tx.businessName && tx.businessSlug && (
                <Link
                  href={`/bisnis/${tx.businessSlug}`}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  {tx.businessName}
                </Link>
              )}
              {tx.invoiceTotal != null && (
                <p className="text-sm">
                  <span className="font-medium">Total:</span> Rp{" "}
                  {tx.invoiceTotal.toLocaleString("id-ID")}
                </p>
              )}
              <div className="flex flex-wrap gap-2">
                {tx.invoiceUrl && (
                  <Button size="sm" variant="outline" asChild>
                    <a href={tx.invoiceUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-1 h-3 w-3" />
                      Invoice
                    </a>
                  </Button>
                )}
                {tx.paymentUrl && tx.status !== "completed" && tx.status !== "rejected" && (
                  <Button size="sm" variant="outline" asChild>
                    <a href={tx.paymentUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-1 h-3 w-3" />
                      Bayar / Upload Bukti
                    </a>
                  </Button>
                )}
              </div>
            </ExpandableListItem>
          ))}
        </ExpandableList>
        <TransactionPagination pagination={pagination} onPageChange={changeTxPage} loading={loading} />
      </div>

      {points.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-semibold">Riwayat Poin</h2>
          {points.map((entry) => (
            <Card key={entry.id}>
              <CardContent className="flex flex-wrap items-center justify-between gap-2 p-4">
                <div>
                  <p className="text-sm font-medium text-green-700">+{entry.points} poin</p>
                  {entry.referenceNo && (
                    <p className="font-mono text-xs text-muted-foreground">{entry.referenceNo}</p>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {new Date(entry.createdAt).toLocaleDateString("id-ID")}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
