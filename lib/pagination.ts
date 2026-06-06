export const DEFAULT_TRANSACTION_PAGE_SIZE = 20
export const MAX_TRANSACTION_PAGE_SIZE = 50

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export function parseTransactionPagination(searchParams: URLSearchParams): {
  page: number
  limit: number
  offset: number
} {
  const page = Math.max(1, Number.parseInt(searchParams.get("page") || "1", 10) || 1)
  const rawLimit = Number.parseInt(
    searchParams.get("limit") || String(DEFAULT_TRANSACTION_PAGE_SIZE),
    10,
  )
  const limit = Math.min(
    MAX_TRANSACTION_PAGE_SIZE,
    Math.max(1, rawLimit || DEFAULT_TRANSACTION_PAGE_SIZE),
  )
  return { page, limit, offset: (page - 1) * limit }
}

export function buildPaginationMeta(
  page: number,
  limit: number,
  total: number,
): PaginationMeta {
  return {
    page,
    limit,
    total,
    totalPages: total === 0 ? 0 : Math.ceil(total / limit),
  }
}
