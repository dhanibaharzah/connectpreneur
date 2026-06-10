import { describe, expect, it } from "vitest"
import { getConnectScoreTier, isWajibPerbaikan } from "@/lib/connect-score-tier"

describe("getConnectScoreTier", () => {
  it("returns unggulan for score 90-100 with documents", () => {
    expect(getConnectScoreTier(90, { hasAkta: true, hasLegalitas: true })).toBe("unggulan")
    expect(getConnectScoreTier(100, { hasAkta: true })).toBe("unggulan")
  })

  it("returns berkualitas for score 70-89", () => {
    expect(getConnectScoreTier(70, { hasAkta: true, hasLegalitas: true })).toBe("berkualitas")
    expect(getConnectScoreTier(89, { hasAkta: true })).toBe("berkualitas")
  })

  it("returns dasar for score 60-69", () => {
    expect(getConnectScoreTier(60, { hasAkta: true, hasLegalitas: true })).toBe("dasar")
    expect(getConnectScoreTier(69, { hasLegalitas: true })).toBe("dasar")
  })

  it("returns wajib perbaikan when score below 60", () => {
    expect(getConnectScoreTier(59, { hasAkta: true, hasLegalitas: true })).toBe("wajib_perbaikan")
  })

  it("returns wajib perbaikan when akta and legalitas are missing and not verified", () => {
    expect(getConnectScoreTier(95, { hasAkta: false, hasLegalitas: false })).toBe("wajib_perbaikan")
  })

  it("returns dasar when verified but legalitas is missing", () => {
    expect(getConnectScoreTier(95, { hasAkta: false, hasLegalitas: false, isVerified: true })).toBe("dasar")
    expect(getConnectScoreTier(80, { hasAkta: true, hasLegalitas: false, isVerified: true })).toBe("dasar")
    expect(getConnectScoreTier(50, { hasAkta: false, hasLegalitas: false, isVerified: true })).toBe("dasar")
  })

  it("returns score-based tier when verified with legalitas", () => {
    expect(getConnectScoreTier(95, { hasAkta: true, hasLegalitas: true, isVerified: true })).toBe("unggulan")
  })

  it("returns null when score is missing", () => {
    expect(getConnectScoreTier(null)).toBeNull()
  })
})

describe("isWajibPerbaikan", () => {
  it("is true when both documents are missing", () => {
    expect(isWajibPerbaikan(80, { hasAkta: false, hasLegalitas: false })).toBe(true)
  })

  it("is false when at least one document exists and score is sufficient", () => {
    expect(isWajibPerbaikan(80, { hasAkta: true, hasLegalitas: false })).toBe(false)
  })
})
