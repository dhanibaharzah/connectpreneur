import { type NextRequest, NextResponse } from "next/server"
import { getSession, verifySession } from "@/lib/auth"

export async function GET(request: NextRequest) {
  let user = await getSession()

  if (!user) {
    // Try Authorization header (for preview environment)
    const authHeader = request.headers.get("Authorization")
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.substring(7)
      user = await verifySession(token)
    }
  }

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  return NextResponse.json({ user })
}
