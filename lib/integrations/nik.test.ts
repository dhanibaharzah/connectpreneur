import { describe, expect, it } from "vitest"
import { extractNikCandidates, hasValidNik, isPlausibleNik } from "@/lib/integrations/nik"

describe("NIK validation", () => {
  it("accepts plausible 16-digit NIK", () => {
    expect(isPlausibleNik("3174010101010001")).toBe(true)
  })

  it("rejects invalid province code", () => {
    expect(isPlausibleNik("0104010101010001")).toBe(false)
  })

  it("finds NIK split across spaces by OCR", () => {
    const text = "NIK\n11750209019 70005\nNAMA MOHAMMAD HUSEIN"
    expect(hasValidNik(text)).toBe(true)
    expect(extractNikCandidates(text).length).toBeGreaterThan(0)
  })

  it("finds contiguous NIK", () => {
    const text = "NIK 3174010101010001\nNAMA BUDI SANTOSO"
    expect(extractNikCandidates(text)).toContain("3174010101010001")
    expect(hasValidNik(text)).toBe(true)
  })
})
