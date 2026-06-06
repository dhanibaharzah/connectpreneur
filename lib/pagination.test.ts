import { describe, expect, it } from "vitest"
import {
  buildPaginationMeta,
  DEFAULT_TRANSACTION_PAGE_SIZE,
  parseTransactionPagination,
} from "@/lib/pagination"

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
