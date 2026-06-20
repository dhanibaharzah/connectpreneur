import { type NextRequest, NextResponse } from "next/server"
import { getSessionFromRequest, type AdminUser } from "./session"

export function jsonError(message: string, status: number): NextResponse {
  return NextResponse.json({ error: message }, { status })
}

export function isAdminResponse(value: AdminUser | NextResponse): value is NextResponse {
  return value instanceof NextResponse
}

export async function requireAdmin(request: NextRequest): Promise<AdminUser | NextResponse> {
  const user = await getSessionFromRequest(request)
  if (!user) {
    return jsonError("Unauthorized", 401)
  }
  return user
}

/** Preserves members route semantics: unauthenticated requests return 403. */
export async function requireAdminForbidden(
  request: NextRequest,
): Promise<AdminUser | NextResponse> {
  const user = await getSessionFromRequest(request)
  if (!user) {
    return jsonError("Forbidden", 403)
  }
  return user
}

export async function requireSuperAdmin(
  request: NextRequest,
): Promise<AdminUser | NextResponse> {
  const user = await getSessionFromRequest(request)
  if (!user || user.role !== "superadmin") {
    return jsonError("Forbidden", 403)
  }
  return user
}
