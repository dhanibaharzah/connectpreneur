import { afterEach, describe, expect, it } from "vitest"
import {
  appUrl,
  belanjaPortalUrl,
  buyerPortalUrl,
  getAppBaseUrl,
  getBelanjaPortalUrl,
  getBuyerPortalUrl,
  getMitraPortalUrl,
  mitraPortalUrl,
} from "@/lib/shared/app-url"

describe("getAppBaseUrl", () => {
  afterEach(() => {
    delete process.env.NEXT_PUBLIC_APP_URL
    delete process.env.NEXT_PUBLIC_BUYER_PORTAL_URL
    delete process.env.NEXT_PUBLIC_MITRA_PORTAL_URL
    delete process.env.NEXT_PUBLIC_BELANJA_PORTAL_URL
  })

  it("uses NEXT_PUBLIC_APP_URL when set", () => {
    process.env.NEXT_PUBLIC_APP_URL = "https://example.com/"
    expect(getAppBaseUrl()).toBe("https://example.com")
  })

  it("falls back to connectpreneur.id", () => {
    delete process.env.NEXT_PUBLIC_APP_URL
    expect(getAppBaseUrl()).toBe("https://connectpreneur.id")
  })
})

describe("appUrl", () => {
  it("joins base and path on main domain", () => {
    expect(appUrl("/invoice/abc")).toBe("https://connectpreneur.id/invoice/abc")
  })

  it("adds slash when path has none", () => {
    expect(appUrl("invoice/abc")).toBe("https://connectpreneur.id/invoice/abc")
  })
})

describe("portal URLs", () => {
  afterEach(() => {
    delete process.env.NEXT_PUBLIC_APP_URL
    delete process.env.NEXT_PUBLIC_BUYER_PORTAL_URL
    delete process.env.NEXT_PUBLIC_MITRA_PORTAL_URL
    delete process.env.NEXT_PUBLIC_BELANJA_PORTAL_URL
  })

  it("derives belanja portal from main app URL", () => {
    expect(getBelanjaPortalUrl()).toBe("https://belanja.connectpreneur.id")
    expect(belanjaPortalUrl()).toBe("https://belanja.connectpreneur.id")
    expect(belanjaPortalUrl("/akun")).toBe("https://belanja.connectpreneur.id/akun")
  })

  it("aliases buyer portal to belanja", () => {
    expect(getBuyerPortalUrl()).toBe("https://belanja.connectpreneur.id")
    expect(buyerPortalUrl()).toBe("https://belanja.connectpreneur.id/akun")
    expect(buyerPortalUrl("/akun")).toBe("https://belanja.connectpreneur.id/akun")
  })

  it("derives mitra portal from main app URL", () => {
    expect(getMitraPortalUrl()).toBe("https://mitra.connectpreneur.id")
    expect(mitraPortalUrl()).toBe("https://mitra.connectpreneur.id")
  })

  it("uses explicit portal env when set", () => {
    process.env.NEXT_PUBLIC_BELANJA_PORTAL_URL = "https://shop.example.com/"
    process.env.NEXT_PUBLIC_MITRA_PORTAL_URL = "https://mitra.example.com"
    expect(belanjaPortalUrl("/akun")).toBe("https://shop.example.com/akun")
    expect(buyerPortalUrl()).toBe("https://shop.example.com/akun")
    expect(mitraPortalUrl()).toBe("https://mitra.example.com")
  })
})
