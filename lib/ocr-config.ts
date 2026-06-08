/** Ubah nilai lalu redeploy. Di Vercel Hobby tetap false (batas 10s); Pro bisa true. */
export const KTP_OCR_ENABLED = false
export const AKTA_OCR_ENABLED = false

export function isKtpOcrEnabled(): boolean {
  if (process.env.VERCEL === "1") return KTP_OCR_ENABLED
  return true
}

export function isAktaOcrEnabled(): boolean {
  if (process.env.VERCEL === "1") return AKTA_OCR_ENABLED
  return true
}
