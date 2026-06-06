export const POINTS_PER_TRANSACTION = 50
export const BUYER_TOP_POINTS_THRESHOLD = 500
export const BUYER_TOP_ORDERS_THRESHOLD = 5

export const BUYER_BADGE_LEVELS = ["new", "verified", "top"] as const
export type BuyerBadgeLevel = (typeof BUYER_BADGE_LEVELS)[number]

export const TRUST_TIERS = ["hundred_percent", "trusted", "star"] as const
export type TrustTier = (typeof TRUST_TIERS)[number]

export const BUYER_BADGE_LABELS: Record<BuyerBadgeLevel, string> = {
  new: "Pembeli Baru",
  verified: "Pembeli Terverifikasi",
  top: "Top Pembeli",
}

export const TRUST_TIER_LABELS: Record<TrustTier, string> = {
  hundred_percent: "100% Pesanan Selesai",
  trusted: "UMKM Terpercaya",
  star: "Bintang ConnectPreneur",
}

export interface BuyerProfile {
  phone: string
  displayName: string | null
  totalPoints: number
  badgeLevel: BuyerBadgeLevel
  completedOrders: number
}

export interface PointLedgerEntry {
  id: number
  entityType: "buyer" | "business"
  entityId: string
  transactionId: number
  points: number
  eventType: string
  createdAt: string
  referenceNo?: string
}

export interface GamificationAwardResult {
  buyer: {
    phone: string
    pointsEarned: number
    totalPoints: number
    badgeLevel: BuyerBadgeLevel
    previousBadgeLevel: BuyerBadgeLevel
    completedOrders: number
  }
  business: {
    businessId: number
    pointsEarned: number
    totalPoints: number
    trustTier: TrustTier | null
    previousTrustTier: TrustTier | null
    completedOrders: number
  }
}
