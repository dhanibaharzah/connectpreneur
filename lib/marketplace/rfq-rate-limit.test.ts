import { describe, expect, it } from "vitest"
import { checkRfqRateLimit } from "@/lib/marketplace/rfq-rate-limit"

describe("checkRfqRateLimit", () => {
  it("allows first request from an IP", () => {
    const ip = `test-ip-${Date.now()}-a`
    expect(checkRfqRateLimit(ip)).toBe(true)
  })

  it("allows up to 5 requests per hour", () => {
    const ip = `test-ip-${Date.now()}-b`
    for (let i = 0; i < 4; i++) {
      expect(checkRfqRateLimit(ip)).toBe(true)
    }
    expect(checkRfqRateLimit(ip)).toBe(true)
  })

  it("blocks after 5 requests from same IP", () => {
    const ip = `test-ip-${Date.now()}-c`
    for (let i = 0; i < 5; i++) {
      checkRfqRateLimit(ip)
    }
    expect(checkRfqRateLimit(ip)).toBe(false)
  })
})
