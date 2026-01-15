import { neon } from "@neondatabase/serverless"
import { cookies } from "next/headers"
import { SignJWT, jwtVerify } from "jose"

const sql = neon(process.env.DATABASE_URL!)

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "connectpreneur-secret-key-2024")

export interface AdminUser {
  id: number
  email: string
  name: string | null
  role: string
}

export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const passwordHash = await hashPassword(password)
  return passwordHash === hash
}

export async function createSession(user: AdminUser): Promise<string> {
  const token = await new SignJWT({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
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
  // Try cookie first
  let user = await getSession()

  if (!user) {
    // Try Authorization header
    const authHeader = request.headers.get("Authorization")
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.substring(7)
      user = await verifySession(token)
    }
  }

  return user
}

export async function login(
  email: string,
  password: string,
): Promise<{ success: boolean; user?: AdminUser; error?: string }> {
  try {
    const users = await sql`
      SELECT id, email, password_hash, name, role 
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

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    }
  } catch (error) {
    console.error("Login error:", error)
    return { success: false, error: "Terjadi kesalahan sistem" }
  }
}

export async function requireAuth(): Promise<AdminUser> {
  const user = await getSession()
  if (!user) {
    throw new Error("Unauthorized")
  }
  return user
}

export async function requireSuperAdmin(): Promise<AdminUser> {
  const user = await requireAuth()
  if (user.role !== "superadmin") {
    throw new Error("Forbidden")
  }
  return user
}
