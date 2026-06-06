"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Loader2,
  LogOut,
  Bell,
  Check,
  X,
  FileText,
  Building2,
  Trophy,
  Settings,
  ArrowLeft,
} from "lucide-react"
import { ExpandableList, ExpandableListItem } from "@/components/expandable-list"
import { TransactionPagination } from "@/components/transaction-pagination"
import { UmkmStoreQrCard } from "@/components/umkm-store-qr-card"
import { UmkmTrustBadge } from "@/components/umkm-trust-badge"
import type { PaginationMeta } from "@/lib/pagination"
import { DEFAULT_TRANSACTION_PAGE_SIZE } from "@/lib/pagination"
import type { TrustTier } from "@/types/gamification"
import {
  TRANSACTION_STATUS_LABELS,
  type Transaction,
  type TransactionStatus,
} from "@/types/transaction"

type Step = "phone" | "otp" | "dashboard"
type DashboardTab = "transactions" | "settings"

const STATUS_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  pending_review: "secondary",
  approved: "default",
  invoice_sent: "outline",
  payment_proof_uploaded: "default",
  completed: "default",
  rejected: "destructive",
  cancelled: "destructive",
}

export default function UmkmPortalPage() {
  const [step, setStep] = useState<Step>("phone")
  const [dashboardTab, setDashboardTab] = useState<DashboardTab>("transactions")
  const [phone, setPhone] = useState("")
  const [otp, setOtp] = useState("")
  const [businessId, setBusinessId] = useState<number | null>(null)
  const [businessName, setBusinessName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [bank, setBank] = useState({ bank_name: "", bank_account_number: "", bank_account_name: "" })
  const [bankSaved, setBankSaved] = useState(false)
  const [bankMessage, setBankMessage] = useState("")
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [rejectingId, setRejectingId] = useState<number | null>(null)
  const [invoiceEditId, setInvoiceEditId] = useState<number | null>(null)
  const [invoiceForm, setInvoiceForm] = useState({ description: "", quantity: "1", unit_price: "" })
  const [rejectReason, setRejectReason] = useState("")
  const [gamification, setGamification] = useState({
    totalPoints: 0,
    completedOrders: 0,
    trustTier: null as string | null,
  })
  const [txPage, setTxPage] = useState(1)
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    limit: DEFAULT_TRANSACTION_PAGE_SIZE,
    total: 0,
    totalPages: 0,
  })

  const loadDashboard = useCallback(async (page = 1) => {
    const [txRes, bankRes, gamRes] = await Promise.all([
      fetch(`/api/umkm/transactions?page=${page}`, { credentials: "include" }),
      fetch("/api/umkm/bank", { credentials: "include" }),
      fetch("/api/umkm/gamification", { credentials: "include" }),
    ])

    if (txRes.status === 401) {
      setStep("phone")
      return
    }

    const txData = await txRes.json()
    const bankData = await bankRes.json()
    if (gamRes.ok) {
      const gamData = await gamRes.json()
      setGamification({
        totalPoints: gamData.totalPoints ?? 0,
        completedOrders: gamData.completedOrders ?? 0,
        trustTier: gamData.trustTier ?? null,
      })
    }
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
    setBank({
      bank_name: bankData.bank_name || "",
      bank_account_number: bankData.bank_account_number || "",
      bank_account_name: bankData.bank_account_name || "",
    })
    const hasBank =
      Boolean(bankData.bank_name?.trim()) &&
      Boolean(bankData.bank_account_number?.trim()) &&
      Boolean(bankData.bank_account_name?.trim())
    setBankSaved(hasBank)
    setStep("dashboard")
  }, [])

  useEffect(() => {
    loadDashboard().catch(() => setStep("phone"))
  }, [loadDashboard])

  const requestOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/umkm/otp/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, business_id: businessId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setBusinessId(data.business_id)
      setBusinessName(data.business_name)
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
      const res = await fetch("/api/umkm/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ phone, otp, business_id: businessId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setBusinessName(data.business.nama)
      await loadDashboard(txPage)
    } catch (err) {
      setError(err instanceof Error ? err.message : "OTP tidak valid")
    } finally {
      setLoading(false)
    }
  }

  const persistBank = async (): Promise<boolean> => {
    if (!bank.bank_name.trim() || !bank.bank_account_number.trim() || !bank.bank_account_name.trim()) {
      setError("Semua field rekening bank harus diisi")
      return false
    }
    const res = await fetch("/api/umkm/bank", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(bank),
    })
    const data = await res.json()
    if (!res.ok) {
      setError(data.error || "Gagal simpan rekening")
      return false
    }
    setBankSaved(true)
    return true
  }

  const saveBank = async (): Promise<boolean> => {
    setLoading(true)
    setError("")
    setBankMessage("")
    try {
      const ok = await persistBank()
      if (ok) setBankMessage("Rekening bank berhasil disimpan.")
      return ok
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal simpan rekening")
      setBankSaved(false)
      return false
    } finally {
      setLoading(false)
    }
  }

  const sendInvoice = async (txId: number) => {
    setLoading(true)
    setError("")
    setBankMessage("")

    try {
      if (!bankSaved) {
        setError("Lengkapi rekening bank di Pengaturan terlebih dahulu.")
        setDashboardTab("settings")
        return
      }

      const res = await fetch(`/api/umkm/transactions/${txId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          action: "invoice",
          description: invoiceForm.description,
          quantity: Number(invoiceForm.quantity),
          unit_price: Number(invoiceForm.unit_price),
          bank,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      await loadDashboard(txPage)
      closeTransactionPanel()
      setInvoiceForm({ description: "", quantity: "1", unit_price: "" })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal kirim invoice")
    } finally {
      setLoading(false)
    }
  }

  const toggleTransaction = (id: number) => {
    if (expandedId === id) {
      setExpandedId(null)
      setRejectingId(null)
      setInvoiceEditId(null)
    } else {
      setExpandedId(id)
      setRejectingId(null)
      setInvoiceEditId(null)
    }
  }

  const closeTransactionPanel = () => {
    setExpandedId(null)
    setRejectingId(null)
    setInvoiceEditId(null)
  }

  const changeTxPage = async (page: number) => {
    setLoading(true)
    setError("")
    closeTransactionPanel()
    try {
      await loadDashboard(page)
    } catch {
      setStep("phone")
    } finally {
      setLoading(false)
    }
  }
  const action = async (id: number, actionName: string, extra?: Record<string, unknown>) => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch(`/api/umkm/transactions/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ action: actionName, ...extra }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      await loadDashboard(txPage)
      closeTransactionPanel()
      setInvoiceForm({ description: "", quantity: "1", unit_price: "" })
      setRejectReason("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Aksi gagal")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/images/logoconnectpreneur.png" alt="ConnectPreneur" width={140} height={36} className="h-9 w-auto" />
            <span className="text-sm font-medium text-muted-foreground hidden sm:inline">Portal UMKM</span>
          </div>
          {step === "dashboard" && (
            <div className="flex items-center gap-1">
              {dashboardTab === "transactions" && (
                <Button variant="ghost" size="sm" onClick={() => { setError(""); setBankMessage(""); setDashboardTab("settings") }}>
                  <Settings className="h-4 w-4 mr-1" />
                  Pengaturan
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={() => { document.cookie = "umkm_session=; Max-Age=0; path=/"; setStep("phone"); setDashboardTab("transactions") }}>
                <LogOut className="h-4 w-4 mr-1" />
                Keluar
              </Button>
            </div>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        {step === "phone" && (
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                <h1 className="text-xl font-bold">Masuk Portal UMKM</h1>
              </div>
              <p className="text-sm text-muted-foreground">
                Masukkan nomor WhatsApp PIC yang terdaftar. Kode OTP akan dikirim via WhatsApp.
              </p>
              <form onSubmit={requestOtp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="umkm-phone">Nomor WhatsApp</Label>
                  <Input id="umkm-phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="08xxxxxxxxxx" required />
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
                  <Label htmlFor="umkm-otp">Kode OTP</Label>
                  <Input id="umkm-otp" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="6 digit" maxLength={6} required />
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

        {step === "dashboard" && dashboardTab === "settings" && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" className="-ml-2" onClick={() => { setError(""); setBankMessage(""); setDashboardTab("transactions") }}>
                <ArrowLeft className="h-4 w-4 mr-1" />
                Transaksi
              </Button>
            </div>
            <div>
              <h1 className="text-2xl font-bold">Pengaturan</h1>
              <p className="text-muted-foreground text-sm">{businessName}</p>
            </div>

            <Card>
              <CardContent className="p-6 space-y-4">
                <h2 className="font-semibold">Rekening Bank</h2>
                <p className="text-xs text-muted-foreground">
                  Rekening untuk menerima pembayaran pembeli. Wajib diisi sebelum menerbitkan invoice.
                </p>
                <div className="grid gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="bank-name">Nama Bank</Label>
                    <Input
                      id="bank-name"
                      placeholder="Contoh: BCA"
                      value={bank.bank_name}
                      onChange={(e) => { setBank({ ...bank, bank_name: e.target.value }); setBankSaved(false) }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bank-number">No. Rekening</Label>
                    <Input
                      id="bank-number"
                      placeholder="1234567890"
                      value={bank.bank_account_number}
                      onChange={(e) => { setBank({ ...bank, bank_account_number: e.target.value }); setBankSaved(false) }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bank-holder">Atas Nama</Label>
                    <Input
                      id="bank-holder"
                      placeholder="Nama pemilik rekening"
                      value={bank.bank_account_name}
                      onChange={(e) => { setBank({ ...bank, bank_account_name: e.target.value }); setBankSaved(false) }}
                    />
                  </div>
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                {bankMessage && <p className="text-sm text-green-700">{bankMessage}</p>}
                <Button onClick={saveBank} disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Simpan Rekening"}
                </Button>
              </CardContent>
            </Card>

            <UmkmStoreQrCard />
          </div>
        )}

        {step === "dashboard" && dashboardTab === "transactions" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold">{businessName}</h1>
              <p className="text-muted-foreground text-sm">Kelola permintaan penawaran & transaksi</p>
            </div>

            <Card>
              <CardContent className="p-6 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-primary" />
                    <h2 className="font-semibold">Poin & Trust Badge</h2>
                  </div>
                  {gamification.trustTier && (
                    <UmkmTrustBadge tier={gamification.trustTier as TrustTier} size="md" />
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-muted/50 p-4">
                    <p className="text-xs text-muted-foreground">Total Poin</p>
                    <p className="text-2xl font-bold text-primary">{gamification.totalPoints}</p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-4">
                    <p className="text-xs text-muted-foreground">Pesanan Selesai</p>
                    <p className="text-2xl font-bold">{gamification.completedOrders}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  +50 poin per transaksi dikonfirmasi. Trust badge naik otomatis berdasarkan
                  performa pesanan.
                </p>
              </CardContent>
            </Card>

            {!bankSaved && (
              <Card className="border-amber-200 bg-amber-50/50">
                <CardContent className="p-6 space-y-4">
                  <h2 className="font-semibold">Lengkapi Rekening Bank</h2>
                  <p className="text-sm text-muted-foreground">
                    Rekening bank wajib diisi sebelum Anda dapat menerbitkan invoice ke pembeli.
                  </p>
                  <Button onClick={() => setDashboardTab("settings")}>
                    <Settings className="h-4 w-4 mr-1" />
                    Atur Rekening Bank
                  </Button>
                </CardContent>
              </Card>
            )}

            {error && <p className="text-sm text-destructive">{error}</p>}

            <div className="space-y-3">
              <h2 className="font-semibold">Transaksi ({pagination.total})</h2>
              <ExpandableList isEmpty={transactions.length === 0} emptyMessage="Belum ada permintaan penawaran.">
                {transactions.map((tx) => (
                  <ExpandableListItem
                    key={tx.id}
                    open={expandedId === tx.id}
                    onToggle={() => toggleTransaction(tx.id)}
                    title={tx.buyerName}
                    subtitle={tx.referenceNo}
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
                    <div className="space-y-1 text-sm">
                      <p className="text-muted-foreground">{tx.buyerPhone}</p>
                      {tx.notes && (
                        <p><span className="font-medium">Catatan:</span> {tx.notes}</p>
                      )}
                      {tx.quantity > 0 && (
                        <p><span className="font-medium">Kuantitas:</span> {tx.quantity}</p>
                      )}
                      {tx.invoiceTotal != null && (
                        <p className="font-medium sm:hidden">
                          Total: Rp {tx.invoiceTotal.toLocaleString("id-ID")}
                        </p>
                      )}
                    </div>

                    {tx.status === "pending_review" && (
                      <div className="flex flex-wrap gap-2">
                        <Button size="sm" onClick={() => action(tx.id, "approve")} disabled={loading}>
                          <Check className="h-4 w-4 mr-1" /> Setujui
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            setExpandedId(tx.id)
                            setRejectingId(rejectingId === tx.id ? null : tx.id)
                            setInvoiceEditId(null)
                          }}
                          disabled={loading}
                        >
                          <X className="h-4 w-4 mr-1" /> Tolak
                        </Button>
                      </div>
                    )}

                    {rejectingId === tx.id && tx.status === "pending_review" && (
                      <div className="space-y-2">
                        <Textarea
                          placeholder="Alasan penolakan (opsional)"
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          rows={2}
                        />
                        <div className="flex gap-2">
                          <Button size="sm" variant="destructive" onClick={() => action(tx.id, "reject", { reason: rejectReason })} disabled={loading}>
                            Konfirmasi Tolak
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => setRejectingId(null)} disabled={loading}>
                            Batal
                          </Button>
                        </div>
                      </div>
                    )}

                    {tx.status === "approved" && (
                      <div className="space-y-2">
                        {invoiceEditId !== tx.id ? (
                          <Button
                            size="sm"
                            onClick={() => {
                              setExpandedId(tx.id)
                              setInvoiceEditId(tx.id)
                              setRejectingId(null)
                              setInvoiceForm({ description: "", quantity: "1", unit_price: "" })
                            }}
                            disabled={loading}
                          >
                            <FileText className="h-4 w-4 mr-1" /> Buat Invoice
                          </Button>
                        ) : (
                          <>
                            <p className="text-sm font-medium">Terbitkan Invoice</p>
                            <Input placeholder="Deskripsi item" value={invoiceForm.description} onChange={(e) => setInvoiceForm({ ...invoiceForm, description: e.target.value })} />
                            <div className="grid grid-cols-2 gap-2">
                              <Input type="number" min={1} placeholder="Qty" value={invoiceForm.quantity} onChange={(e) => setInvoiceForm({ ...invoiceForm, quantity: e.target.value })} />
                              <Input type="number" min={1} placeholder="Harga satuan (Rp)" value={invoiceForm.unit_price} onChange={(e) => setInvoiceForm({ ...invoiceForm, unit_price: e.target.value })} />
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" onClick={() => sendInvoice(tx.id)} disabled={loading}>
                                Kirim Invoice
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => setInvoiceEditId(null)} disabled={loading}>
                                Batal
                              </Button>
                            </div>
                          </>
                        )}
                      </div>
                    )}

                    {tx.status === "invoice_sent" && (
                      <div className="space-y-2">
                        {tx.invoiceTotal != null && (
                          <p className="text-sm font-medium">
                            Total: Rp {tx.invoiceTotal.toLocaleString("id-ID")}
                          </p>
                        )}
                        <Button size="sm" variant="outline" onClick={() => action(tx.id, "remind")} disabled={loading}>
                          <Bell className="h-4 w-4 mr-1" /> Kirim Reminder Bayar
                        </Button>
                      </div>
                    )}

                    {tx.status === "payment_proof_uploaded" && (
                      <div className="flex flex-col gap-3">
                        {tx.invoiceTotal != null && (
                          <p className="text-sm font-medium">
                            Total: Rp {tx.invoiceTotal.toLocaleString("id-ID")}
                          </p>
                        )}
                        {tx.paymentProofUrl && (
                          <a
                            href={tx.paymentProofUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex w-fit items-center text-sm text-primary underline underline-offset-2"
                          >
                            Lihat bukti transfer
                          </a>
                        )}
                        <Button
                          size="sm"
                          className="w-fit"
                          onClick={() => action(tx.id, "confirm_payment")}
                          disabled={loading}
                        >
                          <Check className="h-4 w-4 mr-1" /> Konfirmasi Pembayaran
                        </Button>
                      </div>
                    )}

                    {tx.invoiceTotal != null &&
                      tx.status !== "pending_review" &&
                      tx.status !== "approved" &&
                      tx.status !== "invoice_sent" &&
                      tx.status !== "payment_proof_uploaded" && (
                      <p className="text-sm font-medium">
                        Total: Rp {tx.invoiceTotal.toLocaleString("id-ID")}
                      </p>
                    )}
                  </ExpandableListItem>
                ))}
              </ExpandableList>
              <TransactionPagination
                pagination={pagination}
                onPageChange={changeTxPage}
                loading={loading}
              />
            </div>

            <Link href="/katalog" className="text-sm text-muted-foreground hover:text-primary">
              ← Kembali ke Katalog
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
