import { describe, expect, it } from "vitest"
import { isLegacyMarketplaceProductId } from "@/lib/marketplace/marketplace-product-resolve"

describe("isLegacyMarketplaceProductId", () => {
  it("detects numeric legacy ids", () => {
    expect(isLegacyMarketplaceProductId("123")).toBe(true)
    expect(isLegacyMarketplaceProductId("0")).toBe(true)
  })

  it("rejects slug values", () => {
    expect(isLegacyMarketplaceProductId("kopi-arabica")).toBe(false)
    expect(isLegacyMarketplaceProductId("123abc")).toBe(false)
  })
})
