import { sql } from "@/lib/sql"
import { normalizePhoneDigits } from "@/lib/phone"
import type { Transaction } from "@/types/transaction"
import {
  BUYER_TOP_ORDERS_THRESHOLD,
  BUYER_TOP_POINTS_THRESHOLD,
  POINTS_PER_TRANSACTION,
  type BuyerBadgeLevel,
  type BuyerProfile,
  type GamificationAwardResult,
  type PointLedgerEntry,
  type TrustTier,
} from "@/types/gamification"

export {
  POINTS_PER_TRANSACTION,
  BUYER_TOP_POINTS_THRESHOLD,
  BUYER_TOP_ORDERS_THRESHOLD,
} from "@/types/gamification"

export function calculateBuyerBadge(
  completedOrders: number,
  totalPoints: number,
): BuyerBadgeLevel {
  if (
    completedOrders >= BUYER_TOP_ORDERS_THRESHOLD ||
    totalPoints >= BUYER_TOP_POINTS_THRESHOLD
  ) {
    return "top"
  }
  if (completedOrders >= 1) return "verified"
  return "new"
}

export function calculateTrustTier(
  completedOrders: number,
  failedAfterInvoice: number,
): TrustTier | null {
  const total = completedOrders + failedAfterInvoice
  if (completedOrders >= 10) return "star"
  if (total >= 5 && completedOrders / total >= 0.9) return "trusted"
  if (total >= 3 && failedAfterInvoice === 0 && completedOrders >= 3) {
    return "hundred_percent"
  }
  return null
}

export async function isTransactionPointsAwarded(transactionId: number): Promise<boolean> {
  const rows = await sql`
    SELECT id FROM point_ledger
    WHERE transaction_id = ${transactionId}
      AND event_type = 'transaction_completed'
    LIMIT 1
  `
  return rows.length > 0
}

export async function awardPointsForCompletedTransaction(
  transaction: Transaction,
): Promise<GamificationAwardResult | null> {
  if (await isTransactionPointsAwarded(transaction.id)) {
    return null
  }

  const phone = normalizePhoneDigits(transaction.buyerPhone)
  const businessId = transaction.businessId

  const [existingBuyer] = await sql`
    SELECT phone, display_name, total_points, badge_level, completed_orders
    FROM buyer_profiles WHERE phone = ${phone}
  `

  const previousBuyerBadge = (existingBuyer?.badge_level as BuyerBadgeLevel) ?? "new"
  const buyerCompleted = ((existingBuyer?.completed_orders as number) ?? 0) + 1
  const buyerPoints = ((existingBuyer?.total_points as number) ?? 0) + POINTS_PER_TRANSACTION
  const newBuyerBadge = calculateBuyerBadge(buyerCompleted, buyerPoints)

  const [existingBusiness] = await sql`
    SELECT gamification_points, gamification_completed_orders, gamification_failed_after_invoice, trust_tier
    FROM businesses WHERE id = ${businessId}
  `

  if (!existingBusiness) return null

  const previousTrustTier = (existingBusiness.trust_tier as TrustTier | null) ?? null
  const bizCompleted =
    ((existingBusiness.gamification_completed_orders as number) ?? 0) + 1
  const bizFailed =
    (existingBusiness.gamification_failed_after_invoice as number) ?? 0
  const bizPoints =
    ((existingBusiness.gamification_points as number) ?? 0) + POINTS_PER_TRANSACTION
  const newTrustTier = calculateTrustTier(bizCompleted, bizFailed)

  await sql`
    INSERT INTO point_ledger (entity_type, entity_id, transaction_id, points, event_type)
    VALUES ('buyer', ${phone}, ${transaction.id}, ${POINTS_PER_TRANSACTION}, 'transaction_completed')
    ON CONFLICT (transaction_id, entity_type, event_type) DO NOTHING
  `

  await sql`
    INSERT INTO point_ledger (entity_type, entity_id, transaction_id, points, event_type)
    VALUES ('business', ${String(businessId)}, ${transaction.id}, ${POINTS_PER_TRANSACTION}, 'transaction_completed')
    ON CONFLICT (transaction_id, entity_type, event_type) DO NOTHING
  `

  const [ledgerCheck] = await sql`
    SELECT COUNT(*)::int AS count FROM point_ledger
    WHERE transaction_id = ${transaction.id} AND event_type = 'transaction_completed'
  `
  if ((ledgerCheck?.count as number) < 2) {
    return null
  }

  await sql`
    INSERT INTO buyer_profiles (phone, display_name, total_points, badge_level, completed_orders)
    VALUES (
      ${phone},
      ${transaction.buyerName},
      ${buyerPoints},
      ${newBuyerBadge},
      ${buyerCompleted}
    )
    ON CONFLICT (phone) DO UPDATE SET
      display_name = COALESCE(buyer_profiles.display_name, EXCLUDED.display_name),
      total_points = ${buyerPoints},
      badge_level = ${newBuyerBadge},
      completed_orders = ${buyerCompleted},
      updated_at = NOW()
  `

  await sql`
    UPDATE businesses SET
      gamification_points = ${bizPoints},
      gamification_completed_orders = ${bizCompleted},
      trust_tier = ${newTrustTier},
      updated_at = NOW()
    WHERE id = ${businessId}
  `

  return {
    buyer: {
      phone,
      pointsEarned: POINTS_PER_TRANSACTION,
      totalPoints: buyerPoints,
      badgeLevel: newBuyerBadge,
      previousBadgeLevel: previousBuyerBadge,
      completedOrders: buyerCompleted,
    },
    business: {
      businessId,
      pointsEarned: POINTS_PER_TRANSACTION,
      totalPoints: bizPoints,
      trustTier: newTrustTier,
      previousTrustTier,
      completedOrders: bizCompleted,
    },
  }
}

export async function getBuyerProfile(phone: string): Promise<BuyerProfile | null> {
  const normalized = normalizePhoneDigits(phone)
  const [row] = await sql`
    SELECT phone, display_name, total_points, badge_level, completed_orders
    FROM buyer_profiles WHERE phone = ${normalized}
  `
  if (!row) return null
  return {
    phone: row.phone as string,
    displayName: row.display_name as string | null,
    totalPoints: row.total_points as number,
    badgeLevel: row.badge_level as BuyerBadgeLevel,
    completedOrders: row.completed_orders as number,
  }
}

export async function getOrCreateBuyerProfileFromTransactions(
  phone: string,
): Promise<BuyerProfile> {
  const normalized = normalizePhoneDigits(phone)
  const existing = await getBuyerProfile(normalized)
  if (existing) return existing

  const [latest] = await sql`
    SELECT buyer_name FROM transactions
    WHERE buyer_phone = ${normalized}
    ORDER BY created_at DESC LIMIT 1
  `

  return {
    phone: normalized,
    displayName: (latest?.buyer_name as string) ?? null,
    totalPoints: 0,
    badgeLevel: "new",
    completedOrders: 0,
  }
}

export async function getPointLedgerForBuyer(phone: string): Promise<PointLedgerEntry[]> {
  const normalized = normalizePhoneDigits(phone)
  const rows = await sql`
    SELECT pl.id, pl.entity_type, pl.entity_id, pl.transaction_id, pl.points,
           pl.event_type, pl.created_at, t.reference_no
    FROM point_ledger pl
    LEFT JOIN transactions t ON t.id = pl.transaction_id
    WHERE pl.entity_type = 'buyer' AND pl.entity_id = ${normalized}
    ORDER BY pl.created_at DESC
    LIMIT 50
  `
  return rows.map((row) => ({
    id: row.id as number,
    entityType: row.entity_type as "buyer",
    entityId: row.entity_id as string,
    transactionId: row.transaction_id as number,
    points: row.points as number,
    eventType: row.event_type as string,
    createdAt: row.created_at as string,
    referenceNo: row.reference_no as string | undefined,
  }))
}

export async function getBusinessGamificationStats(businessId: number) {
  const [row] = await sql`
    SELECT gamification_points, gamification_completed_orders,
           gamification_failed_after_invoice, trust_tier
    FROM businesses WHERE id = ${businessId}
  `
  if (!row) return null
  return {
    totalPoints: (row.gamification_points as number) ?? 0,
    completedOrders: (row.gamification_completed_orders as number) ?? 0,
    failedAfterInvoice: (row.gamification_failed_after_invoice as number) ?? 0,
    trustTier: (row.trust_tier as TrustTier | null) ?? null,
  }
}
