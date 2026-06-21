import { sql } from "@/lib/sql"
import { parseTransactionPagination } from "@/lib/shared/pagination"

export const TRANSACTION_SORTS = [
  "terbaru",
  "terlama",
  "total_desc",
  "total_asc",
  "nama_asc",
] as const

export type TransactionSort = (typeof TRANSACTION_SORTS)[number]

export const TRANSACTION_SORT_LABELS: Record<TransactionSort, string> = {
  terbaru: "Terbaru",
  terlama: "Terlama",
  total_desc: "Total Tertinggi",
  total_asc: "Total Terendah",
  nama_asc: "Nama A-Z",
}

export interface TransactionListFilters {
  search: string
  sort: TransactionSort
  page: number
  limit: number
  offset: number
}

export function parseTransactionSort(value: unknown): TransactionSort {
  if (
    value === "terlama" ||
    value === "total_desc" ||
    value === "total_asc" ||
    value === "nama_asc"
  ) {
    return value
  }
  return "terbaru"
}

export function parseTransactionListFilters(searchParams: URLSearchParams): TransactionListFilters {
  const { page, limit, offset } = parseTransactionPagination(searchParams)
  return {
    search: (searchParams.get("search") || "").trim(),
    sort: parseTransactionSort(searchParams.get("sort")),
    page,
    limit,
    offset,
  }
}

export function buildTransactionQueryParams(input: {
  search?: string
  sort?: TransactionSort
  page?: number
}): URLSearchParams {
  const params = new URLSearchParams()
  const search = input.search?.trim() || ""
  const sort = input.sort ?? "terbaru"
  const page = input.page ?? 1

  if (search) params.set("search", search)
  if (sort !== "terbaru") params.set("sort", sort)
  params.set("page", String(page))
  return params
}

export function buildTransactionSearchPattern(search: string): string | null {
  const trimmed = search.trim()
  if (!trimmed) return null
  return `%${trimmed.replace(/[%_\\]/g, "\\$&")}%`
}

export function buildBuyerTransactionSearchFilter(search: string) {
  const pattern = buildTransactionSearchPattern(search)
  if (!pattern) return sql``

  return sql`AND (
    t.reference_no ILIKE ${pattern}
    OR b.nama ILIKE ${pattern}
    OR t.notes ILIKE ${pattern}
  )`
}

export function buildBusinessTransactionSearchFilter(search: string) {
  const pattern = buildTransactionSearchPattern(search)
  if (!pattern) return sql``

  return sql`AND (
    t.reference_no ILIKE ${pattern}
    OR t.buyer_name ILIKE ${pattern}
    OR t.buyer_phone ILIKE ${pattern}
    OR t.notes ILIKE ${pattern}
  )`
}

export function buildBuyerTransactionOrderBy(sort: TransactionSort) {
  switch (sort) {
    case "terlama":
      return sql`ORDER BY t.created_at ASC, t.id ASC`
    case "total_desc":
      return sql`ORDER BY t.invoice_total DESC NULLS LAST, t.created_at DESC, t.id DESC`
    case "total_asc":
      return sql`ORDER BY t.invoice_total ASC NULLS LAST, t.created_at DESC, t.id ASC`
    case "nama_asc":
      return sql`ORDER BY b.nama ASC NULLS LAST, t.created_at DESC, t.id ASC`
    default:
      return sql`ORDER BY t.created_at DESC, t.id DESC`
  }
}

export function buildBusinessTransactionOrderBy(sort: TransactionSort) {
  switch (sort) {
    case "terlama":
      return sql`ORDER BY t.created_at ASC, t.id ASC`
    case "total_desc":
      return sql`ORDER BY t.invoice_total DESC NULLS LAST, t.created_at DESC, t.id DESC`
    case "total_asc":
      return sql`ORDER BY t.invoice_total ASC NULLS LAST, t.created_at DESC, t.id ASC`
    case "nama_asc":
      return sql`ORDER BY t.buyer_name ASC NULLS LAST, t.created_at DESC, t.id ASC`
    default:
      return sql`ORDER BY t.created_at DESC, t.id DESC`
  }
}
