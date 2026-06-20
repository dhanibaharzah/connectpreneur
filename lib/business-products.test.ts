import { describe, expect, it, vi, beforeEach } from "vitest"
import {
  isValidProductImageUrl,
  parseHargaMulai,
  parseProductDeskripsi,
  parseProductImageUrl,
  parseProductName,
  generateUniqueProductSlug,
} from "@/lib/business-products"

const sqlMock = vi.hoisted(() => vi.fn())

vi.mock("@/lib/sql", () => ({
  sql: sqlMock,
}))

describe("parseProductName", () => {
  it("accepts valid names", () => {
    expect(parseProductName("  Kopi Arabica  ")).toBe("Kopi Arabica")
  })

  it("rejects empty names", () => {
    expect(parseProductName("   ")).toBeNull()
  })
})

describe("parseProductDeskripsi", () => {
  it("accepts optional descriptions", () => {
    expect(parseProductDeskripsi("")).toBe("")
    expect(parseProductDeskripsi(null)).toBe("")
    expect(parseProductDeskripsi("  Kopi pilihan  ")).toBe("Kopi pilihan")
  })

  it("rejects overly long descriptions", () => {
    expect(parseProductDeskripsi("a".repeat(1001))).toBeNull()
  })
})

describe("parseProductImageUrl", () => {
  it("accepts optional image urls", () => {
    expect(parseProductImageUrl("")).toBe("")
    expect(parseProductImageUrl(null)).toBe("")
  })

  it("validates managed storage urls", () => {
    expect(
      isValidProductImageUrl("https://abc.blob.vercel-storage.com/products/test.jpg"),
    ).toBe(true)
    expect(
      isValidProductImageUrl("https://pub-abc123.r2.dev/products/test.jpg"),
    ).toBe(true)
    expect(parseProductImageUrl("https://evil.example.com/x.jpg")).toBeNull()
  })
})

describe("parseHargaMulai", () => {
  it("parses integers", () => {
    expect(parseHargaMulai(50000)).toBe(50000)
    expect(parseHargaMulai("50000")).toBe(50000)
  })

  it("strips Indonesian thousand separators", () => {
    expect(parseHargaMulai("50.000")).toBe(50000)
  })

  it("rejects invalid values", () => {
    expect(parseHargaMulai(-1)).toBeNull()
    expect(parseHargaMulai(12.5)).toBeNull()
    expect(parseHargaMulai("abc")).toBeNull()
  })
})

describe("generateUniqueProductSlug", () => {
  beforeEach(() => {
    sqlMock.mockReset()
  })

  it("returns base slug when unused", async () => {
    sqlMock.mockResolvedValueOnce([])
    await expect(generateUniqueProductSlug("Kopi Arabica")).resolves.toBe("kopi-arabica")
  })

  it("appends numeric suffix on collision", async () => {
    sqlMock.mockResolvedValueOnce([{ "?column?": 1 }]).mockResolvedValueOnce([])
    await expect(generateUniqueProductSlug("Kopi Arabica")).resolves.toBe("kopi-arabica-2")
  })

  it("excludes current product id when checking collisions", async () => {
    sqlMock.mockResolvedValueOnce([])
    await expect(generateUniqueProductSlug("Kopi Arabica", 42)).resolves.toBe("kopi-arabica")
    expect(sqlMock).toHaveBeenCalledTimes(1)
  })
})
