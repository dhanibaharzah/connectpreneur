const rfqRateLimit = new Map<string, { count: number; resetAt: number }>()

export function checkRfqRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rfqRateLimit.get(ip)

  if (!entry || now > entry.resetAt) {
    rfqRateLimit.set(ip, { count: 1, resetAt: now + 60 * 60 * 1000 })
    return true
  }

  if (entry.count >= 5) return false
  entry.count++
  return true
}
