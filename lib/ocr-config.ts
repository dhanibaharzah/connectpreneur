/** Ubah nilai lalu redeploy. Di Vercel Hobby tetap false (batas 10s); Pro bisa true. */
export const KTP_OCR_ENABLED = true
export const AKTA_OCR_ENABLED = true

export function isKtpOcrEnabled(): boolean {
  return KTP_OCR_ENABLED
}

export function isAktaOcrEnabled(): boolean {
  return AKTA_OCR_ENABLED
}
