"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { ChevronDown, Package, FileText } from "lucide-react"
import type { BusinessProduct } from "@/types/business-product"
import { PRODUCT_TIPE_LABELS } from "@/types/business-product"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ProductListPagination } from "@/components/product-list-pagination"
import { paginateArray, PRODUCT_PAGE_SIZE } from "@/lib/pagination"
import { cn } from "@/lib/utils"
import { isDisplayableImageUrl } from "@/lib/storage-urls"

export interface RfqProductSelection {
  nama: string
  deskripsi: string
}

interface BusinessProductsSectionProps {
  products: BusinessProduct[]
  onRequestQuote: (product: RfqProductSelection) => void
  collapsible?: boolean
  layout?: "compact" | "detail"
  className?: string
}

const DESKRIPSI_PREVIEW_LENGTH = 100

function ProductDescription({ text, className }: { text: string; className?: string }) {
  const [expanded, setExpanded] = useState(false)
  const needsToggle = text.length > DESKRIPSI_PREVIEW_LENGTH

  if (!needsToggle) {
    return <p className={cn("text-sm text-muted-foreground", className)}>{text}</p>
  }

  if (!expanded) {
    return (
      <p className={cn("text-sm text-muted-foreground", className)}>
        {text.slice(0, DESKRIPSI_PREVIEW_LENGTH).trim()}…{" "}
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="font-medium text-primary hover:underline"
        >
          Lihat selengkapnya
        </button>
      </p>
    )
  }

  return (
    <div className={className}>
      <p className="text-sm text-muted-foreground">{text}</p>
      <button
        type="button"
        onClick={() => setExpanded(false)}
        className="mt-1 text-xs font-medium text-primary hover:underline"
      >
        Tampilkan lebih sedikit
      </button>
    </div>
  )
}

function DetailProductCard({
  product,
  onRequestQuote,
}: {
  product: BusinessProduct
  onRequestQuote: (product: RfqProductSelection) => void
}) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        {product.imageUrl && isDisplayableImageUrl(product.imageUrl) ? (
          <div className="relative h-36 w-full shrink-0 overflow-hidden rounded-lg border bg-muted sm:h-28 sm:w-40">
            <Image src={product.imageUrl} alt={product.nama} fill className="object-cover" />
          </div>
        ) : (
          <div className="flex h-36 w-full shrink-0 items-center justify-center rounded-lg border bg-muted text-xs text-muted-foreground sm:h-28 sm:w-40">
            Tanpa foto
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="font-semibold text-foreground">{product.nama}</h4>
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
              {PRODUCT_TIPE_LABELS[product.tipeBisnis]}
            </span>
          </div>
          {product.deskripsi && <ProductDescription text={product.deskripsi} className="mt-2" />}
          <p className="mt-2 text-base font-bold text-primary">
            Mulai dari Rp {product.hargaMulai.toLocaleString("id-ID")}
          </p>
          <div className="mt-3">
            <Button
              type="button"
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => onRequestQuote({ nama: product.nama, deskripsi: product.deskripsi })}
            >
              <FileText className="h-4 w-4 mr-1.5" />
              Minta Penawaran
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function ProductListContent({
  products,
  onRequestQuote,
  layout = "compact",
}: {
  products: BusinessProduct[]
  onRequestQuote: (product: RfqProductSelection) => void
  layout?: "compact" | "detail"
}) {
  const [page, setPage] = useState(1)

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(products.length / PRODUCT_PAGE_SIZE))
    if (page > totalPages) setPage(totalPages)
  }, [products.length, page])

  const { items: visibleProducts, pagination } = paginateArray(products, page, PRODUCT_PAGE_SIZE)

  if (layout === "detail") {
    return (
      <div className="space-y-4">
        <div className="space-y-4">
          {visibleProducts.map((product) => (
            <DetailProductCard key={product.id} product={product} onRequestQuote={onRequestQuote} />
          ))}
        </div>

        <ProductListPagination pagination={pagination} onPageChange={setPage} />

        {pagination.totalPages > 1 && (
          <Button
            type="button"
            variant="outline"
            className="w-full bg-transparent"
            onClick={() => setPage((p) => Math.min(p + 1, pagination.totalPages))}
            disabled={page >= pagination.totalPages}
          >
            Lihat semua produk
          </Button>
        )}

        <p className="text-xs text-muted-foreground">
          Harga bersifat indikatif. Detail spesifikasi, varian, dan negosiasi dapat didiskusikan langsung via
          WhatsApp. Harap tetap berhati-hati pada tiap transaksi, jangan lupa untuk crosscheck mitra.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {visibleProducts.map((product) => (
          <div key={product.id} className="rounded-lg border p-3">
            <div className="flex items-start gap-3">
              {product.imageUrl && isDisplayableImageUrl(product.imageUrl) ? (
                <div className="relative h-16 w-16 overflow-hidden rounded-lg border bg-muted shrink-0">
                  <Image src={product.imageUrl} alt={product.nama} fill className="object-cover" />
                </div>
              ) : (
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border bg-muted text-xs text-muted-foreground">
                  Tanpa foto
                </div>
              )}
              <div className="min-w-0 flex-1">
                <button
                  type="button"
                  onClick={() => onRequestQuote({ nama: product.nama, deskripsi: product.deskripsi })}
                  className="text-left font-medium text-foreground leading-snug hover:text-primary transition-colors"
                >
                  {product.nama}
                </button>
                <span className="inline-block mt-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                  {PRODUCT_TIPE_LABELS[product.tipeBisnis]}
                </span>
                {product.deskripsi && <ProductDescription text={product.deskripsi} />}
                <p className="text-sm font-semibold text-primary mt-2">
                  Mulai dari Rp {product.hargaMulai.toLocaleString("id-ID")}
                </p>
              </div>
              <div className="group relative shrink-0">
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  className="h-9 w-9 border-green-600 text-green-700 hover:bg-green-50 hover:text-green-800"
                  onClick={() => onRequestQuote({ nama: product.nama, deskripsi: product.deskripsi })}
                  aria-label="Minta penawaran"
                >
                  <FileText className="h-4 w-4" />
                </Button>
                <span className="pointer-events-none absolute bottom-full right-0 z-10 mb-2 hidden whitespace-nowrap rounded-md bg-foreground px-2.5 py-1 text-xs font-medium text-background shadow-md group-hover:block">
                  Minta Penawaran
                  <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-foreground" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ProductListPagination pagination={pagination} onPageChange={setPage} />

      <p className="text-xs text-muted-foreground">
        Harga bersifat indikatif. Detail spesifikasi, varian, dan negosiasi dapat didiskusikan langsung via WhatsApp.
        Harap tetap berhati-hati pada tiap transaksi, jangan lupa untuk crosscheck mitra.
      </p>
    </div>
  )
}

export function BusinessProductsSection({
  products,
  onRequestQuote,
  collapsible = false,
  layout = "compact",
  className,
}: BusinessProductsSectionProps) {
  const [open, setOpen] = useState(false)

  if (products.length === 0) return null

  if (layout === "detail") {
    return (
      <div className={className}>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-foreground">Produk & Layanan</h2>
          <p className="text-sm text-muted-foreground">{products.length} produk tersedia</p>
        </div>
        <ProductListContent products={products} onRequestQuote={onRequestQuote} layout="detail" />
      </div>
    )
  }

  if (collapsible) {
    return (
      <Card className={className}>
        <CardContent className="p-0">
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors rounded-lg"
          >
            <div className="flex items-center gap-3 min-w-0">
              <Package className="h-5 w-5 text-primary shrink-0" />
              <span className="font-semibold text-foreground">Produk Tersedia</span>
              <span className="text-sm text-muted-foreground shrink-0">{products.length} produk</span>
            </div>
            <ChevronDown
              className={cn(
                "h-5 w-5 text-muted-foreground transition-transform shrink-0",
                open && "rotate-180",
              )}
            />
          </button>
          {open && (
            <div className="px-4 pb-4 border-t pt-4">
              <ProductListContent products={products} onRequestQuote={onRequestQuote} />
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn("mt-6", className)}>
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-lg text-foreground">Produk Tersedia</h3>
          </div>
          <span className="text-sm text-muted-foreground">{products.length} produk</span>
        </div>
        <ProductListContent products={products} onRequestQuote={onRequestQuote} />
      </CardContent>
    </Card>
  )
}
