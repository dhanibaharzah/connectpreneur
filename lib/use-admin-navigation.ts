"use client"

/**
 * Utility functions for subdomain-aware navigation in admin pages
 * On admin.connectpreneur.id: uses /login, /
 * On connectpreneur.id: uses /admin/login, /admin
 */

export function isAdminSubdomain(): boolean {
  if (typeof window === "undefined") return false
  return window.location.hostname.startsWith("admin.")
}

export function getAdminPath(path: string): string {
  const onSubdomain = isAdminSubdomain()
  
  if (onSubdomain) {
    // On subdomain, remove /admin prefix
    if (path === "/admin") return "/"
    if (path === "/admin/login") return "/login"
    if (path.startsWith("/admin/")) return path.replace("/admin", "")
    return path
  }
  
  // On main domain, keep full paths
  return path
}

export function getLoginPath(): string {
  return getAdminPath("/admin/login")
}

export function getDashboardPath(): string {
  return getAdminPath("/admin/dashboard")
}

export function getMitraPath(): string {
  return getAdminPath("/admin/mitra")
}

export function getMembersPath(): string {
  return getAdminPath("/admin/members")
}

export function getTransaksiPath(): string {
  return getAdminPath("/admin/transaksi")
}
