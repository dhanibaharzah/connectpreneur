import { sql } from "@/lib/sql"
import { cookies } from "next/headers"
import { SignJWT, jwtVerify } from "jose"
import bcrypt from "bcryptjs"

// Require JWT_SECRET - fail fast if not set
if (!process.env.JWT_SECRET) {
  console.error("FATAL: JWT_SECRET environment variable is required")
  // In production, this should throw. In development, we'll use a dev-only fallback
  if (process.env.NODE_ENV === "production") {
    throw new Error("JWT_SECRET environment variable is required in production")
  }
}

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "dev-only-secret-do-not-use-in-production"
)

// CSRF token generation and validation
export function generateCSRFToken(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("")
}

export async function verifyCSRFToken(request: Request): Promise<boolean> {
  const csrfHeader = request.headers.get("X-CSRF-Token")
  const cookieStore = await cookies()
  const csrfCookie = cookieStore.get("csrf_token")?.value

  if (!csrfHeader || !csrfCookie) {
    return false
  }

  return csrfHeader === csrfCookie
}

export interface AdminUser {
  id: number
  email: string
  name: string | null
  role: string
  location_id: number | null
}

// Use bcrypt for secure password hashing
const BCRYPT_ROUNDS = 12

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  // Handle migration: if hash is 64 chars (SHA-256), it's an old hash
  if (hash.length === 64 && /^[a-f0-9]+$/i.test(hash)) {
    // Legacy SHA-256 verification for migration period
    const encoder = new TextEncoder()
    const data = encoder.encode(password)
    const hashBuffer = await crypto.subtle.digest("SHA-256", data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const oldHash = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
    return oldHash === hash
  }
  // bcrypt verification
  return bcrypt.compare(password, hash)
}

export async function createSession(user: AdminUser): Promise<string> {
  const token = await new SignJWT({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    location_id: user.location_id,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("24h")
    .sign(JWT_SECRET)

  return token
}

export async function verifySession(token: string): Promise<AdminUser | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as unknown as AdminUser
  } catch {
    return null
  }
}

export async function getSession(): Promise<AdminUser | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("admin_session")?.value

    if (!token) return null

    return verifySession(token)
  } catch {
    return null
  }
}

export async function getSessionFromRequest(request: Request): Promise<AdminUser | null> {
  // Only use cookie for authentication (more secure than Authorization header for browser)
  const cookieHeader = request.headers.get("cookie")
  if (cookieHeader) {
    const cookies = Object.fromEntries(
      cookieHeader.split(";").map((c) => {
        const [key, ...val] = c.trim().split("=")
        return [key, val.join("=")]
      })
    )
    const token = cookies["admin_session"]
    if (token) {
      return verifySession(token)
    }
  }

  // Fallback: Try Authorization header (for API clients)
  const authHeader = request.headers.get("Authorization")
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.substring(7)
    return verifySession(token)
  }

  return null
}

// Rate limiting store (in-memory, for production use Redis)
const loginAttempts = new Map<string, { count: number; firstAttempt: number }>()
const RATE_LIMIT_WINDOW = 15 * 60 * 1000 // 15 minutes
const MAX_ATTEMPTS = 5

export function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now()
  const attempts = loginAttempts.get(ip)

  if (!attempts) {
    loginAttempts.set(ip, { count: 1, firstAttempt: now })
    return { allowed: true }
  }

  // Reset if window has passed
  if (now - attempts.firstAttempt > RATE_LIMIT_WINDOW) {
    loginAttempts.set(ip, { count: 1, firstAttempt: now })
    return { allowed: true }
  }

  if (attempts.count >= MAX_ATTEMPTS) {
    const retryAfter = Math.ceil((RATE_LIMIT_WINDOW - (now - attempts.firstAttempt)) / 1000)
    return { allowed: false, retryAfter }
  }

  attempts.count++
  return { allowed: true }
}

export function resetRateLimit(ip: string): void {
  loginAttempts.delete(ip)
}

export async function login(
  email: string,
  password: string,
): Promise<{ success: boolean; user?: AdminUser; error?: string }> {
  try {
    const users = await sql`
      SELECT id, email, password_hash, name, role, location_id 
      FROM admin_users 
      WHERE email = ${email} AND is_active = true
    `

    if (users.length === 0) {
      return { success: false, error: "Email atau password salah" }
    }

    const user = users[0]
    const isValid = await verifyPassword(password, user.password_hash)

    if (!isValid) {
      return { success: false, error: "Email atau password salah" }
    }

    // If using old SHA-256 hash, upgrade to bcrypt
    if (user.password_hash.length === 64 && /^[a-f0-9]+$/i.test(user.password_hash)) {
      const newHash = await hashPassword(password)
      await sql`UPDATE admin_users SET password_hash = ${newHash} WHERE id = ${user.id}`
      console.log(`[Auth] Migrated password hash to bcrypt for user ${user.id}`)
    }

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        location_id: user.location_id || null,
      },
    }
  } catch (error) {
    console.error("Login error:", error)
    return { success: false, error: "Terjadi kesalahan sistem" }
  }
}

/**
 * Get the list of location IDs that an admin can access.
 * - superadmin or no location_id: returns null (no filter, access all)
 * - kabupaten_kota level: returns the kab/kota ID + all kecamatan IDs under it
 * - kecamatan level: returns just that kecamatan ID
 */
export async function getAdminLocationScope(user: AdminUser): Promise<number[] | null> {
  if (user.role === "superadmin" || !user.location_id) {
    return null // No restriction
  }

  // Get the admin's location to determine its level
  const locations = await sql`
    SELECT id, level FROM locations WHERE id = ${user.location_id}
  `

  if (locations.length === 0) {
    return [] // Location not found, restrict to nothing
  }

  const location = locations[0]

  if (location.level === "kabupaten_kota") {
    // Get the kab/kota itself + all kecamatans under it
    const children = await sql`
      SELECT id FROM locations 
      WHERE id = ${user.location_id} OR parent_id = ${user.location_id}
    `
    return children.map((row: any) => row.id)
  }

  if (location.level === "kecamatan") {
    // Just this kecamatan
    return [user.location_id]
  }

  // provinsi level — same as superadmin (access all under this province)
  return null
}

