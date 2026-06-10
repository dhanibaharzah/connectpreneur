"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, MessageCircle, Users } from "lucide-react"
import { ProductListPagination } from "@/components/product-list-pagination"
import { paginateArray, PRODUCT_PAGE_SIZE } from "@/lib/pagination"
import { buildWhatsappWebUrl, formatPhoneDisplay } from "@/lib/phone"
import type { UmkmCustomer } from "@/lib/umkm-customers"

interface UmkmCustomersPanelProps {
  businessName: string
}

function formatRupiah(value: number): string {
  return `Rp ${value.toLocaleString("id-ID")}`
}

function formatDate(value: string | null): string {
  if (!value) return "-"
  return new Date(value).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

export function UmkmCustomersPanel({ businessName }: UmkmCustomersPanelProps) {
  const [customers, setCustomers] = useState<UmkmCustomer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [page, setPage] = useState(1)

  const loadCustomers = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/umkm/customers", { credentials: "include" })
      if (res.status === 401) throw new Error("Sesi berakhir, silakan masuk kembali")
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Gagal memuat pelanggan")
      setCustomers(data.customers || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat pelanggan")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadCustomers()
  }, [loadCustomers])

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(customers.length / PRODUCT_PAGE_SIZE))
    if (page > totalPages) setPage(totalPages)
  }, [customers.length, page])

  const { items: pagedCustomers, pagination } = useMemo(
    () => paginateArray(customers, page, PRODUCT_PAGE_SIZE),
    [customers, page],
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Pelanggan</h1>
        <p className="text-muted-foreground text-sm">{businessName}</p>
        <p className="text-xs text-muted-foreground mt-1">
          Daftar pembeli yang sudah menyelesaikan transaksi. Satu nomor HP dengan nama berbeda ditampilkan terpisah.
        </p>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <h2 className="font-semibold">Pelanggan Selesai ({customers.length})</h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : customers.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-sm text-muted-foreground text-center">
              Belum ada pelanggan yang menyelesaikan transaksi.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {pagedCustomers.map((customer) => (
              <Card key={`${customer.buyerPhone}-${customer.buyerName}`}>
                <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium">{customer.buyerName || "Pelanggan"}</p>
                    <p className="text-sm text-muted-foreground">{formatPhoneDisplay(customer.buyerPhone)}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {customer.transactionCount} transaksi selesai
                      {customer.totalAmount > 0 && ` · Total ${formatRupiah(customer.totalAmount)}`}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Terakhir transaksi: {formatDate(customer.lastTransactionAt)}
                    </p>
                  </div>
                  <Button asChild variant="outline" size="sm" className="shrink-0">
                    <a
                      href={buildWhatsappWebUrl(customer.buyerPhone, "")}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle className="h-4 w-4 mr-1" />
                      WhatsApp
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
            <ProductListPagination
              pagination={pagination}
              onPageChange={setPage}
              loading={loading}
            />
          </div>
        )}
      </div>
    </div>
  )
}
