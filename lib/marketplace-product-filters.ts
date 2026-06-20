import type { ProductTipeBisnis } from "@/types/business-product"
import type { MarketplaceProductFilters, MarketplaceSort } from "@/types/marketplace-product"
import { parsePageLimit } from "@/lib/pagination"

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

export function buildMarketplaceQueryParams(input: {
  search?: string
  tipe?: ProductTipeBisnis | "all"
  location?: string
  sort?: MarketplaceSort
  page?: number
  limit?: number
}): URLSearchParams {
  const params = new URLSearchParams()
  const search = input.search?.trim() || ""
  const tipe = input.tipe ?? "all"
  const location = input.location?.trim() || ""
  const sort = input.sort ?? "terbaru"
  const page = input.page ?? 1
  const limit = input.limit ?? DEFAULT_MARKETPLACE_PAGE_SIZE

  if (search) params.set("search", search)
  if (tipe !== "all") params.set("tipe", tipe)
  if (location) params.set("location", location)
  if (sort !== "terbaru") params.set("sort", sort)
  params.set("page", String(page))
  params.set("limit", String(limit))
  return params
}

export function parseMarketplaceFilters(searchParams: URLSearchParams): Required<
  Omit<MarketplaceProductFilters, "search" | "location">
> & {
  search: string
  location: string
} {
  const { page, limit } = parsePageLimit(searchParams, {
    defaultLimit: DEFAULT_MARKETPLACE_PAGE_SIZE,
    maxLimit: MAX_MARKETPLACE_PAGE_SIZE,
  })

  return {
    search: (searchParams.get("search") || "").trim(),
    tipe: parseMarketplaceTipe(searchParams.get("tipe")),
    location: (searchParams.get("location") || "").trim(),
    sort: parseMarketplaceSort(searchParams.get("sort")),
    page,
    limit,
  }
}
