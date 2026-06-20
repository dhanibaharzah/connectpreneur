import { describe, expect, it } from "vitest"
import {
  parseMarketplaceSort,
  parseMarketplaceTipe,
  parseMarketplaceFilters,
} from "@/lib/marketplace-product-filters"

describe("parseMarketplaceSort", () => {
  it("accepts valid sort values", () => {
    expect(parseMarketplaceSort("harga_asc")).toBe("harga_asc")
    expect(parseMarketplaceSort("harga_desc")).toBe("harga_desc")
    expect(parseMarketplaceSort("nama_asc")).toBe("nama_asc")
    expect(parseMarketplaceSort("terbaru")).toBe("terbaru")
  })

  it("defaults to terbaru for invalid values", () => {
    expect(parseMarketplaceSort("invalid")).toBe("terbaru")
    expect(parseMarketplaceSort(null)).toBe("terbaru")
  })
})

describe("parseMarketplaceTipe", () => {
  it("accepts produk and jasa", () => {
    expect(parseMarketplaceTipe("produk")).toBe("produk")
    expect(parseMarketplaceTipe("jasa")).toBe("jasa")
  })

  it("defaults to all for other values", () => {
    expect(parseMarketplaceTipe("all")).toBe("all")
    expect(parseMarketplaceTipe("invalid")).toBe("all")
  })
})

describe("parseMarketplaceFilters", () => {
  it("parses search params with defaults", () => {
    const params = new URLSearchParams()
    const filters = parseMarketplaceFilters(params)
    expect(filters.search).toBe("")
    expect(filters.tipe).toBe("all")
    expect(filters.location).toBe("")
    expect(filters.sort).toBe("terbaru")
    expect(filters.page).toBe(1)
    expect(filters.limit).toBe(20)
  })

  it("parses provided filter values", () => {
    const params = new URLSearchParams({
      search: "kopi",
      tipe: "produk",
      location: "Jakarta",
      sort: "harga_asc",
      page: "2",
      limit: "10",
    })
    const filters = parseMarketplaceFilters(params)
    expect(filters.search).toBe("kopi")
    expect(filters.tipe).toBe("produk")
    expect(filters.location).toBe("Jakarta")
    expect(filters.sort).toBe("harga_asc")
    expect(filters.page).toBe(2)
    expect(filters.limit).toBe(10)
  })

  it("caps limit at max page size", () => {
    const params = new URLSearchParams({ limit: "999" })
    expect(parseMarketplaceFilters(params).limit).toBe(50)
  })
})
