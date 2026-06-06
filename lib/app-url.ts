const DEFAULT_MAIN = "https://connectpreneur.id"

export function getAppBaseUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || DEFAULT_MAIN
}

export function appUrl(path: string): string {
  const base = getAppBaseUrl()
  return `${base}${path.startsWith("/") ? path : `/${path}`}`
}

function resolvePortalBaseUrl(envKey: string, subdomain: string): string {
  const explicit = process.env[envKey]?.replace(/\/$/, "")
  if (explicit) return explicit

  try {
    const main = new URL(getAppBaseUrl())
    const host = main.hostname.replace(/^www\./, "")
    main.hostname = `${subdomain}.${host}`
    return main.origin
  } catch {
    return `https://${subdomain}.connectpreneur.id`
  }
}

export function getBuyerPortalUrl(): string {
  return resolvePortalBaseUrl("NEXT_PUBLIC_BUYER_PORTAL_URL", "buyer")
}

export function getMitraPortalUrl(): string {
  return resolvePortalBaseUrl("NEXT_PUBLIC_MITRA_PORTAL_URL", "mitra")
}

export function buyerPortalUrl(path = "/"): string {
  const base = getBuyerPortalUrl()
  if (!path || path === "/") return base
  return `${base}${path.startsWith("/") ? path : `/${path}`}`
}

export function mitraPortalUrl(path = "/"): string {
  const base = getMitraPortalUrl()
  if (!path || path === "/") return base
  return `${base}${path.startsWith("/") ? path : `/${path}`}`
}
