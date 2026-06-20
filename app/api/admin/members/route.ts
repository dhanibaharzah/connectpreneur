import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/sql"
import { isAdminResponse, requireAdmin, requireSuperAdmin } from "@/lib/admin-api"

export async function GET(request: NextRequest) {
  const user = await requireSuperAdmin(request)
  if (isAdminResponse(user)) return user

  const members = await sql`
    SELECT 
      au.id, au.email, au.name, au.role, au.location_id, au.is_active, au.created_at,
      l.name as location_name, l.level as location_level
    FROM admin_users au
    LEFT JOIN locations l ON au.location_id = l.id
    ORDER BY au.is_active ASC, au.created_at DESC
  `

  return NextResponse.json({ members })
}

export async function PATCH(request: NextRequest) {
  const user = await requireSuperAdmin(request)
  if (isAdminResponse(user)) return user

  const { id, action } = await request.json()

  if (!id || !action || !["approve", "reject", "revoke"].includes(action)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }

  if (action === "approve") {
    await sql`
      UPDATE admin_users SET is_active = true WHERE id = ${id}
    `
    return NextResponse.json({ success: true, message: "Anggota telah diaktifkan" })
  }

  if (action === "revoke") {
    await sql`
      UPDATE admin_users SET is_active = false WHERE id = ${id} AND role != 'superadmin'
    `
    return NextResponse.json({ success: true, message: "Akses anggota telah dicabut" })
  }

  if (action === "reject") {
    await sql`DELETE FROM admin_users WHERE id = ${id}`
    return NextResponse.json({ success: true, message: "Anggota telah ditolak dan dihapus" })
  }
}
