import { describe, expect, it } from "vitest"
import { buildWhatsappPrefillMessage, formatCurrency } from "@/lib/transactions"

describe("buildWhatsappPrefillMessage", () => {
  it("includes reference and buyer details", () => {
    const message = buildWhatsappPrefillMessage({
      businessName: "Toko ABC",
      buyerName: "Budi",
      referenceNo: "CP-20260606-0001",
      quantity: 50,
      notes: "Ingin jadi reseller",
    })

    expect(message).toContain("Toko ABC")
    expect(message).toContain("Budi")
    expect(message).toContain("CP-20260606-0001")
    expect(message).toContain("Kuantitas: 50")
    expect(message).toContain("Ingin jadi reseller")
  })

  it("shows dash for zero quantity", () => {
    const message = buildWhatsappPrefillMessage({
      businessName: "Toko ABC",
      buyerName: "Budi",
      referenceNo: "CP-20260606-0002",
      quantity: 0,
      notes: "Partnership umum",
    })

    expect(message).toContain("Kuantitas: -")
  })
})

describe("formatCurrency", () => {
  it("formats IDR without decimals", () => {
    const formatted = formatCurrency(1500000)
    expect(formatted).toContain("1.500.000")
    expect(formatted).toMatch(/Rp/)
  })
})
