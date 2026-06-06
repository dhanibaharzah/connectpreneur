"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, LogOut, ShoppingBag, ExternalLink, Trophy } from "lucide-react"
import { BuyerBadge } from "@/components/buyer-badge"
import { ExpandableList, ExpandableListItem } from "@/components/expandable-list"
import { TransactionPagination } from "@/components/transaction-pagination"
import type { PaginationMeta } from "@/lib/pagination"
import { DEFAULT_TRANSACTION_PAGE_SIZE } from "@/lib/pagination"
import {
  TRANSACTION_STATUS_LABELS,
  type Transaction,
  type TransactionStatus,
} from "@/types/transaction"
import type { BuyerBadgeLevel, PointLedgerEntry } from "@/types/gamification"

type Step = "phone" | "otp" | "dashboard"

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

export default function PembeliPortalPage() {
  const [step, setStep] = useState<Step>("phone")
  const [phone, setPhone] = useState("")
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [totalPoints, setTotalPoints] = useState(0)
  const [badgeLevel, setBadgeLevel] = useState<BuyerBadgeLevel>("new")
  const [completedOrders, setCompletedOrders] = useState(0)
  const [transactions, setTransactions] = useState<TransactionWithLinks[]>([])
  const [points, setPoints] = useState<PointLedgerEntry[]>([])
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [txPage, setTxPage] = useState(1)
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    limit: DEFAULT_TRANSACTION_PAGE_SIZE,
    total: 0,
    totalPages: 0,
  })

  const loadDashboard = useCallback(async (page = 1) => {
    const [meRes, txRes, pointsRes] = await Promise.all([
      fetch("/api/pembeli/me", { credentials: "include" }),
      fetch(`/api/pembeli/transactions?page=${page}`, { credentials: "include" }),
      fetch("/api/pembeli/points", { credentials: "include" }),
    ])

    if (meRes.status === 401) {
      setStep("phone")
      return
    }

    const me = await meRes.json()
    const txData = await txRes.json()
    const pointsData = await pointsRes.json()

    setDisplayName(me.displayName || "")
    setTotalPoints(me.totalPoints ?? 0)
    setBadgeLevel(me.badgeLevel ?? "new")
    setCompletedOrders(me.completedOrders ?? 0)
    setTransactions(txData.transactions || [])
    setPagination(
      txData.pagination ?? {
        page,
        limit: DEFAULT_TRANSACTION_PAGE_SIZE,
        total: txData.transactions?.length ?? 0,
        totalPages: 1,
      },
    )
    setTxPage(page)
    setPoints(pointsData.points || [])
    setStep("dashboard")
  }, [])

  const changeTxPage = async (page: number) => {
    setLoading(true)
    setExpandedId(null)
    try {
      await loadDashboard(page)
    } catch {
      setStep("phone")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboard().catch(() => setStep("phone"))
  }, [loadDashboard])

  const requestOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/pembeli/otp/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setStep("otp")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal kirim OTP")
    } finally {
      setLoading(false)
    }
  }

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/pembeli/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ phone, otp }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      await loadDashboard()
    } catch (err) {
      setError(err instanceof Error ? err.message : "OTP tidak valid")
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    await fetch("/api/pembeli/logout", { method: "POST", credentials: "include" })
    setStep("phone")
    setPhone("")
    setOtp("")
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/images/logoconnectpreneur.png"
              alt="ConnectPreneur"
              width={140}
              height={36}
              className="h-9 w-auto"
            />
            <span className="text-sm font-medium text-muted-foreground hidden sm:inline">
              Portal Pembeli
            </span>
          </div>
          {step === "dashboard" && (
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4 mr-1" />
              Keluar
            </Button>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        {step === "phone" && (
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-primary" />
                <h1 className="text-xl font-bold">Masuk Portal Pembeli</h1>
              </div>
              <p className="text-sm text-muted-foreground">
                Masukkan nomor WhatsApp yang digunakan saat minta penawaran. Kode OTP akan dikirim
                via WhatsApp.
              </p>
              <form onSubmit={requestOtp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pembeli-phone">Nomor WhatsApp</Label>
                  <Input
                    id="pembeli-phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="08xxxxxxxxxx"
                    required
                  />
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Kirim OTP"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {step === "otp" && (
          <Card>
            <CardContent className="p-6 space-y-4">
              <h1 className="text-xl font-bold">Verifikasi OTP</h1>
              <p className="text-sm text-muted-foreground">Kode OTP dikirim ke {phone}</p>
              <form onSubmit={verifyOtp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pembeli-otp">Kode OTP</Label>
                  <Input
                    id="pembeli-otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="6 digit"
                    maxLength={6}
                    required
                  />
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verifikasi"}
                </Button>
                <Button type="button" variant="ghost" className="w-full" onClick={() => setStep("phone")}>
                  Ganti nomor
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {step === "dashboard" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold">{displayName || "Pembeli"}</h1>
              <p className="text-muted-foreground text-sm">Riwayat transaksi & poin reward</p>
            </div>

            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-primary" />
                    <h2 className="font-semibold">Poin & Badge</h2>
                  </div>
                  <BuyerBadge level={badgeLevel} size="md" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-muted/50 p-4">
                    <p className="text-xs text-muted-foreground">Total Poin</p>
                    <p className="text-2xl font-bold text-primary">{totalPoints}</p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-4">
                    <p className="text-xs text-muted-foreground">Pesanan Selesai</p>
                    <p className="text-2xl font-bold">{completedOrders}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  +50 poin per transaksi selesai. Badge Top Pembeli: ≥5 pesanan selesai atau ≥500
                  poin.
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
                        <span className="font-medium">Total:</span>{" "}
                        Rp {tx.invoiceTotal.toLocaleString("id-ID")}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {tx.invoiceUrl && (
                        <Button size="sm" variant="outline" asChild>
                          <a href={tx.invoiceUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Invoice
                          </a>
                        </Button>
                      )}
                      {tx.paymentUrl && tx.status !== "completed" && tx.status !== "rejected" && (
                        <Button size="sm" variant="outline" asChild>
                          <a href={tx.paymentUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Bayar / Upload Bukti
                          </a>
                        </Button>
                      )}
                    </div>
                  </ExpandableListItem>
                ))}
              </ExpandableList>
              <TransactionPagination
                pagination={pagination}
                onPageChange={changeTxPage}
                loading={loading}
              />
            </div>

            {points.length > 0 && (
              <div className="space-y-3">
                <h2 className="font-semibold">Riwayat Poin</h2>
                {points.map((entry) => (
                  <Card key={entry.id}>
                    <CardContent className="p-4 flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium text-green-700">+{entry.points} poin</p>
                        {entry.referenceNo && (
                          <p className="text-xs text-muted-foreground font-mono">{entry.referenceNo}</p>
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
        )}
      </main>
    </div>
  )
}
