export const LEGACY_BLOB_HOST = "blob.vercel-storage.com"

/** Cloudflare R2 public bucket URL host suffix (e.g. pub-abc123.r2.dev) */
export const R2_PUBLIC_HOST_SUFFIX = "r2.dev"

const LEGACY_DEV_HOSTS = ["blob.v0.app", "vusercontent.net"] as const

function getConfiguredR2PublicHostname(): string | null {
  const base = process.env.NEXT_PUBLIC_R2_PUBLIC_BASE_URL ?? process.env.R2_PUBLIC_BASE_URL
  if (!base) return null

  try {
    return new URL(base).hostname
  } catch {
    return null
  }
}

export function isR2PublicHost(hostname: string): boolean {
  const configured = getConfiguredR2PublicHostname()
  if (configured && hostnameMatches(hostname, configured)) return true

  return hostname === R2_PUBLIC_HOST_SUFFIX || hostname.endsWith(`.${R2_PUBLIC_HOST_SUFFIX}`)
}

export function getManagedStorageHosts(): string[] {
  const hosts = [LEGACY_BLOB_HOST]
  const configured = getConfiguredR2PublicHostname()
  if (configured) hosts.push(configured)
  return hosts
}

export function getAllowedImageHosts(): string[] {
  return [...getManagedStorageHosts(), ...LEGACY_DEV_HOSTS]
}

function hostnameMatches(host: string, allowed: string): boolean {
  return host === allowed || host.endsWith(`.${allowed}`)
}

export function isManagedStorageUrl(url: string): boolean {
  if (!url || url.includes("..")) return false

  try {
    const parsed = new URL(url)
    if (parsed.protocol !== "https:") return false

    if (isR2PublicHost(parsed.hostname)) return true

    return getManagedStorageHosts().some((host) => hostnameMatches(parsed.hostname, host))
  } catch {
    return false
  }
}

export function isDeletableStorageUrl(url: string): boolean {
  return isManagedStorageUrl(url)
}

export function isAllowedImageHost(url: string): boolean {
  if (!url || url.includes("..")) return false
  if (url.startsWith("/")) {
    return url.startsWith("/images/") || url.startsWith("/public/") || url === "/placeholder.svg"
  }
  if (url.includes("placeholder.svg")) return true

  try {
    const parsed = new URL(url)
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return false

    if (isR2PublicHost(parsed.hostname)) return true

    return getAllowedImageHosts().some((host) => hostnameMatches(parsed.hostname, host))
  } catch {
    return false
  }
}
