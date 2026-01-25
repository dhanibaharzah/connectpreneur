import { type NextRequest, NextResponse } from "next/server"
import { login, createSession, checkRateLimit, resetRateLimit, generateCSRFToken } from "@/lib/auth"

function getClientIP(request: NextRequest): string {
  // Try various headers for IP
  const forwardedFor = request.headers.get("x-forwarded-for")
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim()
  }
  const realIP = request.headers.get("x-real-ip")
  if (realIP) {
    return realIP
  }
  // Fallback
  return "unknown"
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIP(request)

    // Check rate limit
    const rateLimit = checkRateLimit(ip)
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          error: `Terlalu banyak percobaan login. Silakan coba lagi dalam ${Math.ceil(rateLimit.retryAfter! / 60)} menit.` 
        },
        { 
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.retryAfter),
          }
        }
      )
    }

    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email dan password harus diisi" }, { status: 400 })
    }

    const result = await login(email, password)

    if (!result.success || !result.user) {
      // Don't reset rate limit on failure
      return NextResponse.json({ error: result.error }, { status: 401 })
    }

    // Reset rate limit on successful login
    resetRateLimit(ip)

    const token = await createSession(result.user)

    // Generate CSRF token
    const csrfToken = generateCSRFToken()

    // Response without token in body (more secure)
    const response = NextResponse.json({
      success: true,
      user: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
        role: result.user.role,
      },
      // Token is only in httpOnly cookie, not in response body
    })

    const isProduction = process.env.NODE_ENV === "production"

    // Session cookie - httpOnly for security
    response.cookies.set("admin_session", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    })

    // CSRF token cookie - not httpOnly so JS can read it
    response.cookies.set("csrf_token", csrfToken, {
      httpOnly: false,
      secure: isProduction,
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Login API error:", error)
    return NextResponse.json({ error: "Terjadi kesalahan sistem" }, { status: 500 })
  }
}
