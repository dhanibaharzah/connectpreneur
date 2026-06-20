import { describe, expect, it, vi, beforeEach } from "vitest"
import { pickBuyerDisplayName, resolveBuyerDisplayName, resolveBuyerProfileAfterOtp } from "@/lib/auth/pembeli-auth"

const sqlMock = vi.hoisted(() => vi.fn())
const getOrCreateMock = vi.hoisted(() => vi.fn())

vi.mock("@/lib/sql", () => ({
  sql: sqlMock,
}))

vi.mock("@/lib/umkm/gamification", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/umkm/gamification")>()
  return {
    ...actual,
    getOrCreateBuyerProfileFromTransactions: getOrCreateMock,
  }
})

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

describe("resolveBuyerDisplayName", () => {
  beforeEach(() => {
    sqlMock.mockReset()
    getOrCreateMock.mockReset()
  })

  it("returns form name for buyers without transactions", async () => {
    sqlMock.mockResolvedValueOnce([])
    await expect(resolveBuyerDisplayName("08123", "Siti")).resolves.toBe("Siti")
    expect(getOrCreateMock).not.toHaveBeenCalled()
  })

  it("uses profile and transaction names for buyers with transactions", async () => {
    sqlMock
      .mockResolvedValueOnce([{ total: 1 }])
      .mockResolvedValueOnce([
        {
          buyer_name: "Budi",
          business_name: "Toko",
          business_slug: "toko",
        },
      ])
    getOrCreateMock.mockResolvedValueOnce({
      phone: "628123",
      displayName: "Budi Profil",
      totalPoints: 0,
      badgeLevel: "verified",
      completedOrders: 1,
    })

    await expect(resolveBuyerDisplayName("08123", "Nama Form")).resolves.toBe("Budi Profil")
  })
})

describe("resolveBuyerProfileAfterOtp", () => {
  beforeEach(() => {
    sqlMock.mockReset()
    getOrCreateMock.mockReset()
  })

  it("creates profile for buyers without transactions", async () => {
    sqlMock.mockResolvedValueOnce([])
    sqlMock.mockResolvedValueOnce([])
    sqlMock.mockResolvedValueOnce([])

    const profile = await resolveBuyerProfileAfterOtp("08123", "Siti")
    expect(profile.displayName).toBe("Siti")
    expect(getOrCreateMock).not.toHaveBeenCalled()
  })
})
