export function shouldPassthroughPath(pathname: string): boolean {
  return (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/geo") ||
    pathname === "/favicon.ico" ||
    pathname === "/icon.svg" ||
    pathname.startsWith("/images/")
  )
}

export function resolveBelanjaBuyerRedirectPath(pathname: string): string {
  return pathname === "/pembeli" || pathname === "/" ? "/akun" : pathname
}

export type BelanjaSubdomainAction =
  | { type: "passthrough" }
  | { type: "redirect"; pathname: string }
  | { type: "rewrite"; pathname: string }
  | { type: "redirect_to_main" }

export function resolveBelanjaSubdomainAction(pathname: string): BelanjaSubdomainAction {
  if (shouldPassthroughPath(pathname)) {
    return { type: "passthrough" }
  }

  if (pathname === "/belanja") {
    return { type: "redirect", pathname: "/" }
  }

  if (pathname === "/belanja/akun") {
    return { type: "redirect", pathname: "/akun" }
  }

  if (pathname.startsWith("/belanja/produk/")) {
    return { type: "redirect", pathname: pathname.replace("/belanja", "") }
  }

  if (pathname === "/akun") {
    return { type: "rewrite", pathname: "/belanja/akun" }
  }

  if (pathname.startsWith("/produk/")) {
    return { type: "rewrite", pathname: `/belanja${pathname}` }
  }

  if (pathname === "/") {
    return { type: "rewrite", pathname: "/belanja" }
  }

  return { type: "redirect_to_main" }
}
