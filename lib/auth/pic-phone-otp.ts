import { sql } from "@/lib/sql"
import { SignJWT, jwtVerify } from "jose"
import {
  normalizePhoneDigits,
  phonesMatch,
} from "@/lib/shared/phone"
import {
  createOtpExpiryDate,
  generateOtpCode,
  hashOtpCode,
  hasExceededOtpAttempts,
  verifyOtpCode,
} from "@/lib/auth/otp-session"

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "dev-only-secret-do-not-use-in-production",
)

export const PIC_PHONE_PROOF_TTL = "30m"
export const PIC_PHONE_PROOF_TYPE = "pic_phone_proof"

const otpRateLimit = new Map<string, { count: number; resetAt: number }>()

export type PhoneRegistrationConflict =
  | { kind: "mitra"; businessId: number; businessName: string }
  | { kind: "buyer" }

export function checkPicPhoneOtpRateLimit(phone: string): boolean {
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

export function isValidPicPhone(phone: string): boolean {
  const digits = normalizePhoneDigits(phone)
  return digits.length >= 10 && digits.length <= 15
}

export function phoneConflictErrorMessage(_conflict: PhoneRegistrationConflict): string {
  return "Nomor sudah terdaftar"
}

/**
 * Checks whether a WhatsApp number is already used by another mitra PIC or a buyer account.
 * Pass excludeBusinessId when editing an existing mitra so their current number stays allowed.
 */
export async function findPhoneRegistrationConflict(
  phone: string,
  options?: { excludeBusinessId?: number | null },
): Promise<PhoneRegistrationConflict | null> {
  const normalized = normalizePhoneDigits(phone)
  if (!normalized) return null

  const excludeId =
    options?.excludeBusinessId != null && Number.isFinite(Number(options.excludeBusinessId))
      ? Number(options.excludeBusinessId)
      : null

  const mitraRows =
    excludeId != null
      ? await sql`
          SELECT id, nama, kontak_pic
          FROM businesses
          WHERE kontak_pic IS NOT NULL
            AND TRIM(kontak_pic) <> ''
            AND id <> ${excludeId}
        `
      : await sql`
          SELECT id, nama, kontak_pic
          FROM businesses
          WHERE kontak_pic IS NOT NULL
            AND TRIM(kontak_pic) <> ''
        `

  for (const row of mitraRows) {
    if (phonesMatch(String(row.kontak_pic), normalized)) {
      return {
        kind: "mitra",
        businessId: Number(row.id),
        businessName: String(row.nama || "Mitra"),
      }
    }
  }

  const buyerRows = await sql`
    SELECT phone FROM buyer_profiles WHERE phone IS NOT NULL AND TRIM(phone) <> ''
  `
  for (const row of buyerRows) {
    if (phonesMatch(String(row.phone), normalized)) {
      return { kind: "buyer" }
    }
  }

  return null
}

export async function assertPhoneAvailableForPic(params: {
  phone: string
  excludeBusinessId?: number | null
}): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!isValidPicPhone(params.phone)) {
    return { ok: false, error: "Format nomor WhatsApp tidak valid" }
  }
  const conflict = await findPhoneRegistrationConflict(params.phone, {
    excludeBusinessId: params.excludeBusinessId,
  })
  if (conflict) {
    return { ok: false, error: phoneConflictErrorMessage(conflict) }
  }
  return { ok: true }
}

export async function createPicPhoneOtpChallenge(phone: string): Promise<string> {
  const otp = generateOtpCode()
  const otpHash = await hashOtpCode(otp)
  const expiresAt = createOtpExpiryDate()
  const normalized = normalizePhoneDigits(phone)

  await sql`
    INSERT INTO pic_phone_otp_challenges (phone, otp_hash, expires_at)
    VALUES (${normalized}, ${otpHash}, ${expiresAt.toISOString()})
  `

  return otp
}

export async function verifyPicPhoneOtpChallenge(phone: string, otp: string): Promise<boolean> {
  const normalized = normalizePhoneDigits(phone)
  const rows = await sql`
    SELECT id, otp_hash, attempts
    FROM pic_phone_otp_challenges
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
    UPDATE pic_phone_otp_challenges SET attempts = attempts + 1 WHERE id = ${challenge.id}
  `

  if (valid) {
    await sql`DELETE FROM pic_phone_otp_challenges WHERE phone = ${normalized}`
  }

  return valid
}

export async function createPicPhoneProofToken(phone: string): Promise<string> {
  const normalized = normalizePhoneDigits(phone)
  return new SignJWT({
    type: PIC_PHONE_PROOF_TYPE,
    phone: normalized,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(PIC_PHONE_PROOF_TTL)
    .sign(JWT_SECRET)
}

export async function verifyPicPhoneProofToken(
  token: string | null | undefined,
  phone: string,
): Promise<boolean> {
  if (!token?.trim() || !phone?.trim()) return false

  try {
    const { payload } = await jwtVerify(token.trim(), JWT_SECRET)
    if (payload.type !== PIC_PHONE_PROOF_TYPE) return false
    if (typeof payload.phone !== "string") return false
    return phonesMatch(payload.phone, phone)
  } catch {
    return false
  }
}

/** Returns true when phone is unchanged from the existing stored value (no OTP needed). */
export function isSamePicPhone(
  nextPhone: string | null | undefined,
  currentPhone: string | null | undefined,
): boolean {
  if (!nextPhone?.trim()) return false
  if (!currentPhone?.trim()) return false
  return phonesMatch(nextPhone, currentPhone)
}

export async function requirePicPhoneProof(params: {
  phone: string
  proofToken?: string | null
  currentPhone?: string | null
  excludeBusinessId?: number | null
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const phone = params.phone?.trim()
  if (!phone) {
    return { ok: false, error: "Nomor WhatsApp PIC wajib diisi" }
  }
  if (!isValidPicPhone(phone)) {
    return { ok: false, error: "Format nomor WhatsApp tidak valid" }
  }
  if (isSamePicPhone(phone, params.currentPhone)) {
    return { ok: true }
  }

  const valid = await verifyPicPhoneProofToken(params.proofToken, phone)
  if (!valid) {
    return {
      ok: false,
      error: "Nomor WhatsApp harus diverifikasi OTP terlebih dahulu",
    }
  }

  const availability = await assertPhoneAvailableForPic({
    phone,
    excludeBusinessId: params.excludeBusinessId,
  })
  if (!availability.ok) return availability

  return { ok: true }
}
