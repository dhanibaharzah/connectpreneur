import { describe, expect, it, vi, beforeEach } from "vitest"
import {
  BUYER_TOP_ORDERS_THRESHOLD,
  BUYER_TOP_POINTS_THRESHOLD,
  POINTS_PER_TRANSACTION,
} from "@/types/gamification"
import { calculateBuyerBadge, calculateTrustTier, ensureBuyerProfile, getPointLedgerForBuyerPaginated } from "@/lib/umkm/gamification"

const sqlMock = vi.hoisted(() => vi.fn())

vi.mock("@/lib/sql", () => ({
  sql: sqlMock,
}))

describe("calculateBuyerBadge", () => {
  it("returns new for zero completed orders and low points", () => {
    expect(calculateBuyerBadge(0, 0)).toBe("new")
    expect(calculateBuyerBadge(0, 499)).toBe("new")
  })

  it("returns verified after first completed order", () => {
    expect(calculateBuyerBadge(1, 50)).toBe("verified")
    expect(calculateBuyerBadge(4, 200)).toBe("verified")
  })

  it("returns top at 5+ completed orders", () => {
    expect(calculateBuyerBadge(BUYER_TOP_ORDERS_THRESHOLD, 250)).toBe("top")
  })

  it("returns top at 500+ points", () => {
    expect(calculateBuyerBadge(2, BUYER_TOP_POINTS_THRESHOLD)).toBe("top")
  })
})

describe("calculateTrustTier", () => {
  it("returns null with no closed orders", () => {
    expect(calculateTrustTier(0, 0)).toBeNull()
  })

  it("returns hundred_percent at 3 completed with no failures", () => {
    expect(calculateTrustTier(3, 0)).toBe("hundred_percent")
  })

  it("does not return hundred_percent when there are failures", () => {
    expect(calculateTrustTier(3, 1)).not.toBe("hundred_percent")
  })

  it("returns trusted at 90%+ with min 5 total orders", () => {
    expect(calculateTrustTier(5, 0)).toBe("trusted")
    expect(calculateTrustTier(9, 1)).toBe("trusted")
  })

  it("returns star at 10+ completed orders", () => {
    expect(calculateTrustTier(10, 0)).toBe("star")
    expect(calculateTrustTier(10, 2)).toBe("star")
  })
})

describe("points constants", () => {
  it("awards 50 points per transaction", () => {
    expect(POINTS_PER_TRANSACTION).toBe(50)
  })
})

describe("ensureBuyerProfile", () => {
  beforeEach(() => {
    sqlMock.mockReset()
  })

  it("inserts and returns profile with display name", async () => {
    sqlMock.mockResolvedValueOnce([])
    sqlMock.mockResolvedValueOnce([
      {
        phone: "628123456789",
        display_name: "Budi",
        total_points: 0,
        badge_level: "new",
        completed_orders: 0,
      },
    ])

    const profile = await ensureBuyerProfile("08123456789", "Budi")
    expect(profile.displayName).toBe("Budi")
    expect(profile.phone).toBe("628123456789")
    expect(profile.badgeLevel).toBe("new")
  })

  it("returns fallback profile when row is not found after insert", async () => {
    sqlMock.mockResolvedValueOnce([])
    sqlMock.mockResolvedValueOnce([])

    const profile = await ensureBuyerProfile("08123456789", null)
    expect(profile.displayName).toBeNull()
    expect(profile.phone).toBe("628123456789")
    expect(profile.completedOrders).toBe(0)
  })
})

describe("getPointLedgerForBuyerPaginated", () => {
  beforeEach(() => {
    sqlMock.mockReset()
  })

  it("returns paginated ledger entries with total count", async () => {
    sqlMock.mockResolvedValueOnce([{ total: 3 }])
    sqlMock.mockResolvedValueOnce([
      {
        id: 1,
        entity_type: "buyer",
        entity_id: "628123456789",
        transaction_id: 10,
        points: 50,
        event_type: "transaction_completed",
        created_at: "2026-01-01T00:00:00.000Z",
        reference_no: "TX-001",
      },
    ])

    const result = await getPointLedgerForBuyerPaginated("08123456789", {
      limit: 20,
      offset: 0,
    })

    expect(result.total).toBe(3)
    expect(result.items).toHaveLength(1)
    expect(result.items[0].referenceNo).toBe("TX-001")
  })
})
