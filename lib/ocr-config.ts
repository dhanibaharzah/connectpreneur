/** OCR (Tesseract) is disabled on Vercel by default — enable explicitly on Pro plan. */
export function isKtpOcrEnabled(): boolean {
  return (
    process.env.KTP_OCR_ENABLED === "true" ||
    (process.env.KTP_OCR_ENABLED !== "false" && process.env.VERCEL !== "1")
  )
}

export function isAktaOcrEnabled(): boolean {
  return (
    process.env.AKTA_OCR_ENABLED === "true" ||
    (process.env.AKTA_OCR_ENABLED !== "false" && process.env.VERCEL !== "1")
  )
}
