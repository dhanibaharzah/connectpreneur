/** Ubah nilai lalu redeploy. OCR memakai OCR_SERVICE_URL + OCR_SERVICE_API_KEY. */
export const KTP_OCR_ENABLED = true
export const AKTA_OCR_ENABLED = true

export function isKtpOcrEnabled(): boolean {
  return KTP_OCR_ENABLED
}

export function isAktaOcrEnabled(): boolean {
  return AKTA_OCR_ENABLED
}
