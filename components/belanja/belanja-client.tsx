"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { BelanjaHeader } from "@/components/belanja/belanja-header"
import { BannerCarousel } from "@/components/belanja/banner-carousel"
import { ProductFilters, type TipeFilter } from "@/components/belanja/product-filters"
import { ProductGrid } from "@/components/belanja/product-grid"
import type { ShopBanner } from "@/types/shop-banner"
import type { MarketplaceProduct, MarketplaceSort } from "@/types/marketplace-product"
import type { PaginationMeta } from "@/lib/shared/pagination"
import { buildMarketplaceQueryParams } from "@/lib/marketplace/marketplace-product-filters"

interface BelanjaClientProps {
  homePath: string
  onSubdomain: boolean
  initialSearch?: string
  initialBanners: ShopBanner[]
  initialProducts: MarketplaceProduct[]
  initialPagination: PaginationMeta
  initialLocations: string[]
}

export function BelanjaClient(props: BelanjaClientProps) {
  return <BelanjaClientInner {...props} />
}

function BelanjaClientInner({
  homePath,
  onSubdomain,
  initialSearch = "",
  initialBanners,
  initialProducts,
  initialPagination,
  initialLocations,
}: BelanjaClientProps) {
  const [search, setSearch] = useState(initialSearch)
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch)
  const [tipe, setTipe] = useState<TipeFilter>("all")
  const [location, setLocation] = useState("")
  const [sort, setSort] = useState<MarketplaceSort>("terbaru")
  const [products, setProducts] = useState(initialProducts)
  const [pagination, setPagination] = useState(initialPagination)
  const [locations] = useState(initialLocations)
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const pageRef = useRef(1)
  const skipInitialFetch = useRef(true)

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search), 300)
    return () => window.clearTimeout(timer)
  }, [search])

  const fetchProducts = useCallback(
    async (page: number, append: boolean) => {
      const params = buildMarketplaceQueryParams({
        search: debouncedSearch,
        tipe,
        location,
        sort,
        page,
      })
      const res = await fetch(`/api/belanja/products?${params.toString()}`)
      if (!res.ok) throw new Error("Failed to fetch products")
      const data = await res.json()

      setProducts((prev) => (append ? [...prev, ...data.products] : data.products))
      setPagination(data.pagination)
      pageRef.current = page
    },
    [debouncedSearch, tipe, location, sort],
  )

  useEffect(() => {
    if (skipInitialFetch.current) {
      skipInitialFetch.current = false
      return
    }

    let cancelled = false

    const load = async () => {
      setLoading(true)
      try {
        await fetchProducts(1, false)
      } catch {
        if (!cancelled) {
          setProducts([])
          setPagination({
            page: 1,
            limit: DEFAULT_MARKETPLACE_PAGE_SIZE,
            total: 0,
            totalPages: 0,
          })
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [fetchProducts])

  const handleLoadMore = async () => {
    if (loadingMore || pagination.page >= pagination.totalPages) return
    setLoadingMore(true)
    try {
      await fetchProducts(pagination.page + 1, true)
    } catch {
      // keep current list
    } finally {
      setLoadingMore(false)
    }
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <BelanjaHeader
        homePath={homePath}
        onSubdomain={onSubdomain}
        search={search}
        onSearchChange={setSearch}
        onSearchSubmit={() => setDebouncedSearch(search)}
      />

      <main className="container mx-auto space-y-6 px-4 py-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">Belanja UMKM Lokal</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Temukan produk dan jasa dari mitra ConnectPreneur di seluruh Indonesia
          </p>
        </div>

        {initialBanners.length > 0 && <BannerCarousel banners={initialBanners} />}

        <ProductFilters
          tipe={tipe}
          location={location}
          sort={sort}
          locations={locations}
          onTipeChange={setTipe}
          onLocationChange={setLocation}
          onSortChange={setSort}
        />

        <ProductGrid
          products={products}
          pagination={pagination}
          onSubdomain={onSubdomain}
          loading={loading}
          loadingMore={loadingMore}
          onLoadMore={handleLoadMore}
        />
      </main>

      <footer className="border-t bg-white py-6">
        <div className="container mx-auto px-4 text-center text-xs text-muted-foreground">
          <p>
            Harga bersifat indikatif. Selalu verifikasi mitra sebelum bertransaksi. Segala kerjasama
            merupakan tanggung jawab masing-masing pihak.
          </p>
        </div>
      </footer>
    </div>
  )
}
