import { type NextRequest, NextResponse } from "next/server"
import { isAdminResponse, requireAdmin } from "@/lib/auth/admin-api"
import { createAdminBusiness, listAdminBusinesses } from "@/lib/admin/businesses"

export async function GET(request: NextRequest) {
  try {
    const user = await requireAdmin(request)
    if (isAdminResponse(user)) return user

    const { searchParams } = new URL(request.url)
    const result = await listAdminBusinesses(user, {
      page: Number.parseInt(searchParams.get("page") || "1"),
      limit: Number.parseInt(searchParams.get("limit") || "20"),
      search: searchParams.get("search") || "",
      status: searchParams.get("status") || "all",
      tier: searchParams.get("tier") || "all",
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Get businesses error:", error)
    return NextResponse.json({ error: "Gagal mengambil data bisnis" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAdmin(request)
    if (isAdminResponse(user)) return user

    const body = await request.json()
    const result = await createAdminBusiness(body)

    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: result.status })
    }

    return NextResponse.json({ success: true, business: result.business }, { status: result.status })
  } catch (error) {
    console.error("[v0] Create business error:", error)
    return NextResponse.json(
      {
        error: "Gagal membuat bisnis baru",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
