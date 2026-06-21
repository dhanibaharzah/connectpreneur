"use client"

import { useCallback, useEffect, useState } from "react"
import { Loader2, LogOut, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BuyerBadge } from "@/components/shared/buyer-badge"
import { TransactionPagination } from "@/components/shared/transaction-pagination"
import { usePembeliAuth } from "@/components/pembeli/pembeli-auth-context"
import type { PaginationMeta } from "@/lib/shared/pagination"
import { DEFAULT_TRANSACTION_PAGE_SIZE } from "@/lib/shared/pagination"
import type { PointLedgerEntry } from "@/types/gamification"

interface PembeliPointsHistoryProps {
  onLogout?: () => void
}

export function PembeliPointsHistory({ onLogout }: PembeliPointsHistoryProps) {
  const { user, logout } = usePembeliAuth()
  const [loading, setLoading] = useState(true)
  const [points, setPoints] = useState<PointLedgerEntry[]>([])
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    limit: DEFAULT_TRANSACTION_PAGE_SIZE,
    total: 0,
    totalPages: 0,
  })

  const loadPoints = useCallback(async (page = 1) => {
    const res = await fetch(`/api/pembeli/points?page=${page}`, { credentials: "include" })
    if (res.status === 401) {
      throw new Error("Unauthorized")
    }
    const data = await res.json()
    setPoints(data.points || [])
    setPagination(
      data.pagination ?? {
        page,
        limit: DEFAULT_TRANSACTION_PAGE_SIZE,
        total: data.points?.length ?? 0,
        totalPages: 1,
      },
    )
  }, [])

  useEffect(() => {
    loadPoints()
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [loadPoints])

  const changePage = async (page: number) => {
    setLoading(true)
    try {
      await loadPoints(page)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    onLogout?.()
  }

  if (!user) return null

  if (loading && points.length === 0) {
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
          <h1 className="text-2xl font-bold">Riwayat Poin</h1>
          <p className="text-sm text-muted-foreground">
            Lacak poin reward dari transaksi yang selesai
          </p>
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
              <h2 className="font-semibold">Ringkasan Poin</h2>
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
        <h2 className="font-semibold">Riwayat ({pagination.total})</h2>
        {points.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-sm text-muted-foreground">
              Belum ada riwayat poin. Poin akan masuk setelah transaksi selesai dikonfirmasi mitra.
            </CardContent>
          </Card>
        ) : (
          points.map((entry) => (
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
          ))
        )}
        <TransactionPagination
          pagination={pagination}
          onPageChange={changePage}
          loading={loading}
          itemLabel="riwayat poin"
        />
      </div>
    </div>
  )
}
