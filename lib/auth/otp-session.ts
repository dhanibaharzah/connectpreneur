import bcrypt from "bcryptjs"

export const OTP_TTL_MS = 5 * 60 * 1000
export const OTP_LENGTH = 6
export const SESSION_TTL = "7d"
export const MAX_OTP_ATTEMPTS = 5

export function generateOtpCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000))
}

export function createOtpExpiryDate(now = Date.now()): Date {
  return new Date(now + OTP_TTL_MS)
}

export async function hashOtpCode(otp: string): Promise<string> {
  return bcrypt.hash(otp, 10)
}

export async function verifyOtpCode(otp: string, hash: string): Promise<boolean> {
  return bcrypt.compare(otp, hash)
}

export function hasExceededOtpAttempts(attempts: number): boolean {
  return attempts >= MAX_OTP_ATTEMPTS
}
