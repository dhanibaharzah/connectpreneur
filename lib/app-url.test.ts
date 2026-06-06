import { afterEach, describe, expect, it } from "vitest"
import {
  appUrl,
  buyerPortalUrl,
  getAppBaseUrl,
  getBuyerPortalUrl,
  getMitraPortalUrl,
  mitraPortalUrl,
} from "@/lib/app-url"

describe("getAppBaseUrl", () => {
  afterEach(() => {
    delete process.env.NEXT_PUBLIC_APP_URL
    delete process.env.NEXT_PUBLIC_BUYER_PORTAL_URL
    delete process.env.NEXT_PUBLIC_MITRA_PORTAL_URL
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
  })

  it("derives buyer portal from main app URL", () => {
    expect(getBuyerPortalUrl()).toBe("https://buyer.connectpreneur.id")
    expect(buyerPortalUrl()).toBe("https://buyer.connectpreneur.id")
  })

  it("derives mitra portal from main app URL", () => {
    expect(getMitraPortalUrl()).toBe("https://mitra.connectpreneur.id")
    expect(mitraPortalUrl()).toBe("https://mitra.connectpreneur.id")
  })

  it("uses explicit portal env when set", () => {
    process.env.NEXT_PUBLIC_BUYER_PORTAL_URL = "https://buyer.example.com/"
    process.env.NEXT_PUBLIC_MITRA_PORTAL_URL = "https://mitra.example.com"
    expect(buyerPortalUrl()).toBe("https://buyer.example.com")
    expect(mitraPortalUrl()).toBe("https://mitra.example.com")
  })
})
