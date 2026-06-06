import { afterEach, describe, expect, it } from "vitest"
import { appUrl, getAppBaseUrl } from "@/lib/app-url"

describe("getAppBaseUrl", () => {
  afterEach(() => {
    delete process.env.NEXT_PUBLIC_APP_URL
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
  it("joins base and path", () => {
    expect(appUrl("/umkm")).toBe("https://connectpreneur.id/umkm")
  })

  it("adds slash when path has none", () => {
    expect(appUrl("invoice/abc")).toBe("https://connectpreneur.id/invoice/abc")
  })
})
