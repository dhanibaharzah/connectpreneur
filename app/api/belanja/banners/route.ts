import { NextResponse } from "next/server"
import { getActiveBanners } from "@/lib/shop-banners"

export async function GET() {
  try {
    const banners = await getActiveBanners()
    return NextResponse.json({ banners })
  } catch (error) {
    console.error("Error fetching shop banners:", error)
    return NextResponse.json({ error: "Gagal memuat banner" }, { status: 500 })
  }
}
