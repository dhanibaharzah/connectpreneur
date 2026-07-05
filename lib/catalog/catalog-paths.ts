export interface KatalogPaths {
  catalogPath: string
  onSubdomain: boolean
}

export interface DaftarPaths {
  daftarPath: string
  onSubdomain: boolean
}

export function resolveKatalogPaths(host: string): KatalogPaths {
  const hostname = host.split(":")[0]
  const onSubdomain = hostname.startsWith("katalog.")

  return {
    catalogPath: onSubdomain ? "/" : "/katalog",
    onSubdomain,
  }
}

export function resolveDaftarPaths(host: string): DaftarPaths {
  const hostname = host.split(":")[0]
  const onSubdomain = hostname.startsWith("daftar.")

  return {
    daftarPath: onSubdomain ? "/" : "/daftar-mitra",
    onSubdomain,
  }
}

export async function getKatalogPathsFromHeaders(): Promise<KatalogPaths> {
  const { headers } = await import("next/headers")
  const headerStore = await headers()
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host") ?? ""
  return resolveKatalogPaths(host)
}

export async function getDaftarPathsFromHeaders(): Promise<DaftarPaths> {
  const { headers } = await import("next/headers")
  const headerStore = await headers()
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host") ?? ""
  return resolveDaftarPaths(host)
}
