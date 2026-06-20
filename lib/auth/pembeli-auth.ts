import { sql } from "@/lib/sql"
import { SignJWT, jwtVerify } from "jose"
import type { NextRequest } from "next/server"
import { normalizePhoneDigits, getBuyerPhoneQueryVariants } from "@/lib/shared/phone"
import { checkOtpRateLimit } from "@/lib/auth/umkm-auth"
import {
  SESSION_TTL,
  createOtpExpiryDate,
  generateOtpCode,
  hashOtpCode,
  hasExceededOtpAttempts,
  verifyOtpCode,
} from "@/lib/auth/otp-session"
import { getOrCreateBuyerProfileFromTransactions, ensureBuyerProfile } from "@/lib/umkm/gamification"
import type { BuyerProfile } from "@/types/gamification"
import { transformTransactionRow, type TransactionRow } from "@/types/transaction"

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "dev-only-secret-do-not-use-in-production",
)

export interface PembeliSession {
  phone: string
  displayName: string | null
}


export { checkOtpRateLimit }

export async function buyerHasTransactions(phone: string): Promise<boolean> {
  const variants = getBuyerPhoneQueryVariants(phone)
  const [row] = await sql`
    SELECT COUNT(*)::int AS total FROM transactions
    WHERE buyer_phone = ANY(${variants})
  `
  return ((row?.total as number) ?? 0) > 0
}

export function pickBuyerDisplayName(params: {
  hasTransactions: boolean
  profileDisplayName: string | null
  latestTransactionBuyerName: string | null
  formName?: string
}): string {
  if (params.hasTransactions) {
    return (
      params.profileDisplayName?.trim() ||
      params.latestTransactionBuyerName?.trim() ||
      params.formName?.trim() ||
      ""
    )
  }
  return params.formName?.trim() || ""
}

export async function resolveBuyerProfileAfterOtp(
  phone: string,
  displayName?: string,
): Promise<BuyerProfile> {
  const hasTransactions = await buyerHasTransactions(phone)
  if (!hasTransactions) {
    return ensureBuyerProfile(phone, displayName?.trim() || null)
  }

  const profile = await getOrCreateBuyerProfileFromTransactions(phone)
  const transactions = await findTransactionsByPhone(phone)
  const resolvedName = pickBuyerDisplayName({
    hasTransactions: true,
    profileDisplayName: profile.displayName,
    latestTransactionBuyerName: transactions[0]?.buyerName ?? null,
    formName: displayName,
  })

  return {
    ...profile,
    displayName: resolvedName || profile.displayName,
  }
}

export async function resolveBuyerDisplayName(phone: string, formName?: string): Promise<string> {
  const hasTransactions = await buyerHasTransactions(phone)
  if (!hasTransactions) {
    return formName?.trim() || ""
  }

  const profile = await getOrCreateBuyerProfileFromTransactions(phone)
  const transactions = await findTransactionsByPhone(phone)
  return pickBuyerDisplayName({
    hasTransactions: true,
    profileDisplayName: profile.displayName,
    latestTransactionBuyerName: transactions[0]?.buyerName ?? null,
    formName,
  })
}

export async function findTransactionsByPhone(phone: string) {
  const variants = getBuyerPhoneQueryVariants(phone)
  const rows = await sql`
    SELECT t.*, b.nama AS business_name, b.slug AS business_slug
    FROM transactions t
    JOIN businesses b ON b.id = t.business_id
    WHERE t.buyer_phone = ANY(${variants})
    ORDER BY t.created_at DESC
  `
  return rows.map((row) => transformTransactionRow(row as TransactionRow))
}

export async function getTransactionsForBuyerPaginated(
  phone: string,
  params: { limit: number; offset: number },
) {
  const variants = getBuyerPhoneQueryVariants(phone)

  const [countRow] = await sql`
    SELECT COUNT(*)::int AS total FROM transactions
    WHERE buyer_phone = ANY(${variants})
  `

  const rows = await sql`
    SELECT t.*, b.nama AS business_name, b.slug AS business_slug
    FROM transactions t
    JOIN businesses b ON b.id = t.business_id
    WHERE t.buyer_phone = ANY(${variants})
    ORDER BY t.created_at DESC
    LIMIT ${params.limit} OFFSET ${params.offset}
  `

  return {
    items: rows.map((row) => transformTransactionRow(row as TransactionRow)),
    total: (countRow?.total as number) ?? 0,
  }
}

export async function createPembeliOtpChallenge(phone: string): Promise<string> {
  const otp = generateOtpCode()
  const otpHash = await hashOtpCode(otp)
  const expiresAt = createOtpExpiryDate()
  const normalized = normalizePhoneDigits(phone)

  await sql`
    INSERT INTO pembeli_otp_challenges (phone, otp_hash, expires_at)
    VALUES (${normalized}, ${otpHash}, ${expiresAt.toISOString()})
  `

  return otp
}

export async function verifyPembeliOtpChallenge(phone: string, otp: string): Promise<boolean> {
  const normalized = normalizePhoneDigits(phone)
  const rows = await sql`
    SELECT id, otp_hash, expires_at, attempts
    FROM pembeli_otp_challenges
    WHERE phone = ${normalized}
      AND expires_at > NOW()
    ORDER BY created_at DESC
    LIMIT 1
  `

  if (rows.length === 0) return false

  const challenge = rows[0]
  if (hasExceededOtpAttempts(challenge.attempts as number)) return false

  const valid = await verifyOtpCode(otp, challenge.otp_hash as string)

  await sql`
    UPDATE pembeli_otp_challenges SET attempts = attempts + 1 WHERE id = ${challenge.id}
  `

  if (valid) {
    await sql`DELETE FROM pembeli_otp_challenges WHERE phone = ${normalized}`
  }

  return valid
}

export async function createPembeliSession(session: PembeliSession): Promise<string> {
  return new SignJWT({
    type: "pembeli",
    phone: normalizePhoneDigits(session.phone),
    displayName: session.displayName,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(SESSION_TTL)
    .sign(JWT_SECRET)
}

export async function verifyPembeliSession(token: string): Promise<PembeliSession | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    if (payload.type !== "pembeli") return null
    return {
      phone: payload.phone as string,
      displayName: (payload.displayName as string | null) ?? null,
    }
  } catch {
    return null
  }
}

export async function getPembeliSessionFromRequest(
  request: NextRequest,
): Promise<PembeliSession | null> {
  const token = request.cookies.get("pembeli_session")?.value
  if (!token) return null
  return verifyPembeliSession(token)
}

export function pembeliSessionCookieOptions(token: string) {
  return {
    name: "pembeli_session",
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  }
}

export function clearPembeliSessionCookie() {
  return {
    name: "pembeli_session",
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 0,
  }
}
