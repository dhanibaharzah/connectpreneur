"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Printer, ArrowLeft } from "lucide-react"
import { TRANSACTION_STATUS_LABELS, type TransactionStatus } from "@/types/transaction"

interface InvoiceData {
  transaction: {
    referenceNo: string
    buyerName: string
    buyerPhone: string
    invoiceDescription: string | null
    invoiceQuantity: number | null
    invoiceUnitPrice: number | null
    invoiceTotal: number | null
    invoiceSentAt: string | null
    status: TransactionStatus
  }
  business: {
    nama: string
    alamat: string
    kota_provinsi: string
    bank_name: string
    bank_account_number: string
    bank_account_name: string
    logo_url: string | null
  }
  formatted_total: string
}

export default function InvoicePage({ params }: { params: Promise<{ token: string }> }) {
  const [token, setToken] = useState<string | null>(null)
  const [data, setData] = useState<InvoiceData | null>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    params.then((p) => setToken(p.token))
  }, [params])

  useEffect(() => {
    if (!token) return

    let cancelled = false

    async function loadInvoice(retry = 0) {
      try {
        const res = await fetch(`/api/invoice/${token}`)
        const json = await res.json()
        if (!res.ok) {
          if (res.status === 503 && retry < 2) {
            await new Promise((r) => setTimeout(r, 2000))
            if (!cancelled) return loadInvoice(retry + 1)
            return
          }
          throw new Error(json.error || "Invoice tidak ditemukan")
        }
        if (!cancelled) setData(json)
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Gagal memuat invoice")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadInvoice()
    return () => {
      cancelled = true
    }
  }, [token])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4">
        <p className="text-muted-foreground">{error || "Invoice tidak ditemukan"}</p>
        <Link href="/katalog">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Katalog
          </Button>
        </Link>
      </div>
    )
  }

  const { transaction, business, formatted_total } = data
  const invoiceUrl = typeof window !== "undefined" ? window.location.href : ""
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(invoiceUrl)}`

  return (
    <div className="min-h-screen bg-muted/30 py-8 px-4 print:bg-white print:py-0">
      <div className="max-w-2xl mx-auto space-y-4 print:max-w-none">
        <div className="flex justify-end print:hidden">
          <Button size="sm" onClick={() => window.print()}>
            <Printer className="h-4 w-4 mr-2" />
            Cetak / Simpan PDF
          </Button>
        </div>

        <Card className="print:shadow-none print:border-0">
          <CardContent className="p-8 space-y-6">
            <div className="flex justify-between items-start gap-4">
              <div>
                <Image
                  src="/images/logoconnectpreneur.png"
                  alt="ConnectPreneur"
                  width={160}
                  height={40}
                  className="h-10 w-auto mb-4"
                />
                <h1 className="text-2xl font-bold">INVOICE</h1>
                <p className="text-sm text-muted-foreground mt-1">{transaction.referenceNo}</p>
              </div>
              <img src={qrUrl} alt="QR Invoice" className="w-24 h-24" />
            </div>

            <div className="grid sm:grid-cols-2 gap-6 text-sm">
              <div>
                <p className="font-semibold text-muted-foreground mb-1">Dari</p>
                <p className="font-medium">{business.nama}</p>
                <p className="text-muted-foreground">{business.alamat}</p>
                <p className="text-muted-foreground">{business.kota_provinsi}</p>
              </div>
              <div>
                <p className="font-semibold text-muted-foreground mb-1">Kepada</p>
                <p className="font-medium">{transaction.buyerName}</p>
                <p className="text-muted-foreground">{transaction.buyerPhone}</p>
              </div>
            </div>

            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Deskripsi</th>
                  <th className="text-right py-2">Qty</th>
                  <th className="text-right py-2">Harga</th>
                  <th className="text-right py-2">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3">{transaction.invoiceDescription}</td>
                  <td className="text-right py-3">{transaction.invoiceQuantity}</td>
                  <td className="text-right py-3">
                    {transaction.invoiceUnitPrice?.toLocaleString("id-ID")}
                  </td>
                  <td className="text-right py-3 font-medium">
                    {transaction.invoiceTotal?.toLocaleString("id-ID")}
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3} className="text-right py-4 font-semibold">
                    Total
                  </td>
                  <td className="text-right py-4 font-bold text-lg">{formatted_total}</td>
                </tr>
              </tfoot>
            </table>

            <div className="bg-muted/50 rounded-lg p-4 text-sm space-y-1">
              <p className="font-semibold">Transfer ke:</p>
              <p>{business.bank_name}</p>
              <p className="font-mono">{business.bank_account_number}</p>
              <p>{business.bank_account_name}</p>
            </div>

            <p className="text-xs text-muted-foreground">
              Status: {TRANSACTION_STATUS_LABELS[transaction.status] || transaction.status}
              {transaction.invoiceSentAt &&
                ` · Diterbitkan ${new Date(transaction.invoiceSentAt).toLocaleDateString("id-ID")}`}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
