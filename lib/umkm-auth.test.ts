import { describe, expect, it } from "vitest"
import { checkOtpRateLimit } from "@/lib/umkm-auth"

describe("checkOtpRateLimit", () => {
  it("allows OTP requests under limit", () => {
    const phone = `62813${Date.now()}`
    expect(checkOtpRateLimit(phone)).toBe(true)
    expect(checkOtpRateLimit(phone)).toBe(true)
  })

  it("blocks after 3 OTP requests in window", () => {
    const phone = `62814${Date.now()}`
    checkOtpRateLimit(phone)
    checkOtpRateLimit(phone)
    checkOtpRateLimit(phone)
    expect(checkOtpRateLimit(phone)).toBe(false)
  })
})
