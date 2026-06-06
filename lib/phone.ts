export function normalizePhoneDigits(phone: string): string {
  const digits = phone.replace(/[^0-9]/g, "")
  if (digits.startsWith("0")) return `62${digits.slice(1)}`
  if (digits.startsWith("62")) return digits
  return digits
}

export function phonesMatch(a: string, b: string): boolean {
  return normalizePhoneDigits(a) === normalizePhoneDigits(b)
}

export function formatPhoneDisplay(phone: string): string {
  const digits = normalizePhoneDigits(phone)
  if (digits.startsWith("62")) return `0${digits.slice(2)}`
  return phone
}

/** Variants stored in DB for matching buyer_phone in SQL. */
export function getBuyerPhoneQueryVariants(phone: string): string[] {
  const normalized = normalizePhoneDigits(phone)
  const variants = new Set<string>([normalized])
  if (normalized.startsWith("62")) {
    variants.add(`0${normalized.slice(2)}`)
  }
  return [...variants]
}
