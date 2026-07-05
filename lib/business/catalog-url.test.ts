import { afterEach, describe, expect, it } from "vitest"
import { businessCatalogUrl } from "@/lib/business/catalog-url"

describe("businessCatalogUrl", () => {
  afterEach(() => {
    delete process.env.NEXT_PUBLIC_APP_URL
    delete process.env.NEXT_PUBLIC_KATALOG_PORTAL_URL
  })

  it("builds catalog detail URL from slug", () => {
    expect(businessCatalogUrl("toko-abc")).toBe("https://katalog.connectpreneur.id/bisnis/toko-abc")
  })

  it("uses configured katalog portal URL", () => {
    process.env.NEXT_PUBLIC_KATALOG_PORTAL_URL = "https://catalog.example.com"
    expect(businessCatalogUrl("mitra-x")).toBe("https://catalog.example.com/bisnis/mitra-x")
  })
})
