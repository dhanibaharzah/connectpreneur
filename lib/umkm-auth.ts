import { sql } from "@/lib/sql"
import { SignJWT, jwtVerify } from "jose"
import bcrypt from "bcryptjs"
import { cookies } from "next/headers"
import type { NextRequest } from "next/server"
import { normalizePhoneDigits, phonesMatch } from "@/lib/phone"

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "dev-only-secret-do-not-use-in-production",
)

export interface UmkmSession {
  businessId: number
  phone: string
  businessName: string
}

const OTP_TTL_MS = 5 * 60 * 1000
const SESSION_TTL = "7d"
const MAX_OTP_ATTEMPTS = 5

const otpRateLimit = new Map<string, { count: number; resetAt: number }>()

export function checkOtpRateLimit(phone: string): boolean {
  const key = normalizePhoneDigits(phone)
  const now = Date.now()
  const entry = otpRateLimit.get(key)

  if (!entry || now > entry.resetAt) {
    otpRateLimit.set(key, { count: 1, resetAt: now + 15 * 60 * 1000 })
    return true
  }

  if (entry.count >= 3) return false
  entry.count++
  return true
}

export async function findBusinessesByPhone(phone: string) {
  const normalized = normalizePhoneDigits(phone)
  const rows = await sql`
    SELECT id, nama, slug, kontak_pic, bank_name, bank_account_number, bank_account_name
    FROM businesses
    WHERE is_active = true AND kontak_pic IS NOT NULL
  `
  return rows.filter((row) => phonesMatch(String(row.kontak_pic), normalized))
}

export async function createOtpChallenge(businessId: number, phone: string): Promise<string> {
  const otp = String(Math.floor(100000 + Math.random() * 900000))
  const otpHash = await bcrypt.hash(otp, 10)
  const expiresAt = new Date(Date.now() + OTP_TTL_MS)

  await sql`
    INSERT INTO umkm_otp_challenges (business_id, phone, otp_hash, expires_at)
    VALUES (${businessId}, ${normalizePhoneDigits(phone)}, ${otpHash}, ${expiresAt.toISOString()})
  `

  return otp
}

export async function verifyOtpChallenge(
  businessId: number,
  phone: string,
  otp: string,
): Promise<boolean> {
  const normalized = normalizePhoneDigits(phone)
  const rows = await sql`
    SELECT id, otp_hash, expires_at, attempts
    FROM umkm_otp_challenges
    WHERE business_id = ${businessId}
      AND phone = ${normalized}
      AND expires_at > NOW()
    ORDER BY created_at DESC
    LIMIT 1
  `

  if (rows.length === 0) return false

  const challenge = rows[0]
  if ((challenge.attempts as number) >= MAX_OTP_ATTEMPTS) return false

  const valid = await bcrypt.compare(otp, challenge.otp_hash as string)

  await sql`
    UPDATE umkm_otp_challenges SET attempts = attempts + 1 WHERE id = ${challenge.id}
  `

  if (valid) {
    await sql`DELETE FROM umkm_otp_challenges WHERE business_id = ${businessId} AND phone = ${normalized}`
  }

  return valid
}

export async function createUmkmSession(session: UmkmSession): Promise<string> {
  return new SignJWT({
    type: "umkm",
    businessId: session.businessId,
    phone: session.phone,
    businessName: session.businessName,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(SESSION_TTL)
    .sign(JWT_SECRET)
}

export async function verifyUmkmSession(token: string): Promise<UmkmSession | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    if (payload.type !== "umkm") return null
    return {
      businessId: payload.businessId as number,
      phone: payload.phone as string,
      businessName: payload.businessName as string,
    }
  } catch {
    return null
  }
}

export async function getUmkmSessionFromRequest(request: NextRequest): Promise<UmkmSession | null> {
  const token = request.cookies.get("umkm_session")?.value
  if (!token) return null
  return verifyUmkmSession(token)
}

export async function getUmkmSession(): Promise<UmkmSession | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get("umkm_session")?.value
  if (!token) return null
  return verifyUmkmSession(token)
}

export function umkmSessionCookieOptions(token: string) {
  return {
    name: "umkm_session",
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  }
}

export async function updateBusinessBankDetails(
  businessId: number,
  bank: { bankName: string; accountNumber: string; accountName: string },
): Promise<void> {
  await sql`
    UPDATE businesses SET
      bank_name = ${bank.bankName},
      bank_account_number = ${bank.accountNumber},
      bank_account_name = ${bank.accountName},
      updated_at = NOW()
    WHERE id = ${businessId}
  `
}

export async function getBusinessBankDetails(businessId: number) {
  const [row] = await sql`
    SELECT bank_name, bank_account_number, bank_account_name, nama, kontak_pic, slug, logo_url
    FROM businesses WHERE id = ${businessId}
  `
  return row ?? null
}

export async function getBusinessCatalogInfo(businessId: number) {
  const [row] = await sql`
    SELECT id, slug, nama, logo_url
    FROM businesses
    WHERE id = ${businessId} AND is_active = true
  `
  if (!row?.slug) return null
  return {
    id: row.id as number,
    slug: row.slug as string,
    nama: row.nama as string,
    logoUrl: (row.logo_url as string | null) ?? null,
  }
}
