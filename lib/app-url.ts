export function getAppBaseUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || "https://connectpreneur.id"
}

export function appUrl(path: string): string {
  const base = getAppBaseUrl()
  return `${base}${path.startsWith("/") ? path : `/${path}`}`
}
