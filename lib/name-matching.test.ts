import { describe, expect, it } from "vitest"
import { allNameTokensFound, extractNameFromKtpText, namesMatch, normalizePersonName } from "@/lib/name-matching"

describe("normalizePersonName", () => {
  it("strips titles and normalizes case", () => {
    expect(normalizePersonName("Dr. Budi Santoso")).toBe("BUDI SANTOSO")
    expect(normalizePersonName("Bpk. AYU NABILA")).toBe("AYU NABILA")
  })
})

describe("namesMatch", () => {
  it("matches exact and fuzzy names", () => {
    expect(namesMatch("Budi Santoso", "BUDI SANTOSO")).toBe(true)
    expect(namesMatch("Ayu Nabila", "AYU NABILA\nJAKARTA")).toBe(true)
    expect(namesMatch("Budi Santoso", "Siti Aminah")).toBe(false)
  })

  it("tolerates minor OCR typos", () => {
    expect(namesMatch("Ramadhani", "RAMADHANI")).toBe(true)
    expect(namesMatch("Ramadhani", "RAMADHAN1")).toBe(true)
  })
})

describe("extractNameFromKtpText", () => {
  it("extracts name after NAMA label", () => {
    const text = `PROVINSI DKI JAKARTA\nNIK : 3174010101010001\nNAMA\nBUDI SANTOSO`
    expect(extractNameFromKtpText(text)).toBe("BUDI SANTOSO")
  })

  it("matches when all tokens appear across OCR lines", () => {
    const ocr = `31750209019 70005\nMOHAMMAD HUSEIN RAMADHAN\nBAHARZAH`
    expect(allNameTokensFound("Mohammad Husein Ramadhani Baharzah", ocr)).toBe(true)
  })
})
