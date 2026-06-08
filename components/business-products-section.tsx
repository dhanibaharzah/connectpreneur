"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Package, FileText } from "lucide-react"
import type { BusinessProduct } from "@/types/business-product"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ProductListPagination } from "@/components/product-list-pagination"
import { paginateArray, PRODUCT_PAGE_SIZE } from "@/lib/pagination"

function isValidImageUrl(url: string): boolean {
  if (!url) return false
  const isDirectImage = url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i) !== null
  const isBlobUrl =
    url.includes("blob.v0.app") || url.includes("blob.vercel-storage.com") || url.includes("vusercontent.net")
  const isPlaceholder = url.includes("placeholder.svg")
  const isLocalImage = url.startsWith("/images/") || url.startsWith("/public/") || url.startsWith("/")

  return isDirectImage || isBlobUrl || isPlaceholder || isLocalImage
}

interface BusinessProductsSectionProps {
  products: BusinessProduct[]
  onRequestQuote: (productName: string) => void
}

export function BusinessProductsSection({ products, onRequestQuote }: BusinessProductsSectionProps) {
  const [page, setPage] = useState(1)

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(products.length / PRODUCT_PAGE_SIZE))
    if (page > totalPages) setPage(totalPages)
  }, [products.length, page])

  if (products.length === 0) return null

  const { items: visibleProducts, pagination } = paginateArray(products, page, PRODUCT_PAGE_SIZE)

  return (
    <Card className="mt-6">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-lg text-foreground">Produk Tersedia</h3>
          </div>
          <span className="text-sm text-muted-foreground">{products.length} produk</span>
        </div>

        <div className="space-y-3">
          {visibleProducts.map((product) => (
            <div
              key={product.id}
              className="rounded-lg border p-3"
            >
              <div className="flex items-start gap-3">
                {product.imageUrl && isValidImageUrl(product.imageUrl) ? (
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
                    onClick={() => onRequestQuote(product.nama)}
                    className="text-left font-medium text-foreground leading-snug hover:text-primary transition-colors"
                  >
                    {product.nama}
                  </button>
                  {product.deskripsi && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{product.deskripsi}</p>
                  )}
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
                    onClick={() => onRequestQuote(product.nama)}
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
      </CardContent>
    </Card>
  )
}
