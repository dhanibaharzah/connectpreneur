import { describe, expect, it } from "vitest"
import {
  MAX_OTP_ATTEMPTS,
  generateOtpCode,
  hasExceededOtpAttempts,
} from "@/lib/auth/otp-session"

describe("otp-session", () => {
  it("generates six-digit codes", () => {
    const otp = generateOtpCode()
    expect(otp).toMatch(/^\d{6}$/)
  })

  it("tracks max otp attempts", () => {
    expect(hasExceededOtpAttempts(MAX_OTP_ATTEMPTS - 1)).toBe(false)
    expect(hasExceededOtpAttempts(MAX_OTP_ATTEMPTS)).toBe(true)
  })
})
