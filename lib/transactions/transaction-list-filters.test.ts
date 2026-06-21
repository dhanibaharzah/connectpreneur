import { describe, expect, it } from "vitest"
import {
  buildTransactionQueryParams,
  buildTransactionSearchPattern,
  parseTransactionListFilters,
  parseTransactionSort,
} from "@/lib/transactions/transaction-list-filters"

describe("parseTransactionSort", () => {
  it("defaults to terbaru", () => {
    expect(parseTransactionSort(null)).toBe("terbaru")
    expect(parseTransactionSort("invalid")).toBe("terbaru")
  })

  it("accepts valid sort values", () => {
    expect(parseTransactionSort("total_desc")).toBe("total_desc")
    expect(parseTransactionSort("nama_asc")).toBe("nama_asc")
  })
})

describe("parseTransactionListFilters", () => {
  it("parses search, sort, and pagination", () => {
    const filters = parseTransactionListFilters(
      new URLSearchParams("search=kopi&sort=total_desc&page=2"),
    )
    expect(filters.search).toBe("kopi")
    expect(filters.sort).toBe("total_desc")
    expect(filters.page).toBe(2)
    expect(filters.offset).toBe(20)
  })
})

describe("buildTransactionQueryParams", () => {
  it("omits default sort and empty search", () => {
    const params = buildTransactionQueryParams({ page: 1 })
    expect(params.toString()).toBe("page=1")
  })

  it("includes search and sort when set", () => {
    const params = buildTransactionQueryParams({
      search: "CP-2026",
      sort: "terlama",
      page: 3,
    })
    expect(params.get("search")).toBe("CP-2026")
    expect(params.get("sort")).toBe("terlama")
    expect(params.get("page")).toBe("3")
  })
})

describe("buildTransactionSearchPattern", () => {
  it("escapes wildcard characters", () => {
    expect(buildTransactionSearchPattern("100%")).toBe("%100\\%%")
  })
})
