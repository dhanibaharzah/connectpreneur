import { NextResponse } from "next/server"
import { getMarketplaceLocations } from "@/lib/marketplace-products"

export async function GET() {
  try {
    const locations = await getMarketplaceLocations()
    return NextResponse.json({ locations })
  } catch (error) {
    console.error("Error fetching marketplace locations:", error)
    return NextResponse.json({ error: "Gagal memuat lokasi" }, { status: 500 })
  }
}
