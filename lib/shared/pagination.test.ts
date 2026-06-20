import { describe, expect, it } from "vitest"
import {
  buildPaginationMeta,
  DEFAULT_TRANSACTION_PAGE_SIZE,
  MAX_TRANSACTION_PAGE_SIZE,
  paginateArray,
  PRODUCT_PAGE_SIZE,
  parsePageLimit,
  parseTransactionPagination,
} from "@/lib/shared/pagination"

describe("parsePageLimit", () => {
  it("clamps page and limit", () => {
    expect(
      parsePageLimit(new URLSearchParams("page=0&limit=999"), {
        defaultLimit: 20,
        maxLimit: 50,
      }),
    ).toEqual({ page: 1, limit: 50 })
  })
})

describe("parseTransactionPagination", () => {
  it("defaults to page 1 and 20 items", () => {
    const params = parseTransactionPagination(new URLSearchParams())
    expect(params).toEqual({ page: 1, limit: DEFAULT_TRANSACTION_PAGE_SIZE, offset: 0 })
  })

  it("parses page and limit from query", () => {
    const params = parseTransactionPagination(new URLSearchParams("page=3&limit=10"))
    expect(params).toEqual({ page: 3, limit: 10, offset: 20 })
  })

  it("caps limit at 50", () => {
    const params = parseTransactionPagination(new URLSearchParams("limit=999"))
    expect(params.limit).toBe(50)
  })
})

describe("buildPaginationMeta", () => {
  it("calculates total pages", () => {
    expect(buildPaginationMeta(1, 20, 100)).toEqual({
      page: 1,
      limit: 20,
      total: 100,
      totalPages: 5,
    })
  })

  it("handles empty total", () => {
    expect(buildPaginationMeta(1, 20, 0).totalPages).toBe(0)
  })
})

describe("paginateArray", () => {
  it("slices items by page", () => {
    const items = [1, 2, 3, 4, 5, 6, 7]
    const result = paginateArray(items, 2, PRODUCT_PAGE_SIZE)
    expect(result.items).toEqual([6, 7])
    expect(result.pagination).toEqual({
      page: 2,
      limit: PRODUCT_PAGE_SIZE,
      total: 7,
      totalPages: 2,
    })
  })
})
