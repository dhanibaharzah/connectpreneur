/** Legal document URLs — admin-only; never expose on public APIs. */
const SENSITIVE_KEYS = ["ktp_url", "akta_pendirian_url", "legalitas_url"] as const

export function stripSensitiveBusinessFields<T extends Record<string, unknown>>(business: T) {
  const result = { ...business }
  for (const key of SENSITIVE_KEYS) {
    delete result[key]
  }
  return result
}
