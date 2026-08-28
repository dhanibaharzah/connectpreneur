import { afterEach, describe, expect, it } from "vitest"
import { getAdminSignupCode, isValidAdminSignupCode } from "@/lib/auth/admin-signup-code"

describe("admin signup code", () => {
  afterEach(() => {
    delete process.env.ADMIN_SIGNUP_CODE
  })

  it("defaults to the DPD/DPC unique code", () => {
    delete process.env.ADMIN_SIGNUP_CODE
    expect(getAdminSignupCode()).toBe("200498")
  })

  it("accepts the matching code, including surrounding whitespace", () => {
    expect(isValidAdminSignupCode("200498")).toBe(true)
    expect(isValidAdminSignupCode(" 200498 ")).toBe(true)
  })

  it("rejects missing or incorrect codes", () => {
    expect(isValidAdminSignupCode("")).toBe(false)
    expect(isValidAdminSignupCode("123456")).toBe(false)
    expect(isValidAdminSignupCode(200498)).toBe(false)
    expect(isValidAdminSignupCode(undefined)).toBe(false)
  })

  it("uses ADMIN_SIGNUP_CODE when set", () => {
    process.env.ADMIN_SIGNUP_CODE = "999111"
    expect(isValidAdminSignupCode("999111")).toBe(true)
    expect(isValidAdminSignupCode("200498")).toBe(false)
  })
})
