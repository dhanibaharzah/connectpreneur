"use client"

import { useCallback, useEffect, useRef, useState } from "react"
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
  Settings,
  ArrowLeft,
  Package,
  Users,
} from "lucide-react"
import { UmkmAuthSteps } from "@/components/umkm/umkm-auth-steps"
import { UmkmTransactionsPanel } from "@/components/umkm/umkm-transactions-panel"
import { UmkmProductsPanel } from "@/components/umkm/umkm-products-panel"
import { UmkmCustomersPanel } from "@/components/umkm/umkm-customers-panel"
import { UmkmLegalitasPanel } from "@/components/umkm/umkm-legalitas-panel"
import { UmkmStoreQrCard } from "@/components/umkm/umkm-store-qr-card"
import type { PaginationMeta } from "@/lib/shared/pagination"
import { DEFAULT_TRANSACTION_PAGE_SIZE } from "@/lib/shared/pagination"
import {
  buildTransactionQueryParams,
  type TransactionSort,
} from "@/lib/transactions/transaction-list-filters"
import type { Transaction } from "@/types/transaction"

type Step = "phone" | "otp" | "dashboard"
type DashboardTab = "transactions" | "products" | "customers" | "settings"

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
  const [txSearch, setTxSearch] = useState("")
  const [debouncedTxSearch, setDebouncedTxSearch] = useState("")
  const [txSort, setTxSort] = useState<TransactionSort>("terbaru")
  const skipFilterFetch = useRef(true)
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    limit: DEFAULT_TRANSACTION_PAGE_SIZE,
    total: 0,
    totalPages: 0,
  })

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedTxSearch(txSearch), 300)
    return () => window.clearTimeout(timer)
  }, [txSearch])

  const fetchTransactions = useCallback(
    async (page = 1, search = debouncedTxSearch, sort = txSort) => {
      const params = buildTransactionQueryParams({ search, sort, page })
      const txRes = await fetch(`/api/umkm/transactions?${params.toString()}`, {
        credentials: "include",
      })

      if (txRes.status === 401) {
        setStep("phone")
        return null
      }

      const txData = await txRes.json()
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
      return txData
    },
    [debouncedTxSearch, txSort],
  )

  const loadDashboard = useCallback(async (page = 1) => {
    const [txData, bankRes, gamRes] = await Promise.all([
      fetchTransactions(page),
      fetch("/api/umkm/bank", { credentials: "include" }),
      fetch("/api/umkm/gamification", { credentials: "include" }),
    ])

    if (!txData) return

    const bankData = await bankRes.json()
    if (gamRes.ok) {
      const gamData = await gamRes.json()
      setGamification({
        totalPoints: gamData.totalPoints ?? 0,
        completedOrders: gamData.completedOrders ?? 0,
        trustTier: gamData.trustTier ?? null,
      })
    }
    setBank({
      bank_name: bankData.bank_name || "",
      bank_account_number: bankData.bank_account_number || "",
      bank_account_name: bankData.bank_account_name || "",
    })
    if (bankData.business_name) {
      setBusinessName(bankData.business_name)
    } else if (txData.transactions?.[0]?.businessName) {
      setBusinessName(txData.transactions[0].businessName)
    }
    const hasBank =
      Boolean(bankData.bank_name?.trim()) &&
      Boolean(bankData.bank_account_number?.trim()) &&
      Boolean(bankData.bank_account_name?.trim())
    setBankSaved(hasBank)
    setStep("dashboard")
  }, [fetchTransactions])

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

  useEffect(() => {
    if (step !== "dashboard") return
    if (skipFilterFetch.current) {
      skipFilterFetch.current = false
      return
    }

    setLoading(true)
    closeTransactionPanel()
    fetchTransactions(1)
      .catch(() => setStep("phone"))
      .finally(() => setLoading(false))
  }, [debouncedTxSearch, txSort, step, fetchTransactions])

  const changeTxPage = async (page: number) => {
    setLoading(true)
    setError("")
    closeTransactionPanel()
    try {
      await fetchTransactions(page)
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
      if (actionName === "approve") {
        setExpandedId(id)
        setRejectingId(null)
        setInvoiceEditId(null)
      } else {
        closeTransactionPanel()
      }
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
                <>
                  <Button variant="ghost" size="sm" onClick={() => { setError(""); setBankMessage(""); setDashboardTab("products") }}>
                    <Package className="h-4 w-4 mr-1" />
                    Produk
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => { setError(""); setBankMessage(""); setDashboardTab("customers") }}>
                    <Users className="h-4 w-4 mr-1" />
                    Pelanggan
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => { setError(""); setBankMessage(""); setDashboardTab("settings") }}>
                    <Settings className="h-4 w-4 mr-1" />
                    Pengaturan
                  </Button>
                </>
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
        {(step === "phone" || step === "otp") && (
          <UmkmAuthSteps
            step={step}
            phone={phone}
            otp={otp}
            error={error}
            loading={loading}
            onPhoneChange={setPhone}
            onOtpChange={setOtp}
            onRequestOtp={requestOtp}
            onVerifyOtp={verifyOtp}
            onBackToPhone={() => setStep("phone")}
          />
        )}

        {step === "dashboard" && dashboardTab === "products" && (
          <div className="space-y-6">
            <Button variant="ghost" size="sm" className="-ml-2" onClick={() => { setError(""); setBankMessage(""); setDashboardTab("transactions") }}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              Transaksi
            </Button>
            <UmkmProductsPanel businessName={businessName} />
          </div>
        )}

        {step === "dashboard" && dashboardTab === "customers" && (
          <div className="space-y-6">
            <Button variant="ghost" size="sm" className="-ml-2" onClick={() => { setError(""); setBankMessage(""); setDashboardTab("transactions") }}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              Transaksi
            </Button>
            <UmkmCustomersPanel businessName={businessName} />
          </div>
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

            <UmkmLegalitasPanel />

            <UmkmStoreQrCard />
          </div>
        )}

        {step === "dashboard" && dashboardTab === "transactions" && (
          <UmkmTransactionsPanel
            businessName={businessName}
            gamification={gamification}
            bankSaved={bankSaved}
            error={error}
            transactions={transactions}
            pagination={pagination}
            loading={loading}
            expandedId={expandedId}
            rejectingId={rejectingId}
            invoiceEditId={invoiceEditId}
            invoiceForm={invoiceForm}
            rejectReason={rejectReason}
            onOpenSettings={() => setDashboardTab("settings")}
            onToggleTransaction={toggleTransaction}
            onAction={action}
            onSendInvoice={sendInvoice}
            onRejectingIdChange={setRejectingId}
            onInvoiceEditIdChange={setInvoiceEditId}
            onInvoiceFormChange={setInvoiceForm}
            onRejectReasonChange={setRejectReason}
            onPageChange={changeTxPage}
            txSearch={txSearch}
            txSort={txSort}
            onTxSearchChange={setTxSearch}
            onTxSortChange={setTxSort}
          />
        )}
      </main>
    </div>
  )
}
