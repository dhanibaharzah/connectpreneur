import { type NextRequest, NextResponse } from "next/server"
import { isAdminResponse, requireAdmin } from "@/lib/auth/admin-api"
import {
  createAdminBusiness,
  deleteAdminBusiness,
  getAdminBusinessById,
  listAdminBusinesses,
  updateAdminBusiness,
} from "@/lib/admin/businesses"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAdmin(request)
    if (isAdminResponse(user)) return user

    const { id } = await params
    const result = await getAdminBusinessById(user, id)

    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: result.status })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Get business error:", error)
    return NextResponse.json({ error: "Gagal mengambil data bisnis" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAdmin(request)
    if (isAdminResponse(user)) return user

    const { id } = await params
    const body = await request.json()
    const result = await updateAdminBusiness(user, id, body)

    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: result.status })
    }

    return NextResponse.json({ success: true, business: result.business })
  } catch (error) {
    console.error("[v0] Update business error:", error)
    return NextResponse.json(
      {
        error: "Gagal mengupdate bisnis",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAdmin(request)
    if (isAdminResponse(user)) return user

    const { id } = await params
    const result = await deleteAdminBusiness(user, id)

    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: result.status })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Delete business error:", error)
    return NextResponse.json({ error: "Gagal menghapus bisnis" }, { status: 500 })
  }
}
