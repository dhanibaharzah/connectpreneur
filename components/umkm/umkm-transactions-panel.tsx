"use client"

import Link from "next/link"
import {
  Bell,
  Check,
  FileText,
  MessageCircle,
  Settings,
  Trophy,
  X,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ExpandableList, ExpandableListItem } from "@/components/shared/expandable-list"
import { TransactionListControls } from "@/components/shared/transaction-list-controls"
import { TransactionPagination } from "@/components/shared/transaction-pagination"
import { UmkmTrustBadge } from "@/components/umkm/umkm-trust-badge"
import type { PaginationMeta } from "@/lib/shared/pagination"
import type { TransactionSort } from "@/lib/transactions/transaction-list-filters"
import { buildUmkmContactBuyerMessage } from "@/lib/integrations/whatsapp-messages"
import { buildWhatsappWebUrl, formatPhoneDisplay } from "@/lib/shared/phone"
import {
  TRANSACTION_STATUS_LABELS,
  type Transaction,
  type TransactionStatus,
} from "@/types/transaction"
import type { TrustTier } from "@/types/gamification"

const STATUS_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  pending_review: "secondary",
  approved: "default",
  invoice_sent: "outline",
  payment_proof_uploaded: "default",
  completed: "default",
  rejected: "destructive",
  cancelled: "destructive",
}

interface UmkmTransactionsPanelProps {
  businessName: string
  gamification: {
    totalPoints: number
    completedOrders: number
    trustTier: string | null
  }
  bankSaved: boolean
  error: string
  transactions: Transaction[]
  pagination: PaginationMeta
  loading: boolean
  expandedId: number | null
  rejectingId: number | null
  invoiceEditId: number | null
  invoiceForm: { description: string; quantity: string; unit_price: string }
  rejectReason: string
  onOpenSettings: () => void
  onToggleTransaction: (id: number) => void
  onAction: (id: number, actionName: string, extra?: Record<string, unknown>) => void
  onSendInvoice: (txId: number) => void
  onRejectingIdChange: (id: number | null) => void
  onInvoiceEditIdChange: (id: number | null) => void
  onInvoiceFormChange: (form: { description: string; quantity: string; unit_price: string }) => void
  onRejectReasonChange: (reason: string) => void
  onPageChange: (page: number) => void
  txSearch: string
  txSort: TransactionSort
  onTxSearchChange: (value: string) => void
  onTxSortChange: (sort: TransactionSort) => void
}

export function UmkmTransactionsPanel({
  businessName,
  gamification,
  bankSaved,
  error,
  transactions,
  pagination,
  loading,
  expandedId,
  rejectingId,
  invoiceEditId,
  invoiceForm,
  rejectReason,
  onOpenSettings,
  onToggleTransaction,
  onAction,
  onSendInvoice,
  onRejectingIdChange,
  onInvoiceEditIdChange,
  onInvoiceFormChange,
  onRejectReasonChange,
  onPageChange,
  txSearch,
  txSort,
  onTxSearchChange,
  onTxSortChange,
}: UmkmTransactionsPanelProps) {
  const emptyMessage =
    txSearch.trim() || txSort !== "terbaru"
      ? "Tidak ada transaksi yang cocok dengan filter."
      : "Belum ada permintaan penawaran."

  return (
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
            +50 poin per transaksi dikonfirmasi. Trust badge naik otomatis berdasarkan performa
            pesanan.
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
            <Button onClick={onOpenSettings}>
              <Settings className="h-4 w-4 mr-1" />
              Atur Rekening Bank
            </Button>
          </CardContent>
        </Card>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="space-y-3">
        <h2 className="font-semibold">Transaksi ({pagination.total})</h2>
        <TransactionListControls
          search={txSearch}
          sort={txSort}
          onSearchChange={onTxSearchChange}
          onSortChange={onTxSortChange}
          searchPlaceholder="Cari pembeli, no. referensi..."
          disabled={loading}
        />
        <ExpandableList isEmpty={transactions.length === 0} emptyMessage={emptyMessage}>
          {transactions.map((tx) => (
            <ExpandableListItem
              key={tx.id}
              open={expandedId === tx.id}
              onToggle={() => onToggleTransaction(tx.id)}
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
                <p className="text-muted-foreground">{formatPhoneDisplay(tx.buyerPhone)}</p>
                {tx.notes && (
                  <p>
                    <span className="font-medium">Catatan:</span> {tx.notes}
                  </p>
                )}
                {tx.quantity > 0 && (
                  <p>
                    <span className="font-medium">Kuantitas:</span> {tx.quantity}
                  </p>
                )}
                {tx.invoiceTotal != null && (
                  <p className="font-medium sm:hidden">
                    Total: Rp {tx.invoiceTotal.toLocaleString("id-ID")}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {tx.status !== "completed" && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-fit border-green-600 text-green-700 hover:bg-green-50"
                    asChild
                  >
                    <a
                      href={buildWhatsappWebUrl(
                        tx.buyerPhone,
                        buildUmkmContactBuyerMessage({
                          businessName: tx.businessName || businessName,
                          buyerName: tx.buyerName,
                          referenceNo: tx.referenceNo,
                          quantity: tx.quantity,
                          notes: tx.notes,
                        }),
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle className="h-4 w-4 mr-1" />
                      Kontak Pembeli
                    </a>
                  </Button>
                )}

                {tx.invoiceUrl && (
                  <Button size="sm" variant="outline" className="w-fit" asChild>
                    <a href={tx.invoiceUrl} target="_blank" rel="noopener noreferrer">
                      <FileText className="h-4 w-4 mr-1" />
                      Lihat Invoice
                    </a>
                  </Button>
                )}
              </div>

              {tx.status === "pending_review" && (
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" onClick={() => onAction(tx.id, "approve")} disabled={loading}>
                    <Check className="h-4 w-4 mr-1" /> Setujui
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      if (expandedId !== tx.id) onToggleTransaction(tx.id)
                      onRejectingIdChange(rejectingId === tx.id ? null : tx.id)
                      onInvoiceEditIdChange(null)
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
                    onChange={(e) => onRejectReasonChange(e.target.value)}
                    rows={2}
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onAction(tx.id, "reject", { reason: rejectReason })}
                      disabled={loading}
                    >
                      Konfirmasi Tolak
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onRejectingIdChange(null)}
                      disabled={loading}
                    >
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
                        if (expandedId !== tx.id) onToggleTransaction(tx.id)
                        onInvoiceEditIdChange(tx.id)
                        onRejectingIdChange(null)
                        onInvoiceFormChange({ description: "", quantity: "1", unit_price: "" })
                      }}
                      disabled={loading}
                    >
                      <FileText className="h-4 w-4 mr-1" /> Buat Invoice
                    </Button>
                  ) : (
                    <>
                      <p className="text-sm font-medium">Terbitkan Invoice</p>
                      <Input
                        placeholder="Deskripsi item"
                        value={invoiceForm.description}
                        onChange={(e) =>
                          onInvoiceFormChange({ ...invoiceForm, description: e.target.value })
                        }
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          type="number"
                          min={1}
                          placeholder="Qty"
                          value={invoiceForm.quantity}
                          onChange={(e) =>
                            onInvoiceFormChange({ ...invoiceForm, quantity: e.target.value })
                          }
                        />
                        <Input
                          type="number"
                          min={1}
                          placeholder="Harga satuan (Rp)"
                          value={invoiceForm.unit_price}
                          onChange={(e) =>
                            onInvoiceFormChange({ ...invoiceForm, unit_price: e.target.value })
                          }
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => onSendInvoice(tx.id)} disabled={loading}>
                          Kirim Invoice
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onInvoiceEditIdChange(null)}
                          disabled={loading}
                        >
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
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onAction(tx.id, "remind")}
                    disabled={loading}
                  >
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
                    onClick={() => onAction(tx.id, "confirm_payment")}
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
        <TransactionPagination pagination={pagination} onPageChange={onPageChange} loading={loading} />
      </div>

      <Link href="/katalog" className="text-sm text-muted-foreground hover:text-primary">
        ← Kembali ke Katalog
      </Link>
    </div>
  )
}
