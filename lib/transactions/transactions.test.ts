import { describe, expect, it } from "vitest"
import { formatCurrency } from "@/lib/transactions/transactions"

describe("formatCurrency", () => {
  it("formats IDR without decimals", () => {
    const formatted = formatCurrency(1500000)
    expect(formatted).toContain("1.500.000")
    expect(formatted).toMatch(/Rp/)
  })
})
