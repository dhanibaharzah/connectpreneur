import { NextResponse } from "next/server"
import { getLocationById } from "@/lib/db"

// GET /api/locations/detail/[id] - Get location detail including parent_id
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const locationId = parseInt(id, 10)

    if (isNaN(locationId)) {
      return NextResponse.json(
        { error: "ID tidak valid" },
        { status: 400 }
      )
    }

    const location = await getLocationById(locationId)
    
    if (!location) {
      return NextResponse.json(
        { error: "Lokasi tidak ditemukan" },
        { status: 404 }
      )
    }

    return NextResponse.json(location)
  } catch (error) {
    console.error("Error fetching location detail:", error)
    return NextResponse.json(
      { error: "Gagal mengambil data lokasi" },
      { status: 500 }
    )
  }
}
