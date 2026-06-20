import { describe, expect, it } from "vitest"
import {
  parseBannerImageUrl,
  parseBannerLinkUrl,
  parseBannerSortOrder,
  parseBannerTitle,
} from "@/lib/shop-banners"

describe("parseBannerTitle", () => {
  it("accepts optional titles", () => {
    expect(parseBannerTitle("  Promo  ")).toBe("Promo")
    expect(parseBannerTitle("")).toBeNull()
    expect(parseBannerTitle(null)).toBeNull()
  })

  it("rejects overly long titles", () => {
    expect(parseBannerTitle("a".repeat(256))).toBeNull()
  })
})

describe("parseBannerImageUrl", () => {
  it("requires allowed storage hosts", () => {
    expect(
      parseBannerImageUrl("https://pub-abc123.r2.dev/banners/test.jpg"),
    ).toBe("https://pub-abc123.r2.dev/banners/test.jpg")
    expect(parseBannerImageUrl("https://evil.example.com/x.jpg")).toBeNull()
    expect(parseBannerImageUrl("")).toBeNull()
  })
})

describe("parseBannerLinkUrl", () => {
  it("accepts relative and absolute urls", () => {
    expect(parseBannerLinkUrl("/produk/1")).toBe("/produk/1")
    expect(parseBannerLinkUrl("https://connectpreneur.id")).toBe("https://connectpreneur.id")
    expect(parseBannerLinkUrl("")).toBeNull()
  })

  it("rejects invalid schemes", () => {
    expect(parseBannerLinkUrl("javascript:alert(1)")).toBeNull()
  })
})

describe("parseBannerSortOrder", () => {
  it("accepts non-negative integers", () => {
    expect(parseBannerSortOrder(0)).toBe(0)
    expect(parseBannerSortOrder("3")).toBe(3)
  })

  it("rejects invalid values", () => {
    expect(parseBannerSortOrder(-1)).toBeNull()
    expect(parseBannerSortOrder(1.5)).toBeNull()
  })
})
