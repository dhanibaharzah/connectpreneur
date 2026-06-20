"use client"

import { useEffect, useRef } from "react"
import { Loader2, PackageOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { MarketplaceProduct } from "@/types/marketplace-product"
import type { PaginationMeta } from "@/lib/shared/pagination"
import { ProductCard } from "@/components/belanja/product-card"

interface ProductGridProps {
  products: MarketplaceProduct[]
  pagination: PaginationMeta
  onSubdomain: boolean
  loading?: boolean
  loadingMore?: boolean
  onLoadMore?: () => void
}

export function ProductGrid({
  products,
  pagination,
  onSubdomain,
  loading = false,
  loadingMore = false,
  onLoadMore,
}: ProductGridProps) {
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const hasMore = pagination.page < pagination.totalPages

  useEffect(() => {
    const node = loadMoreRef.current
    if (!node || !hasMore || loading || loadingMore || !onLoadMore) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) onLoadMore()
      },
      { rootMargin: "240px" },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [hasMore, loading, loadingMore, onLoadMore])

  if (loading && products.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!loading && products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
        <PackageOpen className="h-12 w-12 text-muted-foreground/50" />
        <p className="text-muted-foreground">Belum ada produk yang cocok dengan filter Anda.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onSubdomain={onSubdomain} />
        ))}
      </div>

      {hasMore && (
        <div ref={loadMoreRef} className="flex justify-center py-4">
          {loadingMore ? (
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          ) : (
            <Button type="button" variant="outline" onClick={onLoadMore}>
              Muat lebih banyak
            </Button>
          )}
        </div>
      )}

      <p className="text-center text-xs text-muted-foreground">
        Menampilkan {products.length} dari {pagination.total} produk
      </p>
    </div>
  )
}
