import { NextRequest, NextResponse } from "next/server"
import { getBelanjaPortalUrl } from "@/lib/shared/app-url"
import {
  resolveBelanjaBuyerRedirectPath,
  resolveBelanjaSubdomainAction,
  shouldPassthroughPath,
} from "@/lib/marketplace/portal-routing"

function basicAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization")
  if (!authHeader || !authHeader.startsWith("Basic ")) return false

  const username = process.env.SIGNUP_BASIC_AUTH_USERNAME
  const password = process.env.SIGNUP_BASIC_AUTH_PASSWORD
  if (!username || !password) return false

  const encoded = btoa(`${username}:${password}`)
  return authHeader === `Basic ${encoded}`
}

function getHostname(request: NextRequest): string {
  return (request.headers.get("host") || "").split(":")[0]
}

function shouldPassthrough(pathname: string): boolean {
  return shouldPassthroughPath(pathname)
}

function redirectToBelanjaPortal(request: NextRequest): NextResponse {
  const targetPath = resolveBelanjaBuyerRedirectPath(request.nextUrl.pathname)
  const target = new URL(targetPath + request.nextUrl.search, getBelanjaPortalUrl())
  return NextResponse.redirect(target, 301)
}

function handlePortalSubdomain(
  request: NextRequest,
  portalPath: "/umkm",
  extraPaths: string[] = [],
): NextResponse | null {
  const url = request.nextUrl.clone()
  const pathname = url.pathname

  if (shouldPassthrough(pathname)) {
    return null
  }

  for (const extra of extraPaths) {
    const normalized = extra.startsWith("/") ? extra : `/${extra}`
    const fullPath = `/umkm${normalized}`
    if (pathname === normalized || pathname === fullPath) {
      url.pathname = fullPath
      return NextResponse.rewrite(url)
    }
  }

  if (pathname === portalPath) {
    url.pathname = "/"
    return NextResponse.redirect(url)
  }

  if (pathname === "/") {
    url.pathname = portalPath
    return NextResponse.rewrite(url)
  }

  return redirectToMainSite(request)
}

function redirectToMainSite(request: NextRequest): NextResponse {
  const mainBase = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || "https://connectpreneur.id"
  const target = new URL(request.nextUrl.pathname + request.nextUrl.search, mainBase)
  return NextResponse.redirect(target)
}

function handleBelanjaSubdomain(request: NextRequest): NextResponse | null {
  const url = request.nextUrl.clone()
  const action = resolveBelanjaSubdomainAction(url.pathname)

  switch (action.type) {
    case "passthrough":
      return null
    case "redirect":
      url.pathname = action.pathname
      return NextResponse.redirect(url)
    case "rewrite":
      url.pathname = action.pathname
      return NextResponse.rewrite(url)
    case "redirect_to_main":
      return redirectToMainSite(request)
  }
}

export function middleware(request: NextRequest) {
  const hostname = getHostname(request)
  const url = request.nextUrl.clone()
  const isAdminSubdomain = hostname.startsWith("admin.")
  const isMitraSubdomain = hostname.startsWith("mitra.")

  if (hostname.startsWith("buyer.")) {
    return redirectToBelanjaPortal(request)
  }

  if (isMitraSubdomain) {
    const response = handlePortalSubdomain(request, "/umkm", ["/cetak-qr"])
    if (response) return response
  }

  if (hostname.startsWith("belanja.")) {
    const response = handleBelanjaSubdomain(request)
    if (response) return response
  }

  // Protect admin subdomain pages with Basic Auth (exclude API routes)
  if (isAdminSubdomain && !url.pathname.startsWith("/api") && !url.pathname.startsWith("/_next")) {
    if (!basicAuth(request)) {
      return new NextResponse("Authentication required", {
        status: 401,
        headers: { "WWW-Authenticate": 'Basic realm="Admin Access"', "Content-Type": "text/plain" },
      })
    }
  }

  // Handle admin subdomain routing
  if (isAdminSubdomain) {
    // If at root of admin subdomain, rewrite to /admin
    if (url.pathname === "/") {
      url.pathname = "/admin"
      return NextResponse.rewrite(url)
    }

    // If at /login on admin subdomain, rewrite to /admin/login
    if (url.pathname === "/login") {
      url.pathname = "/admin/login"
      return NextResponse.rewrite(url)
    }

    // If at /signup on admin subdomain, rewrite to /admin/signup
    if (url.pathname === "/signup") {
      url.pathname = "/admin/signup"
      return NextResponse.rewrite(url)
    }

    // For all other paths on admin subdomain, prefix with /admin if not already
    if (
      !url.pathname.startsWith("/admin") &&
      !url.pathname.startsWith("/api") &&
      !url.pathname.startsWith("/_next") &&
      !url.pathname.startsWith("/geo")
    ) {
      url.pathname = `/admin${url.pathname}`
      return NextResponse.rewrite(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Match all paths except static files
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|images|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
