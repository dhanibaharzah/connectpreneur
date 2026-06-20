import { type NextRequest, NextResponse } from "next/server"
import { isAdminResponse, requireAdmin } from "@/lib/auth/admin-api"
import {
  getAnalyticsOverview,
  getMitraUniqueVisitors,
  getViewsByKabKota,
  getVisitorOriginByCity,
  getSocialClicksByPlatform,
} from "@/lib/analytics/queries"

export async function GET(request: NextRequest) {
  try {
    const user = await requireAdmin(request)
    if (isAdminResponse(user)) return user

    const [overview, mitraStats, byKabKota, visitorOrigins, socialByPlatform] = await Promise.all([
      getAnalyticsOverview(),
      getMitraUniqueVisitors(),
      getViewsByKabKota(),
      getVisitorOriginByCity(),
      getSocialClicksByPlatform(),
    ])

    return NextResponse.json({
      overview: overview ?? {
        mitra_unique_visitors: 0,
        catalog_unique_visitors: 0,
        catalog_cta_unique: 0,
        whatsapp_submits: 0,
        website_unique: 0,
        social_unique: 0,
        total_events: 0,
      },
      mitraStats,
      byKabKota,
      visitorOrigins,
      socialByPlatform,
    })
  } catch (error) {
    console.error("Admin analytics error:", error)
    return NextResponse.json({ error: "Gagal memuat analytics" }, { status: 500 })
  }
}
