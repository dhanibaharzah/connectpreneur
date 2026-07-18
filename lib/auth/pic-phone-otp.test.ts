import { describe, expect, it } from "vitest"
import {
  createPicPhoneProofToken,
  isSamePicPhone,
  isValidPicPhone,
  phoneConflictErrorMessage,
  requirePicPhoneProof,
  verifyPicPhoneProofToken,
} from "@/lib/auth/pic-phone-otp"

describe("pic-phone-otp helpers", () => {
  it("validates phone length", () => {
    expect(isValidPicPhone("081234567890")).toBe(true)
    expect(isValidPicPhone("6281234567890")).toBe(true)
    expect(isValidPicPhone("123")).toBe(false)
  })

  it("detects same phone across formats", () => {
    expect(isSamePicPhone("081234567890", "6281234567890")).toBe(true)
    expect(isSamePicPhone("081111111111", "6281234567890")).toBe(false)
  })

  it("formats conflict messages", () => {
    expect(
      phoneConflictErrorMessage({
        kind: "mitra",
        businessId: 1,
        businessName: "Toko A",
      }),
    ).toBe("Nomor sudah terdaftar")
    expect(phoneConflictErrorMessage({ kind: "buyer" })).toBe("Nomor sudah terdaftar")
  })

  it("creates and verifies proof tokens", async () => {
    const token = await createPicPhoneProofToken("081234567890")
    expect(await verifyPicPhoneProofToken(token, "6281234567890")).toBe(true)
    expect(await verifyPicPhoneProofToken(token, "081111111111")).toBe(false)
    expect(await verifyPicPhoneProofToken("bad", "6281234567890")).toBe(false)
  })

  it("skips proof when phone unchanged", async () => {
    const result = await requirePicPhoneProof({
      phone: "081234567890",
      currentPhone: "6281234567890",
    })
    expect(result).toEqual({ ok: true })
  })

  it("requires proof token when phone changed", async () => {
    const missing = await requirePicPhoneProof({
      phone: "081234567890",
      currentPhone: "6281111111111",
    })
    expect(missing).toEqual({
      ok: false,
      error: "Nomor WhatsApp harus diverifikasi OTP terlebih dahulu",
    })
  })
})
