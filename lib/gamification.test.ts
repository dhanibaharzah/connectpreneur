import { describe, expect, it } from "vitest"
import {
  BUYER_TOP_ORDERS_THRESHOLD,
  BUYER_TOP_POINTS_THRESHOLD,
  POINTS_PER_TRANSACTION,
} from "@/types/gamification"
import { calculateBuyerBadge, calculateTrustTier } from "@/lib/gamification"

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
