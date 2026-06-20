import { describe, expect, it } from "vitest"
import { buildUmkmContactBuyerMessage, buildWhatsappPrefillMessage } from "@/lib/integrations/whatsapp-messages"

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

describe("buildUmkmContactBuyerMessage", () => {
  it("includes RFQ context for mitra-initiated negotiation", () => {
    const message = buildUmkmContactBuyerMessage({
      businessName: "Toko ABC",
      buyerName: "Budi",
      referenceNo: "CP-20260606-0001",
      quantity: 50,
      notes: "Ingin jadi reseller",
    })

    expect(message).toContain("Halo Budi")
    expect(message).toContain("Toko ABC")
    expect(message).not.toContain("*Toko ABC*")
    expect(message).toContain("CP-20260606-0001")
    expect(message).toContain("Kuantitas: 50")
    expect(message).toContain("Ingin jadi reseller")
    expect(message).toContain("mendiskusikan penawaran")
  })

  it("falls back when business name is empty", () => {
    const message = buildUmkmContactBuyerMessage({
      businessName: "",
      buyerName: "Budi",
      referenceNo: "CP-20260606-0001",
      quantity: 1,
      notes: "Test",
    })

    expect(message).toContain("Saya dari Mitra UMKM kami (ConnectPreneur)")
    expect(message).not.toContain("**")
  })
})
