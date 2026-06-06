import { afterEach, describe, expect, it } from "vitest"
import { businessCatalogUrl } from "@/lib/business-catalog-url"

describe("businessCatalogUrl", () => {
  afterEach(() => {
    delete process.env.NEXT_PUBLIC_APP_URL
  })

  it("builds catalog detail URL from slug", () => {
    expect(businessCatalogUrl("toko-abc")).toBe("https://connectpreneur.id/bisnis/toko-abc")
  })

  it("uses configured app base URL", () => {
    process.env.NEXT_PUBLIC_APP_URL = "https://example.com"
    expect(businessCatalogUrl("mitra-x")).toBe("https://example.com/bisnis/mitra-x")
  })
})
