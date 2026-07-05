import { shouldPassthroughPath } from "@/lib/marketplace/portal-routing"

export type CatalogPortalSubdomainAction =
  | { type: "passthrough" }
  | { type: "redirect"; pathname: string }
  | { type: "rewrite"; pathname: string }
  | { type: "redirect_to_main" }

export function resolveKatalogSubdomainAction(pathname: string): CatalogPortalSubdomainAction {
  if (shouldPassthroughPath(pathname)) {
    return { type: "passthrough" }
  }

  if (pathname === "/katalog") {
    return { type: "redirect", pathname: "/" }
  }

  if (pathname === "/") {
    return { type: "rewrite", pathname: "/katalog" }
  }

  if (pathname.startsWith("/bisnis/")) {
    return { type: "passthrough" }
  }

  return { type: "redirect_to_main" }
}

export function resolveDaftarSubdomainAction(pathname: string): CatalogPortalSubdomainAction {
  if (shouldPassthroughPath(pathname)) {
    return { type: "passthrough" }
  }

  if (pathname === "/daftar-mitra") {
    return { type: "redirect", pathname: "/" }
  }

  if (pathname === "/") {
    return { type: "rewrite", pathname: "/daftar-mitra" }
  }

  return { type: "redirect_to_main" }
}
