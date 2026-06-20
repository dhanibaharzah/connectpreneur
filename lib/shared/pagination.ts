export const DEFAULT_TRANSACTION_PAGE_SIZE = 20
export const MAX_TRANSACTION_PAGE_SIZE = 50
export const PRODUCT_PAGE_SIZE = 5

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export function parsePageLimit(
  searchParams: URLSearchParams,
  defaults: { defaultLimit: number; maxLimit: number },
): { page: number; limit: number } {
  const page = Math.max(1, Number.parseInt(searchParams.get("page") || "1", 10) || 1)
  const rawLimit = Number.parseInt(
    searchParams.get("limit") || String(defaults.defaultLimit),
    10,
  )
  const limit = Math.min(
    defaults.maxLimit,
    Math.max(1, rawLimit || defaults.defaultLimit),
  )
  return { page, limit }
}

export function parseTransactionPagination(searchParams: URLSearchParams): {
  page: number
  limit: number
  offset: number
} {
  const { page, limit } = parsePageLimit(searchParams, {
    defaultLimit: DEFAULT_TRANSACTION_PAGE_SIZE,
    maxLimit: MAX_TRANSACTION_PAGE_SIZE,
  })
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

export function paginateArray<T>(items: T[], page: number, limit: number): {
  items: T[]
  pagination: PaginationMeta
} {
  const pagination = buildPaginationMeta(page, limit, items.length)
  const start = (page - 1) * limit
  return {
    items: items.slice(start, start + limit),
    pagination,
  }
}
