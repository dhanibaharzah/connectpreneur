import { describe, expect, it } from "vitest"
import { pickBuyerDisplayName } from "@/lib/pembeli-auth"

describe("pickBuyerDisplayName", () => {
  it("uses profile name for registered buyers", () => {
    expect(
      pickBuyerDisplayName({
        hasTransactions: true,
        profileDisplayName: "Budi Santoso",
        latestTransactionBuyerName: "Budi",
        formName: "Nama Baru",
      }),
    ).toBe("Budi Santoso")
  })

  it("falls back to latest transaction name when profile is empty", () => {
    expect(
      pickBuyerDisplayName({
        hasTransactions: true,
        profileDisplayName: null,
        latestTransactionBuyerName: "Budi Santoso",
        formName: "Nama Baru",
      }),
    ).toBe("Budi Santoso")
  })

  it("falls back to form name when no profile or transaction name", () => {
    expect(
      pickBuyerDisplayName({
        hasTransactions: true,
        profileDisplayName: null,
        latestTransactionBuyerName: null,
        formName: "Nama Baru",
      }),
    ).toBe("Nama Baru")
  })

  it("uses form name for new buyers", () => {
    expect(
      pickBuyerDisplayName({
        hasTransactions: false,
        profileDisplayName: null,
        latestTransactionBuyerName: null,
        formName: "Siti Aminah",
      }),
    ).toBe("Siti Aminah")
  })

  it("returns empty string when new buyer has no form name", () => {
    expect(
      pickBuyerDisplayName({
        hasTransactions: false,
        profileDisplayName: null,
        latestTransactionBuyerName: null,
      }),
    ).toBe("")
  })
})
