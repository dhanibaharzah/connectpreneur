export interface BelanjaPaths {
  homePath: string
  onSubdomain: boolean
}

export function buildBelanjaProductPath(slug: string, onSubdomain: boolean): string {
  return onSubdomain ? `/produk/${slug}` : `/belanja/produk/${slug}`
}

export function buildBelanjaAkunPath(onSubdomain: boolean): string {
  return onSubdomain ? "/akun" : "/belanja/akun"
}

export function resolveBelanjaPaths(host: string): BelanjaPaths {
  const hostname = host.split(":")[0]
  const onSubdomain = hostname.startsWith("belanja.")

  return {
    homePath: onSubdomain ? "/" : "/belanja",
    onSubdomain,
  }
}

export async function getBelanjaPathsFromHeaders(): Promise<BelanjaPaths> {
  const { headers } = await import("next/headers")
  const headerStore = await headers()
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host") ?? ""
  return resolveBelanjaPaths(host)
}
