import { describe, expect, it } from "vitest"
import { formatPhoneDisplay, normalizePhoneDigits, phonesMatch } from "@/lib/phone"

describe("normalizePhoneDigits", () => {
  it("converts leading 0 to 62", () => {
    expect(normalizePhoneDigits("081317679056")).toBe("6281317679056")
  })

  it("keeps 62 prefix", () => {
    expect(normalizePhoneDigits("6281317679056")).toBe("6281317679056")
  })

  it("strips non-digits", () => {
    expect(normalizePhoneDigits("+62 813-1767-9056")).toBe("6281317679056")
  })
})

describe("phonesMatch", () => {
  it("matches 08 and 62 formats", () => {
    expect(phonesMatch("081317679056", "6281317679056")).toBe(true)
  })

  it("does not match different numbers", () => {
    expect(phonesMatch("081111111111", "6281317679056")).toBe(false)
  })
})

describe("formatPhoneDisplay", () => {
  it("converts 62 to 0 prefix for display", () => {
    expect(formatPhoneDisplay("6281317679056")).toBe("081317679056")
  })
})
