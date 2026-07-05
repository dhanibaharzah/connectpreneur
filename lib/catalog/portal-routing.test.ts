import { describe, expect, it } from "vitest"
import {
  resolveDaftarSubdomainAction,
  resolveKatalogSubdomainAction,
} from "@/lib/catalog/portal-routing"

describe("resolveKatalogSubdomainAction", () => {
  it("rewrites root to internal katalog route", () => {
    expect(resolveKatalogSubdomainAction("/")).toEqual({
      type: "rewrite",
      pathname: "/katalog",
    })
  })

  it("redirects legacy /katalog path to clean URL", () => {
    expect(resolveKatalogSubdomainAction("/katalog")).toEqual({
      type: "redirect",
      pathname: "/",
    })
  })

  it("allows business detail pages on katalog subdomain", () => {
    expect(resolveKatalogSubdomainAction("/bisnis/toko-abc")).toEqual({ type: "passthrough" })
  })

  it("redirects unknown paths to main site", () => {
    expect(resolveKatalogSubdomainAction("/belanja")).toEqual({ type: "redirect_to_main" })
  })
})

describe("resolveDaftarSubdomainAction", () => {
  it("rewrites root to internal daftar-mitra route", () => {
    expect(resolveDaftarSubdomainAction("/")).toEqual({
      type: "rewrite",
      pathname: "/daftar-mitra",
    })
  })

  it("redirects legacy /daftar-mitra path to clean URL", () => {
    expect(resolveDaftarSubdomainAction("/daftar-mitra")).toEqual({
      type: "redirect",
      pathname: "/",
    })
  })

  it("redirects unknown paths to main site", () => {
    expect(resolveDaftarSubdomainAction("/katalog")).toEqual({ type: "redirect_to_main" })
  })
})
