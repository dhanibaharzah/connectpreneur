import type { ProductTipeBisnis } from "@/types/business-product"
import type { MarketplaceProductFilters, MarketplaceSort } from "@/types/marketplace-product"

export const DEFAULT_MARKETPLACE_PAGE_SIZE = 20
export const MAX_MARKETPLACE_PAGE_SIZE = 50

export function parseMarketplaceSort(value: unknown): MarketplaceSort {
  if (value === "harga_asc" || value === "harga_desc" || value === "nama_asc" || value === "terbaru") {
    return value
  }
  return "terbaru"
}

export function parseMarketplaceTipe(value: unknown): ProductTipeBisnis | "all" {
  if (value === "produk" || value === "jasa") return value
  return "all"
}

export function parseMarketplaceFilters(searchParams: URLSearchParams): Required<
  Omit<MarketplaceProductFilters, "search" | "location">
> & {
  search: string
  location: string
} {
  const page = Math.max(1, Number.parseInt(searchParams.get("page") || "1", 10) || 1)
  const rawLimit = Number.parseInt(searchParams.get("limit") || String(DEFAULT_MARKETPLACE_PAGE_SIZE), 10)
  const limit = Math.min(
    MAX_MARKETPLACE_PAGE_SIZE,
    Math.max(1, rawLimit || DEFAULT_MARKETPLACE_PAGE_SIZE),
  )

  return {
    search: (searchParams.get("search") || "").trim(),
    tipe: parseMarketplaceTipe(searchParams.get("tipe")),
    location: (searchParams.get("location") || "").trim(),
    sort: parseMarketplaceSort(searchParams.get("sort")),
    page,
    limit,
  }
}
